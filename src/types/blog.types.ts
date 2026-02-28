import { BlogDocument } from '@/models/blogModel';
import { CategoryDocument } from '@/models/categoryModel';
import { TagDocument } from '@/models/tagModel';
import { UserType } from '@/models/userModel';
import { Types } from 'mongoose';
import { PaginatedResponse } from './api.types';

type BlogAuthor = Pick<
  UserType,
  'username' | 'firstName' | 'lastName' | 'profilePicture' | '_id'
>;

type BlogListItem = Pick<
  BlogDocument,
  | '_id'
  | 'banner'
  | 'blurDataUrl'
  | 'description'
  | 'publishedAt'
  | 'readTime'
  | 'slug'
  | 'title'
> & { authorId: BlogAuthor };

type CategoryBlogsResponse = {
  docs: BlogListItem[];
  hasNextPage: boolean;
  nextPage: number | null;
};

type AuthorBlogsResponse = PaginatedResponse<BlogListItem[]>;

type BlogsResponse = PaginatedResponse<BlogListItem[]>;

type PopulatedAuthor = Pick<
  UserType,
  | 'username'
  | 'firstName'
  | 'lastName'
  | 'profilePicture'
  | '_id'
  | 'bio'
  | 'email'
  | 'createdAt'
>;

type PopulatedCategory = Pick<CategoryDocument, 'name' | 'slug' | '_id'>;

type PopulatedTag = Pick<TagDocument, 'name' | 'slug'> & {
  _id: Types.ObjectId;
};

type MyBlogs = Pick<
  BlogDocument,
  | '_id'
  | 'status'
  | 'slug'
  | 'title'
  | 'description'
  | 'createdAt'
  | 'publishedAt'
  | 'isEdited'
  | 'updatedAt'
  | 'editedAt'
>;

type RelatedBlogs = Pick<
  BlogDocument,
  | '_id'
  | 'title'
  | 'description'
  | 'readTime'
  | 'slug'
  | 'publishedAt'
  | 'blurDataUrl'
  | 'banner'
> & { authorId: BlogAuthor };

export type {
  AuthorBlogsResponse,
  BlogAuthor,
  BlogListItem,
  BlogsResponse,
  CategoryBlogsResponse,
  MyBlogs,
  PopulatedAuthor,
  PopulatedCategory,
  PopulatedTag,
  RelatedBlogs,
};
