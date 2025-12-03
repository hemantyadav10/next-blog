import connectDb from '@/lib/connectDb';
import { Blog } from '@/models';
import { CategoryDocument } from '@/models/categoryModel';
import { UserType } from '@/models/userModel';
import { PenIcon } from 'lucide-react';
import { Types } from 'mongoose';
import Link from 'next/link';
import React from 'react';
import BlogCard from './BlogCard';
import { Button } from './ui/button';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from './ui/empty';
import { Separator } from './ui/separator';

type PopulatedAuthor = Pick<
  UserType,
  'username' | 'firstName' | 'lastName' | 'profilePicture'
> & { _id: Types.ObjectId };

type PopulatedCategory = Pick<CategoryDocument, 'name' | 'slug'> & {
  _id: Types.ObjectId;
};

const getRecentBlogs = async () => {
  await connectDb();

  const blogs = await Blog.find({ status: 'published' })
    .populate<{ categoryId: PopulatedCategory }>('categoryId', 'name slug')
    .populate<{
      authorId: PopulatedAuthor;
    }>('authorId', 'username firstName lastName profilePicture')
    .limit(4)
    .sort({ publishedAt: -1 });

  return blogs;
};

async function RecentBlogs() {
  const blogs = await getRecentBlogs();

  if (blogs.length === 0) {
    return (
      <section className="col-span-12 space-y-6 lg:col-span-9">
        <h2 className="text-2xl font-medium">Latest Posts</h2>
        <Empty className="border border-dashed">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <PenIcon />
            </EmptyMedia>
            <EmptyTitle>No Posts Yet</EmptyTitle>
            <EmptyDescription>
              Be the first to share your story! Create a post and start the
              conversation.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button asChild>
              <Link href={'/write'}>Create First Post</Link>
            </Button>
          </EmptyContent>
        </Empty>
      </section>
    );
  }

  return (
    <section className="col-span-12 space-y-6 lg:col-span-9">
      <h2 className="text-2xl font-medium">Latest Posts</h2>
      <div className="space-y-4">
        {blogs.map((blog) => {
          const {
            _id,
            title,
            description,
            readTime,
            authorId,
            slug,
            publishedAt,
            blurDataUrl,
            banner,
          } = blog;
          return (
            <React.Fragment key={_id.toString()}>
              <BlogCard
                title={title}
                description={description}
                readTime={readTime}
                authorName={`${authorId.firstName} ${authorId.lastName}`}
                authorUsername={authorId.username}
                slug={slug}
                publishedAt={publishedAt}
                blurDataUrl={blurDataUrl}
                banner={banner}
                authorProfilePicture={authorId.profilePicture}
              />
              <Separator />
            </React.Fragment>
          );
        })}
      </div>
      <div className="text-center">
        <Button
          variant={'outline'}
          className="w-full max-w-[200px] rounded-full"
          size={'lg'}
          asChild
        >
          <Link href={'/explore'}>View all</Link>
        </Button>
      </div>
    </section>
  );
}

export default RecentBlogs;
