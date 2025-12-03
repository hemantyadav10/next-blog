import { CategoryDocument } from '@/models/categoryModel';

export interface CategoryListItem {
  _id: string;
  name: string;
  description: string;
  blogsCount: number;
}

export type PopulatedCategory = Pick<CategoryDocument, 'name' | 'slug'> & {
  _id: string;
};
