import User from '@/models/userModel';
import jwt, { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { cookies } from 'next/headers';
import connectDb from './connectDb';
import { COOKIE_NAMES, IS_DEV } from './constants';

export type AuthResult =
  | {
      isAuthenticated: true;
      user: {
        userId: string;
        email: string;
        role: string;
        fullName: string;
        profilePicture: string | null | undefined;
      };
      error: null;
    }
  | { isAuthenticated: false; user: null; error: string };

// function to generate refresh and access token
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

// Verifies user authentication by validating JWT access token from cookies
export async function verifyAuth(): Promise<AuthResult> {
  try {
    await connectDb();
    const cookieStore = await cookies();
    const accessToken = cookieStore.get(COOKIE_NAMES.ACCESS_TOKEN)?.value;

    if (!accessToken) {
      return {
        isAuthenticated: false,
        error: 'Authentication required',
        user: null,
      };
    }

    const payload = jwt.verify(
      accessToken,
      process.env.JWT_ACCESS_SECRET as string,
    );

    if (typeof payload === 'string' || !payload?.userId) {
      return {
        isAuthenticated: false,
        error: 'Invalid or expired token',
        user: null,
      };
    }

    const user = await User.findById(payload.userId)
      .select('email firstName lastName role profilePicture')
      .lean();

    if (!user) {
      return {
        isAuthenticated: false,
        error: 'User not found',
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
        fullName: `${user.firstName} ${user.lastName}`,
        profilePicture: user.profilePicture,
      },
    };
  } catch (error) {
    let errorMessage = 'Authentication failed';

    if (error instanceof TokenExpiredError) {
      errorMessage = 'Token expired';
    } else if (error instanceof JsonWebTokenError) {
      errorMessage = 'Invalid token';
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }

    if (IS_DEV) console.error(error);

    return {
      isAuthenticated: false,
      error: errorMessage,
      user: null,
    };
  }
}
