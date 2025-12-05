import { BlogDocument } from '@/models/blogModel';
import { CategoryDocument } from '@/models/categoryModel';
import { UserType } from '@/models/userModel';

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

type PopulatedAuthor = Pick<
  UserType,
  'username' | 'firstName' | 'lastName' | 'profilePicture' | '_id'
>;

type PopulatedCategory = Pick<CategoryDocument, 'name' | 'slug' | '_id'>;

export type {
  BlogAuthor,
  BlogListItem,
  CategoryBlogsResponse,
  PopulatedAuthor,
  PopulatedCategory,
};
