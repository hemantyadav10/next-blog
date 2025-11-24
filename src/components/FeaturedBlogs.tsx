import connectDb from '@/lib/connectDb';
import { Blog } from '@/models';
import { CategoryDocument } from '@/models/categoryModel';
import { UserType } from '@/models/userModel';
import { Types } from 'mongoose';
import { FeaturedBlogCard } from './FeaturedBlogCard';

type PopulatedAuthor = Pick<
  UserType,
  'username' | 'firstName' | 'lastName' | 'profilePicture'
> & { _id: Types.ObjectId };

type PopulatedCategory = Pick<CategoryDocument, 'name' | 'slug'> & {
  _id: Types.ObjectId;
};

const fetchFeaturedBlogs = async () => {
  await connectDb();

  const blogs = await Blog.find({ isFeatured: true })
    .populate<{
      authorId: PopulatedAuthor;
    }>('authorId', 'username firstName lastName profilePicture')
    .populate<{ categoryId: PopulatedCategory }>('categoryId', 'name slug')
    .limit(3);

  return blogs;
};

async function FeaturedBlogs() {
  const featuredBlogs = await fetchFeaturedBlogs();
  const [secondBlog, firstBlog, thirdBlog] = featuredBlogs;

  return (
    <section className="mx-auto max-w-7xl space-y-6">
      <h2 className="text-2xl font-medium">Featured Posts</h2>
      <div className="grid grid-cols-12 flex-wrap gap-4">
        {firstBlog && (
          <FeaturedBlogCard
            href={`/${firstBlog.authorId.username}/${firstBlog.slug}`}
            banner={firstBlog.banner || ''}
            blurDataUrl={firstBlog.blurDataUrl || ''}
            title={firstBlog.title}
            description={firstBlog.description}
            className="col-span-12 aspect-[3/2] md:col-span-6"
            descriptionClassName="hidden sm:block"
          />
        )}
        {secondBlog && (
          <FeaturedBlogCard
            href={`/${secondBlog.authorId.username}/${secondBlog.slug}`}
            banner={secondBlog.banner || ''}
            blurDataUrl={secondBlog.blurDataUrl || ''}
            title={secondBlog.title}
            className="col-span-12 aspect-3/2 sm:col-span-6 sm:aspect-[2/3] md:col-span-3 md:aspect-auto"
          />
        )}
        {thirdBlog && (
          <FeaturedBlogCard
            href={`/${thirdBlog.authorId.username}/${thirdBlog.slug}`}
            banner={thirdBlog.banner || ''}
            blurDataUrl={thirdBlog.blurDataUrl || ''}
            title={thirdBlog.title}
            className="col-span-12 aspect-3/2 sm:col-span-6 sm:aspect-[2/3] md:col-span-3 md:aspect-auto"
          />
        )}{' '}
      </div>
    </section>
  );
}

export default FeaturedBlogs;
