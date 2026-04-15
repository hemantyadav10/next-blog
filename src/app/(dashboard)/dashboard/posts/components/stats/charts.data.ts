import connectDb from '@/lib/connectDb';
import { BlogView, Comment, Like } from '@/models';
import { Types } from 'mongoose';

type BlogStatsOptions = {
  blogId: string;
  days: number;
  timezone: string;
  publishedAt: Date;
};

// utility to fill missing dates with 0 values
function fillDates(
  dataMap: Map<string, number>,
  startDate: Date,
  days: number,
  timezone: string,
) {
  const today = new Date(Date.now());
  const actualDays =
    days === 9999
      ? Math.ceil(
          (today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24),
        )
      : days - 1;

  const filled: { date: string; value: number }[] = [];
  for (let i = actualDays; i >= 0; i--) {
    const date = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
    const dateStr = date.toLocaleDateString('en-CA', {
      timeZone: timezone,
    });
    filled.push({ date: dateStr, value: dataMap.get(dateStr) ?? 0 });
  }
  return filled;
}

// normalize to start of day in user's timezone
function getStartDate(publishedAt: Date, days: number, timezone: string): Date {
  if (days === 9999) {
    return new Date(publishedAt.getTime());
  }

  const now = new Date();
  const targetTime = new Date(now.getTime() - (days - 1) * 24 * 60 * 60 * 1000);

  const dateStr = targetTime.toLocaleDateString('en-CA', {
    timeZone: timezone,
  });
  return new Date(dateStr + 'T00:00:00');
}

// fetch views count grouped by date for a blog post in the given time range and timezone
export async function getBlogViewChartData({
  blogId,
  days,
  timezone,
  publishedAt,
}: BlogStatsOptions): Promise<{ date: string; value: number }[]> {
  await connectDb();
  const startDate = getStartDate(publishedAt, days, timezone);

  const result = await BlogView.aggregate([
    {
      $match: {
        blogId: new Types.ObjectId(blogId),
        createdAt: { $gte: startDate },
      },
    },
    {
      $group: {
        _id: {
          $dateToString: { format: '%Y-%m-%d', date: '$createdAt', timezone },
        },
        value: { $sum: 1 },
      },
    },
    {
      $project: { _id: 0, date: '$_id', value: 1 },
    },
  ]);

  // fill missing dates
  const dataMap = new Map(result.map((d) => [d.date, d.value]));

  return fillDates(dataMap, startDate, days, timezone);
}

// fetch likes count grouped by date for a blog post in the given time range and timezone
export async function getBlogLikesChartData({
  blogId,
  days,
  timezone,
  publishedAt,
}: BlogStatsOptions): Promise<{ date: string; value: number }[]> {
  await connectDb();
  const startDate = getStartDate(publishedAt, days, timezone);

  const result = await Like.aggregate([
    {
      $match: {
        blogId: new Types.ObjectId(blogId),
        createdAt: { $gte: startDate },
      },
    },
    {
      $group: {
        _id: {
          $dateToString: { format: '%Y-%m-%d', date: '$createdAt', timezone },
        },
        value: { $sum: 1 },
      },
    },
    {
      $project: { _id: 0, date: '$_id', value: 1 },
    },
  ]);

  // fill missing dates
  const dataMap = new Map(result.map((d) => [d.date, d.value]));

  return fillDates(dataMap, startDate, days, timezone);
}

// fetch comments count grouped by date for a blog post in the given time range and timezone
export async function getBlogCommentsChartData({
  blogId,
  days,
  timezone,
  publishedAt,
}: BlogStatsOptions): Promise<{ date: string; value: number }[]> {
  await connectDb();
  const startDate = getStartDate(publishedAt, days, timezone);

  const result = await Comment.aggregate([
    {
      $match: {
        blogId: new Types.ObjectId(blogId),
        createdAt: { $gte: startDate },
        isDeleted: { $ne: true },
      },
    },
    {
      $group: {
        _id: {
          $dateToString: { format: '%Y-%m-%d', date: '$createdAt', timezone },
        },
        value: { $sum: 1 },
      },
    },
    {
      $project: { _id: 0, date: '$_id', value: 1 },
    },
  ]);

  // fill missing dates
  const dataMap = new Map(result.map((d) => [d.date, d.value]));

  return fillDates(dataMap, startDate, days, timezone);
}
