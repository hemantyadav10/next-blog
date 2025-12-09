import { Alert, AlertTitle } from '@/components/ui/alert';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
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
  Calendar,
  Clock,
  Ellipsis,
  Folder,
  Heart,
  MessageCircleIcon,
  Share2,
  TagIcon,
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
    <div className="mx-auto flex w-full max-w-6xl justify-center gap-8 px-4 py-8 md:px-8 md:py-12">
      {/* Blog Actions */}
      <div className="sticky top-28 hidden w-16 flex-col items-center space-y-6 self-start md:flex">
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

        <Tooltip>
          <TooltipTrigger asChild>
            <Button aria-label="Share" variant={'ghost'} size={'icon'}>
              <Ellipsis />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">More</TooltipContent>
        </Tooltip>
      </div>

      <div className="flex flex-col gap-8 xl:flex-row">
        {/* Blog Content */}
        <div className="flex w-full max-w-2xl flex-col gap-8">
          <div className="space-y-6">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href="/">Home</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href="/explore">Explore</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href={`/category/${blog.categoryId.slug}`}>
                      {blog.categoryId.name}
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage className="line-clamp-1 max-w-40">
                    {blog.title}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            {/* title */}
            <h1 className="text-3xl leading-tight font-semibold md:text-5xl">
              {blog.title}
            </h1>
            {/* description */}
            <div className="text-lg">
              <p>{blog.description}</p>
            </div>
            <div className="text-muted-foreground flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
              {/* author */}
              <Link
                href={`/${blog.authorId.username}`}
                className="group text-foreground flex w-fit items-center gap-2 text-sm"
              >
                <Avatar className="text-foreground size-8">
                  <AvatarImage
                    src={blog.authorId.profilePicture ?? ''}
                    alt={blog.authorId.firstName}
                  />
                  <AvatarFallback className="uppercase">
                    {blog.authorId.firstName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <span className="group-hover:underline">
                  {blog.authorId.firstName} {blog.authorId.lastName}
                </span>
              </Link>

              {/* mete data */}

              {/* Publishing date */}
              {blog?.publishedAt ? (
                <span className="flex items-center gap-1">
                  <Calendar className="size-3.5" />{' '}
                  {formatDate(new Date(blog.publishedAt), 'MMM d, yyyy')}{' '}
                </span>
              ) : null}
              {/* read time */}
              <span className="flex items-center gap-1">
                <Clock className="size-3.5" />
                {blog.readTime} min read
              </span>
              {/* category */}
              <Link
                href={`/category/${blog.categoryId.slug}`}
                className="hover:text-foreground flex items-center gap-1 underline-offset-2 hover:underline"
              >
                <Folder className="size-3.5" />
                {blog.categoryId.name}
              </Link>
            </div>

            {/* banner */}
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

            {/* main content */}
            <div dangerouslySetInnerHTML={{ __html: html }} />

            {/* tags */}
            <div className="flex items-center gap-2">
              <TagIcon className="size-4" />
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
          <section className="space-y-8">
            <p className="text-xl font-medium">Comments (12)</p>

            {blog.isCommentsEnabled ? (
              // Show comment form
              <>
                <div className="space-y-4">
                  <div className="flex items-start gap-2">
                    <Avatar className="size-10">
                      <AvatarImage src={blog.authorId.profilePicture ?? ''} />
                      <AvatarFallback className="uppercase">
                        {blog.authorId.firstName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <Textarea
                      placeholder="Leave a comment..."
                      className="flex-1"
                    />
                  </div>
                  <div className="flex justify-end">
                    <Button>Add Comment</Button>
                  </div>
                </div>

                {/* Display existing comments */}
              </>
            ) : (
              // Show disabled state with explanation
              <Alert>
                <AlertTitle className="text-center">
                  Comments are disabled for this post.
                </AlertTitle>
              </Alert>
            )}
          </section>
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
            <Button className="w-full sm:w-auto" variant={'raised'}>
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
