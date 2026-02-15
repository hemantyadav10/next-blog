import User from '@/models/userModel';
import jwt, { TokenExpiredError } from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { cache } from 'react';
import 'server-only';
import connectDb from './connectDb';
import { COOKIE_NAMES, IS_DEV } from './constants';

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
    process.env.JWT_ACCESS_SECRET as string,
    { expiresIn: '1h' },
  );

  const refreshToken = jwt.sign(
    {
      userId: _id,
      type: 'refresh',
    },
    process.env.JWT_REFRESH_SECRET as string,
    { expiresIn: '7d' },
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
    const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET as string);

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
