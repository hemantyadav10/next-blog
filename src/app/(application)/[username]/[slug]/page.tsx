import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Tooltip, TooltipContent } from '@/components/ui/tooltip';
import connectDb from '@/lib/connectDb';
import { getMyHtml } from '@/lib/generate-html';
import { Blog } from '@/models';
import { CategoryDocument } from '@/models/categoryModel';
import { TagDocument } from '@/models/tagModel';
import { UserType } from '@/models/userModel';
import { TooltipTrigger } from '@radix-ui/react-tooltip';
import { formatDate } from 'date-fns';
import {
  Bookmark,
  Heart,
  MessageCircleIcon,
  Share2,
  UserPlus,
} from 'lucide-react';
import { Types } from 'mongoose';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import BlogCard from './components/BlogCard';

type PopulatedAuthor = Pick<
  UserType,
  'username' | 'firstName' | 'lastName' | 'profilePicture'
> & { _id: Types.ObjectId };

type PopulatedTag = Pick<TagDocument, 'name' | 'slug'> & {
  _id: Types.ObjectId;
};

type PopulatedCategory = Pick<CategoryDocument, 'name' | 'slug'> & {
  _id: Types.ObjectId;
};

async function page({
  params,
}: {
  params: Promise<{ slug: string; username: string }>;
}) {
  const { slug, username } = await params;
  await connectDb();

  const blog = await Blog.findOne({ slug, status: 'published' })
    .populate<{
      authorId: PopulatedAuthor;
    }>('authorId', 'username firstName lastName profilePicture')
    .populate<{ tags: PopulatedTag[] }>('tags', 'name slug')
    .populate<{ categoryId: PopulatedCategory }>('categoryId', 'name slug');

  if (!blog || blog.authorId.username !== username) {
    notFound();
  }

  const html = await getMyHtml({ value: blog.content });

  return (
    <div className="mx-auto flex w-full max-w-6xl justify-center gap-8 px-4 py-8">
      {/* Blog Actions */}
      <div className="sticky top-24 hidden w-16 flex-col items-center space-y-6 self-start md:flex">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              aria-label="Like"
              variant={'ghost'}
              className="flex h-auto flex-col font-normal"
            >
              <Heart /> 32
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">Like</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              aria-label="Comment"
              variant={'ghost'}
              className="flex h-auto flex-col font-normal"
            >
              <MessageCircleIcon /> 32
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">Comment</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button aria-label="Save" variant={'ghost'} size={'icon'}>
              <Bookmark />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">Save</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button aria-label="Share" variant={'ghost'} size={'icon'}>
              <Share2 />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">Share</TooltipContent>
        </Tooltip>
      </div>

      <div className="flex flex-col gap-8 xl:flex-row">
        {/* Blog Content */}
        <div className="flex w-full max-w-2xl flex-col gap-8">
          <div className="space-y-6">
            <h1 className="text-4xl leading-tight font-semibold md:text-5xl">
              {blog.title}
            </h1>
            <p className="text-muted-foreground text-sm">
              {blog?.publishedAt ? (
                <>
                  Published on{' '}
                  {formatDate(new Date(blog.publishedAt), 'MMM d, yyyy')}{' '}
                  &middot;{' '}
                </>
              ) : null}
              {blog.readTime} min read &middot;{' '}
              <Link
                href={`/category/${blog.categoryId.slug}`}
                className="text-link underline-offset-2 hover:underline"
              >
                {blog.categoryId.name}
              </Link>
            </p>
            {blog.banner && (
              <Image
                src={blog.banner}
                alt={blog.title}
                width={672}
                height={448}
                style={{ width: '100%', height: 'auto' }}
                placeholder="blur"
                blurDataURL={blog.blurDataUrl || ''}
                priority
              />
            )}
            <p className="text-muted-foreground text-lg">{blog.description}</p>

            <Separator />

            <div dangerouslySetInnerHTML={{ __html: html }} />

            <div className="flex items-center gap-2">
              {blog.tags.map((tag) => (
                <Badge
                  className="px-4 py-2"
                  asChild
                  variant={'secondary'}
                  key={tag._id.toString()}
                >
                  <Link href={`/tags/${tag.slug}`}>{tag.name}</Link>
                </Badge>
              ))}
            </div>
          </div>
          <Separator />
          <p className="text-xl font-medium">Comments (12)</p>
          <div className="space-y-4">
            <div className="flex items-start gap-2">
              <Avatar className="size-10">
                <AvatarImage src={blog.authorId.profilePicture ?? ''} />
                <AvatarFallback className="uppercase">
                  {blog.authorId.firstName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <Textarea placeholder="Leave a comment..." />
            </div>
            <div className="flex justify-end">
              <Button>Add Comment</Button>
            </div>
          </div>
        </div>

        <Separator className="block xl:hidden" />

        {/* Author Sidebar */}
        <div className="flex-1 space-y-8">
          {/* Author Info */}
          <div className="space-y-4 sm:flex xl:flex-col">
            <div className="flex items-start gap-4 sm:flex-1">
              <Avatar className="size-14">
                <AvatarImage
                  src={blog.authorId.profilePicture ?? ''}
                  alt={blog.authorId.firstName}
                />
                <AvatarFallback className="uppercase">
                  {blog.authorId.firstName.charAt(0)}{' '}
                  {blog.authorId.lastName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-2 text-sm">
                <p className="text-lg font-medium">
                  Written by {blog.authorId.firstName} {blog.authorId.lastName}
                </p>
                <p className="text-muted-foreground">
                  3.4K followers and 2.1K following
                </p>
                <p>Freelancer IT specialist web developer</p>
              </div>
            </div>
            <Button className="w-full sm:w-auto">
              <UserPlus /> Follow
            </Button>
          </div>

          <Separator />

          {/* More from this author */}
          <div className="space-y-6">
            <h2 className="text-lg font-medium">
              More from {blog.authorId.firstName} {blog.authorId.lastName}
            </h2>
            <div className="space-y-4">
              <BlogCard />
              <BlogCard />
              <BlogCard />
            </div>
            <Button className="w-full sm:w-auto xl:w-full" variant="outline">
              View All
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default page;
