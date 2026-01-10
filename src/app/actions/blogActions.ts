'use server';

import { verifyAuth } from '@/lib/auth';
import {
  calculateReadTime,
  generateMetaDescription,
  generateSimpleSlug,
  generateUniqueSlug,
} from '@/lib/blog';
import { deleteFromCloudinary, uploadOnCloudinary } from '@/lib/cloudinary';
import connectDb from '@/lib/connectDb';
import { CreateBlogInput, createBlogSchema } from '@/lib/schema/blogSchema';
import { isMongoError } from '@/lib/utils';
import { Blog, Category, Tag } from '@/models';
import { BlogDocument } from '@/models/blogModel';
import { ActionResponse } from '@/types/api.types';
import {
  AuthorBlogsResponse,
  BlogListItem,
  BlogsResponse,
  CategoryBlogsResponse,
} from '@/types/blog.types';
import { v2 as cloudinary } from 'cloudinary';
import {
  FilterQuery,
  isValidObjectId,
  PipelineStage,
  SortValues,
  Types,
} from 'mongoose';
import * as z from 'zod';

// Authenticates user and creates a blog post
export async function createBlog(
  formData: CreateBlogInput,
): Promise<ActionResponse<{ blogId: string; slug: string }>> {
  try {
    await connectDb();

    // Verify user authentication before proceeding
    const {
      error: authenticationError,
      isAuthenticated,
      user,
    } = await verifyAuth();
    if (!isAuthenticated) {
      return { success: false, error: authenticationError };
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
        error: 'Validation failed',
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
      return { error: 'Category not found', success: false };
    }

    // Upload cover image to Cloudinary if provided
    const coverImage = blogData.banner;
    let coverImageUrl: string | undefined;
    let coverImagePublicId: string | undefined;
    let blurDataUrl: string | undefined;

    // Only upload if banner is a File (new upload)
    if (coverImage instanceof File) {
      const uploadResult = await uploadOnCloudinary(coverImage, 'blog-covers');

      if (!uploadResult.success) {
        return {
          success: false,
          error: `Image upload failed: ${uploadResult.error}`,
        };
      }

      coverImageUrl = uploadResult.url;
      coverImagePublicId = uploadResult.publicId;
    } else if (typeof coverImage === 'string') {
      coverImageUrl = coverImage;
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
      data: { blogId: newBlog._id.toString(), slug: newBlog.slug },
    };
  } catch (error) {
    console.error('Blog creation failed:', error);

    // Handle duplicate blog title error gracefully
    if (isMongoError(error) && error.code === 11000) {
      return {
        success: false,
        error:
          'A blog with this title already exists. Please choose a different title.',
      };
    }

    return {
      success: false,
      error: 'Something went wrong. Please try again.',
    };
  }
}

