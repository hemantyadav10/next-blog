import { EngagementChart } from './EngagementChart';
import { getBlogCommentsChartData } from './charts.data';

async function CommentsChart({
  range,
  blogId,
  publishedAt,
  timezone = 'Asia/Calcutta',
}: {
  blogId: string;
  range: string;
  publishedAt: Date;
  timezone?: string;
}) {
  const days = range === '7d' ? 7 : range === 'all' ? 9999 : 30;
  const commentsData = await getBlogCommentsChartData({
    blogId,
    days,
    timezone,
    publishedAt,
  });
  return (
    <EngagementChart
      title="Comments"
      data={commentsData}
      color="var(--color-emerald-400)"
    />
  );
}

export default CommentsChart;
