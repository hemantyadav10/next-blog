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
  timezone = 'Asia/Kolkata',
}: {
  blogId: string;
  days: number;
  userId: string;
  timezone?: string;
}) {
  await connectDb();

  const blog = await Blog.findOne({ _id: blogId, authorId: userId })
    .populate<{ authorId: { username: string } }>('authorId', 'username')
    .select(
      '_id title authorId views commentsCount likesCount status publishedAt editedAt isEdited readTime slug',
    )
    .lean<BlogForStats>();

  if (!blog) return { blog: null, stats: null };

  const blogObjectId = blog._id;

  // no previous period
  if (days === 9999) {
    const startDate = new Date(blog.publishedAt || 0);
    const [views, likes, comments] = await Promise.all([
      BlogView.countDocuments({
        blogId: blogObjectId,
        createdAt: { $gte: startDate },
      }),
      Like.countDocuments({
        blogId: blogObjectId,
        createdAt: { $gte: startDate },
      }),
      Comment.countDocuments({
        blogId: blogObjectId,
        createdAt: { $gte: startDate },
        isDeleted: { $ne: true },
      }),
    ]);
    return {
      blog,
      stats: {
        views,
        likes,
        comments,
        prevViews: 0,
        prevLikes: 0,
        prevComments: 0,
      },
    };
  }

  // "start of today" in user's timezone
  const startOfToday = {
    $dateTrunc: { date: '$$NOW', unit: 'day', timezone },
  };

  // current period start
  const currentStart = {
    $dateSubtract: {
      startDate: startOfToday,
      unit: 'day',
      amount: days - 1,
      timezone,
    },
  };

  // previous period start
  const prevStart = {
    $dateSubtract: {
      startDate: startOfToday,
      unit: 'day',
      amount: days * 2 - 1,
      timezone,
    },
  };

  const earlyFilter = new Date();
  earlyFilter.setDate(earlyFilter.getDate() - days * 2);

  const buildPipeline = (extraMatch: Record<string, unknown> = {}) => [
    {
      $match: {
        blogId: blogObjectId,
        createdAt: { $gte: earlyFilter },
        ...extraMatch,
      },
    },
    {
      $facet: {
        current: [
          { $match: { $expr: { $gte: ['$createdAt', currentStart] } } },
          { $count: 'count' },
        ],
        previous: [
          {
            $match: {
              $expr: {
                $and: [
                  { $gte: ['$createdAt', prevStart] },
                  { $lt: ['$createdAt', currentStart] },
                ],
              },
            },
          },
          { $count: 'count' },
        ],
      },
    },
  ];

  const [viewsStats, likesStats, commentsStats] = await Promise.all([
    BlogView.aggregate(buildPipeline()),
    Like.aggregate(buildPipeline()),
    Comment.aggregate(buildPipeline({ isDeleted: { $ne: true } })),
  ]);

  return {
    blog,
    stats: {
      views: viewsStats[0]?.current[0]?.count ?? 0,
      prevViews: viewsStats[0]?.previous[0]?.count ?? 0,
      likes: likesStats[0]?.current[0]?.count ?? 0,
      prevLikes: likesStats[0]?.previous[0]?.count ?? 0,
      comments: commentsStats[0]?.current[0]?.count ?? 0,
      prevComments: commentsStats[0]?.previous[0]?.count ?? 0,
    },
  };
}
