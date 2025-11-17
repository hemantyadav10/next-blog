import { verifyAuth } from '@/lib/auth';
import { generateSimpleSlug } from '@/lib/blog';
import connectDb from '@/lib/connectDb';
import { createCategorySchema } from '@/lib/schema/categorySchema';
import { isMongoError } from '@/lib/utils';
import Category from '@/models/categoryModel';
import { NextRequest } from 'next/server';
import * as z from 'zod';

async function generateUniqueSlug(name: string): Promise<string> {
  const baseSlug = generateSimpleSlug(name);
  let slug = baseSlug;
  let suffix = 1;

  while (await Category.exists({ slug })) {
    slug = `${baseSlug}-${suffix}`;
    suffix++;
  }

  return slug;
}

export async function POST(request: NextRequest) {
  try {
    await connectDb();

    const {
      isAuthenticated,
      error: authenticationError,
      user,
    } = await verifyAuth();
    if (!isAuthenticated) {
      return Response.json(
        { success: false, error: authenticationError },
        { status: 401 },
      );
    }

    if (user.role !== 'admin') {
      return Response.json(
        { success: false, error: 'Access denied. Admin privileges required.' },
        { status: 403 },
      );
    }

    const body = await request.json();

    const { success, data, error } = createCategorySchema.safeParse(body);
    if (!success) {
      return Response.json(
        {
          success: false,
          error: 'validation error',
          errors: z.flattenError(error).fieldErrors,
        },
        { status: 400 },
      );
    }

    const slug = await generateUniqueSlug(data.name);

    const category = await Category.create({
      ...data,
      createdBy: user.userId,
      slug,
    });

    return Response.json(
      {
        success: true,
        message: 'Category created successfully',
        data: category,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error('Error while creating category:', error);

    if (isMongoError(error) && error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];

      return Response.json(
        {
          success: false,
          error:
            field === 'name'
              ? 'A category with this name already exists'
              : 'An unexpected error occurred. Please try again.',
        },
        { status: 409 },
      );
    }

    return Response.json(
      { success: false, error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
