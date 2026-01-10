import BlogEditor from '@/app/(editor)/components/BlogEditor';
import { verifyAuth } from '@/lib/auth';
import { getBlogPostForEdit } from '@/lib/blog';
import { notFound } from 'next/navigation';

type EditPostProps = {
  params: Promise<{ slug: string; username: string }>;
};

async function EditPost({ params }: EditPostProps) {
  const { username, slug } = await params;
  const { isAuthenticated, user } = await verifyAuth();

  if (!isAuthenticated) return notFound();

  const blog = await getBlogPostForEdit(slug, user.userId);

  if (!blog || blog.authorId.username !== username) return notFound();

  const blogData = {
    _id: blog._id.toString(),
    banner: blog.banner,
    status: blog.status,
    title: blog.title,
    description: blog.description,
    content: blog.content,
    tags: blog.tags.map((tag) => tag.name),
    categoryId: blog.categoryId._id.toString(),
    metaDescription: blog.metaDescription ?? undefined,
    isCommentsEnabled: blog.isCommentsEnabled,
  };

  return <BlogEditor blogData={blogData} slug={slug} />;
}

export default EditPost;
