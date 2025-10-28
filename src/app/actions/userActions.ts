'use server';
import bcrypt from 'bcrypt';
import * as z from 'zod';

import { generateTokens } from '@/lib/auth';
import connectDb from '@/lib/connectDb';
import { COOKIE_NAMES } from '@/lib/constants';
import {
  LoginInput,
  loginSchema,
  registerSchema,
} from '@/lib/schema/userSchema';
import { isMongoError } from '@/lib/utils';
import User from '@/models/userModel';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
};

export type SafeUser = {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  role: string;
};

export type ResponseState = {
  success: boolean;
  error?: string;
  errors?: Record<string, string[] | undefined>;
  message?: string;
  userId?: string;
  user?: SafeUser;
};

export type InitialState = ResponseState | null;

// Registers a new user
export async function registerUser(
  _initialState: ResponseState,
  formData: FormData,
): Promise<ResponseState> {
  try {
    await connectDb();
    const body = {
      firstName: formData.get('firstName'),
      lastName: formData.get('lastName'),
      email: formData.get('email'),
      username: formData.get('username'),
      password: formData.get('password'),
    };
    const { success, data, error } = registerSchema.safeParse(body);

    if (!success) {
      const errorDetails = z.flattenError(error).fieldErrors;
      return {
        success: false,
        error: 'Validation failed',
        errors: errorDetails,
      };
    }

    const existingUser = await User.findOne({
      $or: [{ email: data.email }, { username: data.username }],
    });

    if (existingUser) {
      const field = existingUser.email === data.email ? 'Email' : 'Username';
      return {
        success: false,
        error: `${field} already in use`,
      };
    }

    const newUser = await User.create({
      ...data,
      role: 'user',
      isEmailVerified: false,
      isActive: true,
    });

    return {
      success: true,
      message: 'Registration Successful',
      userId: newUser._id.toString(),
    };
  } catch (error: unknown) {
    console.error('Registration error:', error);

    if (isMongoError(error) && error.code === 11000) {
      console.error('Duplicate key error:', {
        code: error.code,
        keyPattern: error.keyPattern,
      });
      const field = Object.keys(error.keyPattern)[0];
      return {
        success: false,
        error: `${field === 'email' ? 'Email' : 'Username'} already exists`,
      };
    }

    return { success: false, error: 'Something went wrong. Please try again.' };
  }
}

// Authenticates user and creates secure session
export async function loginUser(formData: LoginInput): Promise<ResponseState> {
  try {
    await connectDb();
    const { success, data, error } = loginSchema.safeParse(formData);

    if (!success) {
      const errorDetails = z.flattenError(error).fieldErrors;
      return {
        success: false,
        error: 'Validation failed',
        errors: errorDetails,
      };
    }

    // Find user and verify password
    const user = await User.findOne({ email: data.email }).select('+password');
    if (!user) return { success: false, error: 'Invalid credentials' };

    const isMatch = await bcrypt.compare(data.password, user.password);
    if (!isMatch) return { success: false, error: 'Invalid credentials' };

    // Generate JWT tokens
    const { accessToken, refreshToken } = generateTokens({
      _id: user._id.toString(),
      role: user.role,
      email: user.email,
    });
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);

    // Store hashed refresh token in database
    const authenticatedUser = await User.findByIdAndUpdate(
      user._id,
      { $set: { refreshToken: hashedRefreshToken } },
      { new: true },
    );
    if (!authenticatedUser)
      return { success: false, error: 'Invalid credentials' };

    // Set secure httpOnly cookies
    const cookieStore = await cookies();

    cookieStore.set({
      name: COOKIE_NAMES.ACCESS_TOKEN,
      value: accessToken,
      maxAge: 1 * 60 * 60, // 1 hour
      ...cookieOptions,
    });

    cookieStore.set({
      name: COOKIE_NAMES.REFRESH_TOKEN,
      value: refreshToken,
      maxAge: 7 * 24 * 60 * 60, // 7 days
      ...cookieOptions,
    });

    // Return serialized user data (client-safe)
    const userObject = {
      id: authenticatedUser._id.toString(),
      email: authenticatedUser.email,
      username: authenticatedUser.username,
      firstName: authenticatedUser.firstName,
      lastName: authenticatedUser.lastName,
      role: authenticatedUser.role,
    };

    return { success: true, user: userObject };
  } catch (error) {
    console.error('Authentication failed:', error);
    return { success: false, error: 'Something went wrong. Please try again.' };
  }
}

// Logs out user and revokes refresh token
export async function logoutUser(): Promise<ResponseState> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get(COOKIE_NAMES.ACCESS_TOKEN)?.value;

    if (accessToken) {
      try {
        const payload = jwt.verify(
          accessToken,
          process.env.JWT_ACCESS_SECRET as string,
        );

        if (typeof payload !== 'string' && payload && 'userId' in payload) {
          await connectDb();
          await User.findByIdAndUpdate(payload.userId, {
            $unset: { refreshToken: 1 },
          });
        }
      } catch {
        // Token invalid/expired - still proceed with logout
      }
    }

    // Delete cookies
    cookieStore.delete({
      name: COOKIE_NAMES.ACCESS_TOKEN,
      path: '/',
    });
    cookieStore.delete({
      name: COOKIE_NAMES.REFRESH_TOKEN,
      path: '/',
    });

    return { success: true, message: 'Logged out successfully' };
  } catch (error) {
    console.error('Logout failed:', error);
    return { success: false, error: 'Something went wrong. Please try again.' };
  }
}
