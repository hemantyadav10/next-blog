import { Card, CardContent } from '@/components/ui/card';
import { ArrowDown, ArrowUp, Eye, Heart, MessageCircle } from 'lucide-react';

type StatsCardsProps = {
  views: number;
  likesCount: number;
  commentsCount: number;
  prevViews: number;
  prevLikes: number;
  prevComments: number;
  range: string;
};

const stats = [
  {
    key: 'views',
    label: 'Total Views',
    icon: Eye,
    color: 'text-violet-400',
    iconBg: 'bg-violet-400/10',
    border: 'border-violet-400/20',
  },
  {
    key: 'likes',
    label: 'Likes',
    icon: Heart,
    color: 'text-rose-400',
    iconBg: 'bg-rose-400/10',
    border: 'border-rose-400/20',
  },
  {
    key: 'comments',
    label: 'Comments',
    icon: MessageCircle,
    color: 'text-emerald-400',
    iconBg: 'bg-emerald-400/10',
    border: 'border-emerald-400/20',
  },
] as const;

export function StatsCards({
  views,
  likesCount,
  commentsCount,
  prevComments,
  prevLikes,
  prevViews,
  range,
}: StatsCardsProps) {
  const values = { views, likes: likesCount, comments: commentsCount };
  const prevValues = {
    views: prevViews,
    likes: prevLikes,
    comments: prevComments,
  };

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
      {stats.map(({ key, label, icon: Icon, color, iconBg, border }) => (
        <Card key={key}>
          <CardContent className="space-y-3">
            <div className="text-muted-foreground flex flex-wrap-reverse items-center justify-between gap-2 text-sm">
              <span className="flex-1">{label}</span>
              <div
                className={`size-8 rounded-full ${iconBg} flex items-center justify-center border ${border}`}
              >
                <Icon className={`size-4 ${color}`} />
              </div>
            </div>
            <p className={`text-4xl font-semibold`}>
              {values[key].toLocaleString()}
            </p>
            {range !== 'all' && (
              <ChangeLabel
                current={values[key]}
                previous={prevValues[key]}
                range={range}
              />
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function getPercentageChange(current: number, previous: number): number | null {
  if (previous === 0) return null;
  return Math.round(((current - previous) / previous) * 100);
}

function ChangeLabel({
  current,
  previous,
  range,
}: {
  current: number;
  previous: number;
  range: string;
}) {
  const change = getPercentageChange(current, previous);

  if (change === null)
    return (
      <p className="text-muted-foreground text-xs">
        No data for previous period
      </p>
    );

  const isUp = change >= 0;
  const label =
    range === '7d'
      ? 'previous 7 days'
      : range === '30d'
        ? 'previous 30 days'
        : '';

  return (
    <p
      className={`flex items-center gap-1 text-xs ${isUp ? 'text-emerald-500' : 'text-destructive'}`}
    >
      {isUp ? (
        <ArrowUp className="size-3 shrink-0" />
      ) : (
        <ArrowDown className="size-3 shrink-0" />
      )}
      {Math.abs(change)}% {isUp ? 'more' : 'less'} than {label}
    </p>
  );
}
