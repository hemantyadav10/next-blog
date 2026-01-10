import { CategoryDocument } from '@/models/categoryModel';

export interface CategoryListItem {
  _id: string;
  name: string;
  description: string;
  blogsCount: number;
  slug: string;
}

export type PopulatedCategory = Pick<CategoryDocument, 'name' | 'slug'> & {
  _id: string;
};
