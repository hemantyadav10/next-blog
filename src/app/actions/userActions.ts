'use server';
import bcrypt from 'bcrypt';
import * as z from 'zod';

import { generateTokens, verifyAuth } from '@/lib/auth';
import connectDb from '@/lib/connectDb';
import { COOKIE_NAMES } from '@/lib/constants';
import {
  ChangePasswordInput,
  changePasswordSchema,
} from '@/lib/schema/authSchema';
import {
  LoginInput,
  loginSchema,
  RegisterInput,
  registerSchema,
} from '@/lib/schema/userSchema';
import { isMongoError } from '@/lib/utils';
import User, { UserType } from '@/models/userModel';
import type { ActionResponse } from '@/types/api.types';
import { UsersResponse } from '@/types/user.types';
import jwt from 'jsonwebtoken';
import { FilterQuery, SortValues } from 'mongoose';
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

type Response<T = unknown> =
  | { success: true; message: string; data?: T }
  | {
      success: false;
      error: string;
      errors?: Record<string, string[] | undefined>;
    };

// Registers a new user
export async function registerUser(
  formData: RegisterInput,
): Promise<ResponseState> {
  try {
    await connectDb();
    const { success, data, error } = registerSchema.safeParse(formData);

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

export const getAllUsers = async ({
  query,
  sortBy,
  sortOrder,
  limit = 12,
  page = 1,
}: {
  query?: string;
  sortBy?: string;
  sortOrder?: string;
  limit?: number;
  page?: number;
}): Promise<ActionResponse<UsersResponse>> => {
  try {
    await connectDb();
    const filter: FilterQuery<UserType> = {};

    if (query && typeof query === 'string') {
      const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      filter.$or = [
        { username: { $regex: `^${escapedQuery}`, $options: 'i' } },
        { firstName: { $regex: `^${escapedQuery}`, $options: 'i' } },
        { lastName: { $regex: `^${escapedQuery}`, $options: 'i' } },
      ];
    }

    let sortOption: Record<string, SortValues> = {};

    if (sortBy && sortOrder) {
      const order = sortOrder === 'asc' ? 1 : -1;

      if (sortBy === 'popularity') {
        // TODO: Implement popularity sorting
        sortOption = { firstName: 1 };
      } else if (sortBy === 'publishedAt') {
        sortOption = { createdAt: order };
      } else {
        sortOption = { createdAt: -1 };
      }
    } else {
      sortOption = { createdAt: -1 };
    }

    const skip = (page - 1) * limit;
    const totalDocs = await User.countDocuments(filter);

    const users = await User.find(filter)
      .select('firstName lastName username bio profilePicture')
      .sort(sortOption)
      .skip(skip)
      .limit(limit)
      .lean();

    return {
      success: true,
      data: {
        docs: JSON.parse(JSON.stringify(users)),
        hasNextPage: skip + limit < totalDocs,
        nextPage: skip + limit < totalDocs ? page + 1 : null,
      },
    };
  } catch (error) {
    console.error('Error fetching users:', error);

    return {
      success: false,
      error: 'Failed to fetch users. Please try again.',
    };
  }
};

export async function changePassword(
  formData: ChangePasswordInput,
): Promise<Response<{ updated: true }>> {
  try {
    // Connect to databasse
    await connectDb();

    // Verify user is authenticated and get user ID
    const {
      error: authenticationError,
      isAuthenticated,
      user: currentUser,
    } = await verifyAuth();
    if (!isAuthenticated)
      return { success: false, error: authenticationError || 'Unauthorized' };

    // Validate input with Zod schema
    const { success, data, error } = changePasswordSchema.safeParse(formData);
    if (!success) {
      return {
        success: false,
        error: 'Validation failed',
        errors: z.flattenError(error).fieldErrors,
      };
    }

    // Fetch user with password field (excluded by default)
    const user = await User.findById(currentUser.userId).select('+password');
    if (!user) return { success: false, error: 'User not found' };

    // Verify current password matches
    const isMatch = await bcrypt.compare(data.currentPassword, user.password);
    if (!isMatch)
      return { success: false, error: 'Current password is incorrect' };

    // Update password (pre-save hook handles bcrypt automatically)
    user.password = data.newPassword;
    await user.save();

    return {
      success: true,
      message: 'Password changed successfully',
      data: { updated: true },
    };
  } catch (error) {
    console.error('Change password failed:', error);
    return { success: false, error: 'Server error. Please try again later.' };
  }
}
