import { config } from '@/config/config';
import User, { UserType } from '@/models/userModel';
import bcrypt from 'bcrypt';
import { createRemoteJWKSet, jwtVerify } from 'jose';
import jwt, { TokenExpiredError } from 'jsonwebtoken';
import { HydratedDocument } from 'mongoose';
import { ResponseCookie } from 'next/dist/compiled/@edge-runtime/cookies';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { cache } from 'react';
import 'server-only';
import { type AuthMethod } from './authMethod';
import connectDb from './connectDb';
import { COOKIE_NAMES, IS_DEV, IS_PROD, OAUTH_ERRORS } from './constants';
import {
  GoogleIdTokenPayload,
  googleIdTokenPayloadSchema,
  GoogleTokenResponse,
  googleTokenResponseSchema,
} from './schema/oauthSchema';

const GOOGLE_JWKS = createRemoteJWKSet(
  new URL('https://www.googleapis.com/oauth2/v3/certs'),
);

type OAuthErrorCode = (typeof OAUTH_ERRORS)[keyof typeof OAUTH_ERRORS];

export class GoogleOAuthError extends Error {
  constructor(
    public code: OAuthErrorCode,
    message?: string,
  ) {
    super(message ?? code);
    this.name = 'GoogleOAuthError';
  }
}

export const cookieOptions: Partial<ResponseCookie> = {
  httpOnly: true,
  secure: IS_PROD,
  sameSite: 'lax',
  path: '/',
};

export type AuthResult =
  | {
      isAuthenticated: true;
      user: {
        userId: string;
        email: string;
        role: string;
        firstName: string;
        lastName: string;
        profilePicture: string | null | undefined;
        username: string;
      };
      error: null;
    }
  | { isAuthenticated: false; user: null; error: string };

export type TokenPayload = {
  userId: string;
  email: string;
  role: string;
  type: 'access' | 'refresh';
};

// Generates access and refresh JWT tokens for a given user.
export function generateTokens({
  _id,
  email,
  role,
}: {
  _id: string;
  email: string;
  role: string;
}) {
  const accessToken = jwt.sign(
    {
      userId: _id,
      email,
      role,
      type: 'access',
    },
    config.JWT_ACCESS_SECRET,
    { expiresIn: config.JWT_ACCESS_EXPIRY },
  );

  const refreshToken = jwt.sign(
    {
      userId: _id,
      type: 'refresh',
    },
    config.JWT_REFRESH_SECRET,
    { expiresIn: config.JWT_REFRESH_EXPIRY },
  );

  return { accessToken, refreshToken };
}

// Verifies and decodes a JWT token, returning its payload or an error.
export async function verifyToken(
  token: string | undefined,
): Promise<
  { success: true; payload: TokenPayload } | { success: false; error: string }
> {
  if (!token) {
    return { success: false, error: 'Invalid token' };
  }

  try {
    const payload = jwt.verify(token, config.JWT_ACCESS_SECRET);

    if (typeof payload === 'string' || !payload?.userId) {
      return { success: false, error: 'Invalid token' };
    }

    return {
      success: true,
      payload: payload as TokenPayload,
    };
  } catch (error) {
    console.error('Token verification error:', error);
    if (error instanceof TokenExpiredError) {
      return { success: false, error: 'Token expired' };
    }
    return { success: false, error: 'Invalid token' };
  }
}

// Validates user authentication using the access token stored in cookies.
export const verifyAuth = cache(async (): Promise<AuthResult> => {
  try {
    await connectDb();
    const cookieStore = await cookies();
    const accessToken = cookieStore.get(COOKIE_NAMES.ACCESS_TOKEN)?.value;

    const tokenResult = await verifyToken(accessToken);

    if (!tokenResult.success) {
      return {
        isAuthenticated: false,
        error: 'Authentication required',
        user: null,
      };
    }

    const user = await User.findById(tokenResult.payload.userId)
      .select('email firstName lastName role profilePicture username')
      .lean();

    if (!user) {
      return {
        isAuthenticated: false,
        error: 'Authentication required',
        user: null,
      };
    }

    return {
      isAuthenticated: true,
      error: null,
      user: {
        userId: user._id.toString(),
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        profilePicture: user.profilePicture,
        username: user.username,
      },
    };
  } catch (error) {
    if (IS_DEV) console.error('Auth error:', error);

    return {
      isAuthenticated: false,
      error: 'Authentication required',
      user: null,
    };
  }
});

