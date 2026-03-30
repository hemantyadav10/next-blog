import { EngagementChart } from './EngagementChart';
import { getBlogLikesChartData } from './charts.data';

async function LikesChart({
  range,
  blogId,
  timezone = 'Asia/Calcutta',
  publishedAt,
}: {
  blogId: string;
  range: string;
  timezone?: string;
  publishedAt: Date;
}) {
  const days = range === '7d' ? 7 : range === 'all' ? 9999 : 30;
  const likesData = await getBlogLikesChartData({
    blogId,
    days,
    timezone,
    publishedAt,
  });

  return (
    <EngagementChart
      title="Likes"
      data={likesData}
      color="var(--color-rose-400)"
    />
  );
}

export default LikesChart;
