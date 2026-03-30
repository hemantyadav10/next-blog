import { getBlogViewChartData } from './charts.data';
import { EngagementChart } from './EngagementChart';

async function ViewsChart({
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
  const viewsData = await getBlogViewChartData({
    blogId,
    days,
    timezone,
    publishedAt,
  });

  return (
    <EngagementChart
      title="Views"
      data={viewsData}
      color="var(--color-violet-400)"
    />
  );
}

export default ViewsChart;