export async function createAuthResponse(
  user: HydratedDocument<UserType>,
  request: NextRequest,
  provider: AuthMethod,
) {
  const { accessToken, refreshToken } = generateTokens({
    _id: user._id.toString(),
    role: user.role,
    email: user.email,
  });

  // Persist a hashed refresh token so sessions can be securely rotated or revoked.
  const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
  user.refreshToken = hashedRefreshToken;
  await user.save();

  const url = new URL('/', request.url);
  url.searchParams.set('provider', provider);
  url.searchParams.set('oauth', 'success');

  const response = NextResponse.redirect(url);

  response.cookies.set({
    name: COOKIE_NAMES.ACCESS_TOKEN,
    value: accessToken,
    maxAge: config.JWT_ACCESS_EXPIRY,
    ...cookieOptions,
  });

  response.cookies.set({
    name: COOKIE_NAMES.REFRESH_TOKEN,
    value: refreshToken,
    maxAge: config.JWT_REFRESH_EXPIRY,
    ...cookieOptions,
  });

  clearOAuthCookies(response);

  return response;
}

export async function findOrCreateGoogleUser(
  payload: GoogleIdTokenPayload,
): Promise<HydratedDocument<UserType>> {
  await connectDb();

  if (!payload.email) throw new GoogleOAuthError(OAUTH_ERRORS.EMAIL_REQUIRED);

  const existingUser = await User.findOne({ googleId: payload.sub });
  if (existingUser) return existingUser;

  // Link Google login to an existing account with the same email.
  const userByEmail = await User.findOne({ email: payload.email });
  if (userByEmail) {
    userByEmail.googleId = payload.sub;
    if (!userByEmail.profilePicture && payload.picture) {
      userByEmail.profilePicture = payload.picture;
    }
    await userByEmail.save();
    return userByEmail;
  }

  // Generate a fallback unique username for first-time OAuth users.
  const username = payload.given_name
    ? `${payload.given_name.toLowerCase().replace(/\s+/g, '')}_${Date.now()}`
    : `user_${Date.now()}`;

  const newUser = await User.create({
    email: payload.email,
    firstName: payload.given_name ?? 'FirstName',
    lastName: payload.family_name ?? 'LastName',
    profilePicture: payload.picture,
    username,
    role: 'user',
    isEmailVerified: payload.email_verified ?? false,
    isActive: true,
    googleId: payload.sub,
  });

  return newUser;
}

export async function exchangeGoogleCode(
  code: string,
): Promise<GoogleTokenResponse> {
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: config.GOOGLE_CLIENT_ID,
      client_secret: config.GOOGLE_CLIENT_SECRET,
      redirect_uri: config.GOOGLE_REDIRECT_URI,
      grant_type: 'authorization_code',
    }),
  });
  if (!res.ok) {
    const error: unknown = await res.json();
    console.error('Token exchange failed:', error);
    throw new GoogleOAuthError(OAUTH_ERRORS.TOKEN_EXCHANGE_FAILED);
  }

  const json: unknown = await res.json();
  return googleTokenResponseSchema.parse(json);
}

export async function verifyGoogleIdToken(
  idToken: string,
): Promise<GoogleIdTokenPayload> {
  const { payload } = await jwtVerify(idToken, GOOGLE_JWKS, {
    audience: config.GOOGLE_CLIENT_ID,
    issuer: ['https://accounts.google.com', 'accounts.google.com'],
  });

  return googleIdTokenPayloadSchema.parse(payload);
}

export function clearOAuthCookies(response: NextResponse) {
  response.cookies.delete(COOKIE_NAMES.OAUTH_STATE);
  response.cookies.delete(COOKIE_NAMES.OAUTH_INTENT);
}

export async function getHasPassword(userId: string): Promise<boolean> {
  const user = await User.findById(userId).select('+password').lean();
  return !!user?.password;
}
