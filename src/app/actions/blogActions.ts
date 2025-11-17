'use server';

import { verifyAuth } from '@/lib/auth';
import {
  calculateReadTime,
  generateMetaDescription,
  generateSimpleSlug,
  generateUniqueSlug,
} from '@/lib/blog';
import { uploadOnCloudinary } from '@/lib/cloudinary';
import connectDb from '@/lib/connectDb';
import { CreateBlogInput, createBlogSchema } from '@/lib/schema/blogSchema';
import { isMongoError } from '@/lib/utils';
import Blog from '@/models/blogModel';
import Category from '@/models/categoryModel';
import Tag from '@/models/tagModel';
import { v2 as cloudinary } from 'cloudinary';
import * as z from 'zod';

type ResponseState =
  | {
      success: true;
      message: string;
      data?: unknown;
    }
  | {
      success: false;
      message: string;
      errors?: Partial<Record<keyof CreateBlogInput, string[]>>;
    };

// Authenticates user and creates a blog post
export async function createBlog(
  formData: CreateBlogInput,
): Promise<ResponseState> {
  try {
    await connectDb();

    // Verify user authentication before proceeding
    const {
      error: authenticationError,
      isAuthenticated,
      user,
    } = await verifyAuth();
    if (!isAuthenticated) {
      return { success: false, message: authenticationError };
    }

    // Validate blog input using Zod schema
    const {
      success,
      data: blogData,
      error,
    } = createBlogSchema.safeParse(formData);
    if (!success) {
      const errorDetails = z.flattenError(error).fieldErrors;
      return {
        success: false,
        message: 'Validation failed',
        errors: errorDetails,
      };
    }

    // Upsert tags and collect their IDs
    const tagIdPromises = blogData.tags.map(async (tagName) => {
      const tag = await Tag.findOneAndUpdate(
        { name: tagName },
        {
          $setOnInsert: {
            name: tagName,
            slug: generateSimpleSlug(tagName),
            createdBy: user.userId,
          },
        },
        { upsert: true, new: true },
      );
      return tag._id;
    });

    // Validate category existence
    const [isCategoryValid, ...tagIds] = await Promise.all([
      Category.exists({ _id: blogData.categoryId }),
      ...tagIdPromises,
    ]);
    if (!isCategoryValid) {
      return { message: 'Category not found', success: false };
    }

    // Upload cover image to Cloudinary if provided
    const coverImage = blogData.banner;
    let coverImageUrl: string | undefined;
    let coverImagePublicId: string | undefined;
    let blurDataUrl: string | undefined;

    if (coverImage) {
      const uploadResult = await uploadOnCloudinary(coverImage, 'blog-covers');

      if (!uploadResult.success) {
        return {
          success: false,
          message: `Image upload failed: ${uploadResult.error}`,
        };
      }

      coverImageUrl = uploadResult.url;
      coverImagePublicId = uploadResult.publicId;
    }

    // Generate blurred placeholder image as base64 data URL from Cloudinary
    if (coverImagePublicId) {
      const cloudinaryUrl = cloudinary.url(coverImagePublicId, {
        width: 100,
        quality: 'auto',
        effect: 'blur:500',
        fetch_format: 'webp',
      });

      const response = await fetch(cloudinaryUrl);
      const buffer = await response.arrayBuffer();

      // Convert buffer to base64 string
      const base64 = Buffer.from(buffer).toString('base64');

      // Convert to base64 data URI
      blurDataUrl = `data:image/webp;base64,${base64}`;
    }

    // Store blog data along with image URLs and blurDataURL in database
    const newBlog = await Blog.create({
      ...blogData,
      tags: tagIds,
      banner: coverImageUrl,
      bannerPublicId: coverImagePublicId,
      blurDataUrl: blurDataUrl,
      metaDescription: generateMetaDescription(blogData.description),
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

    // Handle duplicate blog title error gracefully
    if (isMongoError(error) && error.code === 11000) {
      return {
        success: false,
        message:
          'A blog with this title already exists. Please choose a different title.',
      };
    }

    return {
      success: false,
      message: 'Something went wrong. Please try again.',
    };
  }
}

// Deletes a blog post after verifying authentication and ownership
export async function deleteBlog(blogId: string): Promise<ResponseState> {
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
