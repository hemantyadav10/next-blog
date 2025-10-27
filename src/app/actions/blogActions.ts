'use server';

import { verifyAuth } from '@/lib/auth';
import {
  calculateReadTime,
  generateMetaDescription,
  generateUniqueSlug,
} from '@/lib/blog';
import connectDb from '@/lib/connectDb';
import { createBlogSchema } from '@/lib/schema/blogSchema';
import Blog from '@/models/blogModel';
import Category from '@/models/categoryModel';
import Tag from '@/models/tagModel';
import * as z from 'zod';

export type FormState = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
  data?: unknown;
} | null;

// Authenticates user and creates a blog post
export async function createBlog(
  _initialState: FormState,
  formData: FormData,
): Promise<FormState> {
  try {
    await connectDb();
    const {
      error: authenticationError,
      isAuthenticated,
      user,
    } = await verifyAuth();

    if (!isAuthenticated) {
      return { success: false, message: authenticationError };
    }

    const parsedData = Object.fromEntries(formData.entries());

    let formTags: string[] = [];

    if (typeof parsedData.tags === 'string' && parsedData?.tags) {
      formTags = parsedData.tags.split(',').map((tag) => tag.trim());
    }

    const {
      success,
      data: blogData,
      error,
    } = createBlogSchema.safeParse({
      ...parsedData,
      isCommentsEnabled: Boolean(parsedData.isCommentsEnabled),
      tags: formTags,
    });

    if (!success) {
      const errorDetails = z.flattenError(error).fieldErrors;
      return {
        success: false,
        message: 'Validation failed',
        errors: errorDetails,
      };
    }

    const { categoryId, tags } = blogData;

    const tagExistencePromises = tags.map((tag) => Tag.exists({ _id: tag }));

    const [isCategoryValid, ...tagsExistence] = await Promise.all([
      Category.exists({ _id: categoryId }),
      ...tagExistencePromises,
    ]);

    if (!isCategoryValid) {
      return { message: 'Category not found', success: false };
    }

    const invalidTags = tagsExistence
      .map((exists, index) => (!exists ? index : null))
      .filter((i) => i !== null);

    if (invalidTags.length > 0) {
      return { message: 'Invalid tags', success: false };
    }

    const newBlog = await Blog.create({
      ...blogData,
      metaDescription: generateMetaDescription(blogData.content),
      slug: generateUniqueSlug(blogData.title),
      readTime: calculateReadTime(blogData.content),
      authorId: user.userId,
      publishedAt: blogData.status === 'published' ? new Date() : undefined,
    });

    return {
      message: 'Blog created successfully',
      success: true,
      data: { blogId: newBlog._id.toString() },
    };
  } catch (error) {
    console.error('Blog creation failed:', error);
    return {
      success: false,
      message: 'Something went wrong. Please try again.',
    };
  }
}

// Deletes a blog post after verifying authentication and ownership
export async function deleteBlog(blogId: string): Promise<FormState> {
  try {
    await connectDb();
    const {
      error: authenticationError,
      isAuthenticated,
      user,
    } = await verifyAuth();

    if (!isAuthenticated) {
      return { success: false, message: authenticationError };
    }

    // Find the blog and check if it exists
    const blog = await Blog.findById(blogId).select('authorId');
    if (!blog) {
      return {
        message: 'Blog not found or has been deleted',
        success: false,
      };
    }

    // Ensure the authenticated user owns the blog
    if (!blog.authorId.equals(user.userId)) {
      return {
        message: 'Unauthorized request',
        success: false,
      };
    }

    // Delete the blog
    await blog.deleteOne();

    return {
      message: 'Blog deleted successfully',
      success: true,
    };
  } catch (error) {
    console.error('Blog deletion failed:', error);
    return {
      success: false,
      message: 'Something went wrong. Please try again.',
    };
  }
}
