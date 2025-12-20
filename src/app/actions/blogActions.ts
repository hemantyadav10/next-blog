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
import { Blog, Category, Tag } from '@/models';
import { BlogDocument } from '@/models/blogModel';
import { ActionResponse } from '@/types/api.types';
import {
  AuthorBlogsResponse,
  BlogListItem,
  CategoryBlogsResponse,
} from '@/types/blog.types';
import { v2 as cloudinary } from 'cloudinary';
import {
  AggregatePaginateResult,
  FilterQuery,
  isValidObjectId,
  PipelineStage,
  SortValues,
} from 'mongoose';
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

// Fetches all blogs wiith searching, filtering and sorting functionality
export const getAllBlogs = async ({
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
}): Promise<ActionResponse<AggregatePaginateResult<BlogListItem>>> => {
  try {
    await connectDb();
    let sortOption: Record<string, SortValues | { $meta: string }> = {};

    if (sortBy && sortOrder) {
      const order = sortOrder === 'asc' ? 1 : -1;

      if (sortBy === 'popularity') {
        // TODO: Implement popularity sorting based on engagement metrics (views/likes/comments)
        sortOption = { title: 1 };
      } else if (sortBy === 'publishedAt') {
        sortOption = { publishedAt: order };
      } else {
        sortOption = { publishedAt: -1 };
      }
    } else if (query) {
      sortOption = { score: { $meta: 'textScore' } };
    } else {
      sortOption = { publishedAt: -1 };
    }

    const pipeline: PipelineStage[] = [];

    if (query && typeof query === 'string') {
      pipeline.push({
        $match: {
          $text: { $search: query },
        },
      });
    }

    pipeline.push(
      { $match: { status: 'published' } },
      {
        $lookup: {
          from: 'users',
          foreignField: '_id',
          localField: 'authorId',
          as: 'authorId',
          pipeline: [
            {
              $project: {
                username: 1,
                firstName: 1,
                lastName: 1,
                profilePicture: 1,
              },
            },
          ],
        },
      },
      {
        $addFields: {
          authorId: { $first: '$authorId' },
        },
      },
      {
        $project: {
          authorId: 1,
          banner: 1,
          blurDataUrl: 1,
          description: 1,
          publishedAt: 1,
          readTime: 1,
          slug: 1,
          title: 1,
        },
      },
    );

    const aggregate = Blog.aggregate<BlogListItem>(pipeline);

    const result = await Blog.aggregatePaginate(aggregate, {
      sort: sortOption,
      limit,
      page,
    });

    return {
      success: true,
      data: JSON.parse(JSON.stringify(result)),
    };
  } catch (error) {
    console.error('Error fetching blogs:', error);

    return {
      success: false,
      error: 'Failed to fetch blogs. Please try again.',
    };
  }
};

export const getCategoryLatestBlogs = async ({
  limit = 12,
  page = 1,
  categoryId,
}: {
  limit?: number;
  page?: number;
  categoryId: string;
}): Promise<ActionResponse<CategoryBlogsResponse>> => {
  try {
    await connectDb();

    if (!isValidObjectId(categoryId)) {
      return {
        success: false,
        error: 'Invalid Category Id',
      };
    }

    const filter: FilterQuery<BlogDocument> = {
      categoryId: categoryId,
      status: 'published',
    };

    const skip = (page - 1) * limit;
    const totalDocs = await Blog.countDocuments(filter);
    const blogs = await Blog.find(filter)
      .populate('authorId', 'username  firstName  lastName profilePicture')
      .select(
        'authorId banner blurDataUrl description publishedAt readTime slug title',
      )
      .sort({ publishedAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    return {
      success: true,
      data: {
        docs: JSON.parse(JSON.stringify(blogs)),
        hasNextPage: skip + limit < totalDocs,
        nextPage: skip + limit < totalDocs ? page + 1 : null,
      },
    };
  } catch (error) {
    console.error('Error fetching blogs:', error);

    return {
      success: false,
      error: 'Failed to load blogs. Please try again.',
    };
  }
};

export const getAuthorBlogs = async ({
  limit = 12,
  page = 1,
  authorId,
}: {
  limit?: number;
  page?: number;
  authorId: string;
}): Promise<ActionResponse<AuthorBlogsResponse>> => {
  try {
    await connectDb();

    if (!isValidObjectId(authorId)) {
      return {
        success: false,
        error: 'Invalid author Id',
      };
    }

    const filter: FilterQuery<BlogDocument> = {
      authorId: authorId,
      status: 'published',
    };

    const skip = (page - 1) * limit;

    const blogs = await Blog.find(filter)
      .populate('authorId', 'username  firstName  lastName profilePicture')
      .select(
        'authorId banner blurDataUrl description publishedAt readTime slug title',
      )
      .sort({ publishedAt: -1 })
      .skip(skip)
      .limit(limit + 1)
      .lean();

    const hasNextPage = blogs.length > limit;
    if (hasNextPage) blogs.pop();

    return {
      success: true,
      data: {
        docs: JSON.parse(JSON.stringify(blogs)),
        hasNextPage,
        nextPage: hasNextPage ? page + 1 : null,
      },
    };
  } catch (error) {
    console.error('Error fetching blogs:', error);

    return {
      success: false,
      error: 'Failed to load blogs. Please try again.',
    };
  }
};