// Updates an existing blog post
export async function updateBlog(
  blogId: string,
  formData: CreateBlogInput,
): Promise<ActionResponse<{ blogId: string; slug: string }>> {
  try {
    await connectDb();

    // Verify user authentication
    const {
      error: authenticationError,
      isAuthenticated,
      user,
    } = await verifyAuth();
    if (!isAuthenticated) {
      return { success: false, error: authenticationError };
    }

    // Find the existing blog
    const existingBlog = await Blog.findById(blogId);
    if (!existingBlog) {
      return { success: false, error: 'Blog not found' };
    }

    // Check if user owns the blog
    if (existingBlog.authorId.toString() !== user.userId) {
      return { success: false, error: 'Unauthorized' };
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
        error: 'Validation failed',
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
      return { error: 'Category not found', success: false };
    }

    // Handle banner image update
    const coverImage = blogData.banner;
    let coverImageUrl = existingBlog.banner; // Keep existing by default
    let coverImagePublicId = existingBlog.bannerPublicId;
    let blurDataUrl = existingBlog.blurDataUrl;

    // Only upload if banner is a new File
    if (coverImage instanceof File) {
      // Upload new image
      const uploadResult = await uploadOnCloudinary(coverImage, 'blog-covers');

      if (!uploadResult.success) {
        return {
          success: false,
          error: `Image upload failed: ${uploadResult.error}`,
        };
      }

      coverImageUrl = uploadResult.url;
      coverImagePublicId = uploadResult.publicId;

      // Generate new blurred placeholder
      if (coverImagePublicId) {
        const cloudinaryUrl = cloudinary.url(coverImagePublicId, {
          width: 100,
          quality: 'auto',
          effect: 'blur:500',
          fetch_format: 'webp',
        });

        const response = await fetch(cloudinaryUrl);
        const buffer = await response.arrayBuffer();
        const base64 = Buffer.from(buffer).toString('base64');
        blurDataUrl = `data:image/webp;base64,${base64}`;
      }

      // Delete old image from Cloudinary if it exists
      if (existingBlog.bannerPublicId) {
        deleteFromCloudinary(existingBlog.bannerPublicId).catch((err) => {
          console.warn('Old image cleanup failed (non-critical):', err);
        });
      }
    }
    // If banner is a string and matches existing, no change needed

    // Update the blog
    const updatedBlog = await Blog.findByIdAndUpdate(
      blogId,
      {
        ...blogData,
        tags: tagIds,
        banner: coverImageUrl,
        bannerPublicId: coverImagePublicId,
        blurDataUrl: blurDataUrl,
        metaDescription: generateMetaDescription(blogData.description),
        readTime: calculateReadTime(blogData.content),
        publishedAt:
          blogData.status === 'published' && existingBlog.status === 'draft'
            ? new Date()
            : existingBlog.publishedAt,
        isEdited: true,
        editedAt: new Date(),
      },
      { new: true },
    );

    if (!updatedBlog) {
      return {
        success: false,
        error: 'Failed to update blog',
      };
    }

    return {
      message: 'Blog updated successfully',
      success: true,
      data: { blogId: updatedBlog._id.toString(), slug: updatedBlog.slug },
    };
  } catch (error) {
    console.error('Blog update failed:', error);

    // Handle duplicate blog title error
    if (isMongoError(error) && error.code === 11000) {
      return {
        success: false,
        error:
          'A blog with this title already exists. Please choose a different title.',
      };
    }

    return {
      success: false,
      error: 'Something went wrong. Please try again.',
    };
  }
}

// Deletes a blog post after verifying authentication and ownership
export async function deleteBlog(
  blogId: string,
): Promise<ActionResponse<{ blogId: string }>> {
  try {
    await connectDb();
    const {
      error: authenticationError,
      isAuthenticated,
      user,
    } = await verifyAuth();

    if (!isAuthenticated) {
      return { success: false, error: authenticationError };
    }

    // Find the blog and check if it exists
    const blog = await Blog.findById(blogId).select('authorId');
    if (!blog) {
      return {
        error: 'Blog not found or has been deleted',
        success: false,
      };
    }

    // Ensure the authenticated user owns the blog
    if (!blog.authorId.equals(user.userId)) {
      return {
        error: 'Unauthorized request',
        success: false,
      };
    }

    // Delete the blog
    await blog.deleteOne();

    return {
      message: 'Blog deleted successfully',
      success: true,
      data: { blogId },
    };
  } catch (error) {
    console.error('Blog deletion failed:', error);
    return {
      success: false,
      error: 'Something went wrong. Please try again.',
    };
  }
}

// Fetches all blogs with searching, filtering and sorting functionality
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
}): Promise<ActionResponse<BlogsResponse>> => {
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

export const getFollowingPosts = async ({
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
}): Promise<ActionResponse<BlogsResponse>> => {
  try {
    await connectDb();

    const { error: authError, isAuthenticated, user } = await verifyAuth();

    if (!isAuthenticated) {
      return {
        success: false,
        error: authError,
      };
    }

    const { userId } = user;

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
      pipeline.push(
        {
          $match: {
            $text: { $search: query },
          },
        },
        {
          $addFields: {
            score: { $meta: 'textScore' },
          },
        },
      );
    }

    pipeline.push(
      {
        $lookup: {
          from: 'follows',
          let: { authorId: '$authorId' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$followerId', new Types.ObjectId(userId)] },
                    { $eq: ['$followingId', '$$authorId'] },
                  ],
                },
              },
            },
          ],
          as: 'followCheck',
        },
      },
      // Only include blogs where the author is followed
      {
        $match: {
          followCheck: { $ne: [] },
        },
      },
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
        $project: {
          _id: 1,
          authorId: { $first: '$authorId' },
          banner: 1,
          blurDataUrl: 1,
          description: 1,
          publishedAt: 1,
          readTime: 1,
          slug: 1,
          title: 1,
          ...(query ? { score: 1 } : {}),
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
