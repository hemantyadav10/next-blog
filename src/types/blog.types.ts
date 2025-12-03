import { BlogDocument } from '@/models/blogModel';
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

export type { BlogAuthor, BlogListItem };
