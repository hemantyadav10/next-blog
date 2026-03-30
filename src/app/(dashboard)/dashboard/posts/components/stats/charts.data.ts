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
  // calculate actual number of days to fill
  const today = new Date();
  const actualDays =
    days === 9999
      ? Math.ceil(
          (today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24),
        )
      : days - 1;

  const filled: { date: string; value: number }[] = [];
  for (let i = actualDays; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toLocaleDateString('en-CA', { timeZone: timezone });
    filled.push({ date: dateStr, value: dataMap.get(dateStr) ?? 0 });
  }
  return filled;
}

// -- calculate start date based on range
function getStartDate(publishedAt: Date, days: number): Date {
  const startDate = new Date();
  if (days === 9999) {
    startDate.setTime(publishedAt.getTime());
  } else {
    startDate.setDate(startDate.getDate() - days);
  }
  return startDate;
}

// fetch likes count grouped by date for a blog post in the given time range and timezone
export async function getBlogLikesChartData({
  blogId,
  days,
  timezone,
  publishedAt,
}: BlogStatsOptions): Promise<{ date: string; value: number }[]> {
  await connectDb();
  const startDate = getStartDate(publishedAt, days);

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

// fetch views count grouped by date for a blog post in the given time range and timezone
export async function getBlogViewChartData({
  blogId,
  days,
  timezone,
  publishedAt,
}: BlogStatsOptions): Promise<{ date: string; value: number }[]> {
  await connectDb();
  const startDate = getStartDate(publishedAt, days);

  // aggregate views grouped by date in the author's timezone
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

// fetch comments count grouped by date for a blog post in the given time range and timezone
export async function getBlogCommentsChartData({
  blogId,
  days,
  timezone,
  publishedAt,
}: BlogStatsOptions): Promise<{ date: string; value: number }[]> {
  await connectDb();
  const startDate = getStartDate(publishedAt, days);

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
