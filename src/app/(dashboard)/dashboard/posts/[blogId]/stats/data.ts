import connectDb from '@/lib/connectDb';
import { Blog, BlogView, Comment, Like } from '@/models';
import { BlogDocument } from '@/models/blogModel';
import { UserType } from '@/models/userModel';

type BlogForStats = Pick<
  BlogDocument,
  | '_id'
  | 'title'
  | 'views'
  | 'commentsCount'
  | 'likesCount'
  | 'status'
  | 'publishedAt'
  | 'editedAt'
  | 'isEdited'
  | 'readTime'
  | 'slug'
> & { authorId: Pick<UserType, 'username'> };

export async function getBlogStatsTotals({
  blogId,
  days,
  userId,
}: {
  blogId: string;
  days: number;
  userId: string;
}) {
  await connectDb();

  const blog = await Blog.findOne({ _id: blogId, authorId: userId })
    .populate<{ authorId: { username: string } }>('authorId', 'username')
    .select(
      '_id title authorId views commentsCount likesCount status publishedAt editedAt isEdited readTime slug',
    )
    .lean<BlogForStats>();

  if (!blog) return { blog: null, stats: null };

  const startDate = new Date();
  if (days === 9999) {
    startDate.setTime(blog.publishedAt?.getTime() || 0);
  } else {
    startDate.setDate(startDate.getDate() - days);
  }

  const prevStartDate = new Date(startDate);
  prevStartDate.setDate(prevStartDate.getDate() - days);

  const blogObjectId = blog._id;

  const [viewsStats, likesStats, commentsStats] = await Promise.all([
    BlogView.aggregate([
      { $match: { blogId: blogObjectId, createdAt: { $gte: prevStartDate } } },
      {
        $facet: {
          current: [
            { $match: { createdAt: { $gte: startDate } } },
            { $count: 'count' },
          ],
          previous: [
            { $match: { createdAt: { $gte: prevStartDate, $lt: startDate } } },
            { $count: 'count' },
          ],
        },
      },
    ]),
    Like.aggregate([
      { $match: { blogId: blogObjectId, createdAt: { $gte: prevStartDate } } },
      {
        $facet: {
          current: [
            { $match: { createdAt: { $gte: startDate } } },
            { $count: 'count' },
          ],
          previous: [
            { $match: { createdAt: { $gte: prevStartDate, $lt: startDate } } },
            { $count: 'count' },
          ],
        },
      },
    ]),
    Comment.aggregate([
      {
        $match: {
          blogId: blogObjectId,
          createdAt: { $gte: prevStartDate },
          isDeleted: { $ne: true },
        },
      },
      {
        $facet: {
          current: [
            { $match: { createdAt: { $gte: startDate } } },
            { $count: 'count' },
          ],
          previous: [
            { $match: { createdAt: { $gte: prevStartDate, $lt: startDate } } },
            { $count: 'count' },
          ],
        },
      },
    ]),
  ]);

  const views = viewsStats[0]?.current[0]?.count ?? 0;
  const prevViews = viewsStats[0]?.previous[0]?.count ?? 0;
  const likes = likesStats[0]?.current[0]?.count ?? 0;
  const prevLikes = likesStats[0]?.previous[0]?.count ?? 0;
  const comments = commentsStats[0]?.current[0]?.count ?? 0;
  const prevComments = commentsStats[0]?.previous[0]?.count ?? 0;

  return {
    blog,
    stats: {
      views,
      likes,
      comments,
      prevViews,
      prevLikes,
      prevComments,
    },
  };
}
