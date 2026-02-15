import CommentSectionSkeleton from '@/components/skeletons/CommentSectionSkeleton';
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
import { verifyAuth } from '@/lib/auth';
import { getBlogPost } from '@/lib/blog';
import { APP_NAME } from '@/lib/constants';
import { getMyHtml } from '@/lib/generate-html';
import { formatDate } from 'date-fns';
import {
  Calendar,
  Clock,
  Edit3Icon,
  Folder,
  TagIcon,
  UserPlus,
} from 'lucide-react';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import {
  BlogActionsDesktop,
  BlogActionsMobile,
} from './components/blog-actions-nav';
import BlogCard from './components/BlogCard';
import CommentSection from './components/comments/CommentSection';
import PostActions from './components/PostActions';

type Props = {
  params: Promise<{ slug: string; username: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, username } = await params;
  const blog = await getBlogPost(slug);
  if (!blog || blog.authorId.username !== username) {
    notFound();
  }
  const url = `${process.env.NEXT_PUBLIC_BASE_URL}/${username}/${slug}`;
  const ogImage =
    blog.banner || `${process.env.NEXT_PUBLIC_BASE_URL}/default-og.jpg`;

  return {
    title: blog.title,
    description: blog.metaDescription || blog.description,
    authors: [{ name: blog.authorId.username }],

    openGraph: {
      title: blog.title,
      description: blog.metaDescription || blog.description,
      url: url,
      siteName: APP_NAME,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: blog.title,
        },
      ],
      locale: 'en_US',
      type: 'article',
      publishedTime: (blog.publishedAt || blog.createdAt).toISOString(),
      modifiedTime: blog.updatedAt.toISOString(),
      authors: [blog.authorId.username],
    },

    twitter: {
      card: 'summary_large_image',
      title: blog.title,
      description: blog.metaDescription || blog.description,
      images: [ogImage],
      creator: `@${blog.authorId.username}`,
    },
  };
}

async function page({ params }: Props) {
  const { slug, username } = await params;
  const [blog, { isAuthenticated, user }] = await Promise.all([
    getBlogPost(slug),
    verifyAuth(),
  ]);

  if (!blog || blog.authorId.username !== username) return notFound();

  const html = await getMyHtml({ value: blog.content });

  const isOwner =
    isAuthenticated && user.userId === blog.authorId._id.toString();

  return (
    <div className="mx-auto flex w-full max-w-7xl justify-center gap-8 px-4 py-8 pb-22 md:px-8 md:py-12">
      {/* Blog Actions */}
      <BlogActionsMobile
        title={blog.title}
        text={blog.metaDescription || blog.description}
        commentsCount={blog.commentsCount}
      />
      <div className="sticky top-28 hidden w-16 shrink-0 flex-col items-center space-y-6 self-start md:flex">
        <BlogActionsDesktop
          title={blog.title}
          text={blog.metaDescription || blog.description}
          commentsCount={blog.commentsCount}
        />
      </div>

      <div className="flex w-full max-w-3xl flex-col gap-8 xl:max-w-full xl:flex-row">
        {/* Blog Content */}
        <div className="flex w-full max-w-3xl flex-col gap-8">
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

            <div className="flex items-start justify-between gap-4">
              <div className="text-muted-foreground flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
                {/* author */}
                <Link
                  href={`/author/${blog.authorId.username}`}
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

                {/* meta data */}

                {/* Published date */}
                {blog.publishedAt && (
                  <span className="flex items-center gap-1">
                    <Calendar className="size-3.5" />
                    {formatDate(new Date(blog.publishedAt), 'MMM d, yyyy')}
                  </span>
                )}

                {/* Edited date (only if edited) */}
                {blog.isEdited && blog.editedAt && (
                  <span className="flex items-center gap-1 italic">
                    <Edit3Icon className="size-3.5" />
                    Edited {formatDate(new Date(blog.editedAt), 'MMM d, yyyy')}
                  </span>
                )}

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

              {/* Post Actions */}
              {isOwner && (
                <PostActions
                  title={blog.title}
                  authorUsername={blog.authorId.username}
                  slug={blog.slug}
                />
              )}
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
            <div className="flex flex-wrap items-center gap-2">
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

          {/* Comment Section */}
          <Suspense fallback={<CommentSectionSkeleton />}>
            <CommentSection
              isCommentsEnabled={blog.isCommentsEnabled}
              blogId={blog._id.toString()}
              slug={blog.slug}
              authorUsername={blog.authorId.username}
            />
          </Suspense>
        </div>

        <Separator className="block xl:hidden" />

        {/* Author Sidebar */}
        <div className="flex-1 space-y-8">
          {/* Author Info */}
          <div className="space-y-4 sm:flex xl:flex-col">
            <div className="flex items-start gap-4 sm:flex-1">
              <Link
                href={`/author/${blog.authorId.username}`}
                className="rounded-full"
              >
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
              </Link>
              <div className="space-y-2 text-sm">
                <Link
                  href={`/author/${blog.authorId.username}`}
                  className="hover:underline"
                >
                  <p className="text-lg font-medium">
                    {blog.authorId.firstName} {blog.authorId.lastName}
                  </p>
                </Link>
                <p className="text-muted-foreground">
                  3.4K followers and 2.1K following
                </p>
                {blog.authorId.bio && (
                  <p className="line-clamp-3">{blog.authorId.bio}</p>
                )}
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
