'use server';
import * as z from 'zod';

import connectDb from '@/lib/connectDb';
import { registerSchema } from '@/lib/schema/userSchema';
import { isMongoError } from '@/lib/utils';
import User from '@/models/userModel';

export type RegisterState = {
  success: boolean;
  error?: string;
  details?: Record<string, string[]>;
  message?: string;
  userId?: string;
} | null;

export async function registerUser(
  _initialState: RegisterState,
  formData: FormData,
) {
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
        details: errorDetails,
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
