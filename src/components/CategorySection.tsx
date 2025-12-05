import connectDb from '@/lib/connectDb';
import { Category } from '@/models';
import { PopulatedCategory } from '@/types/category.types';
import Categories from './Categories';

async function getCategories(): Promise<PopulatedCategory[]> {
  await connectDb();

  const categories = await Category.find()
    .sort({ name: 1 })
    .select('name slug _id')
    .lean();
  return categories.map((category) => ({
    ...category,
    _id: category._id.toString(),
  }));
}

// TODO: complete error handling for categories
async function CategorySection() {
  const categories = await getCategories();
  return <Categories categories={categories} />;
}

export default CategorySection;
