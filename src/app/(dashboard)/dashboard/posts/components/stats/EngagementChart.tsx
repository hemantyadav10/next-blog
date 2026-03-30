'use client';

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import { formatDate } from 'date-fns';

type DataPoint = {
  date: string;
  value: number;
};

type EngagementChartProps = {
  title: string;
  data: DataPoint[];
  color: string;
};

export function EngagementChart({ title, data, color }: EngagementChartProps) {
  const dataKey = title.toLowerCase();

  const chartConfig = {
    [dataKey]: {
      label: title,
      color,
    },
  } satisfies ChartConfig;

  const filteredData = data.map((item) => ({
    date: item.date,
    [dataKey]: item.value,
  }));

  return (
    <Card className="pt-0">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle>{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData} margin={{ left: 0, right: 12 }}>
            <defs>
              <linearGradient
                id={`fill-${dataKey}`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor={`var(--color-${dataKey})`}
                  stopOpacity={0.5}
                />
                <stop
                  offset="95%"
                  stopColor={`var(--color-${dataKey})`}
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => formatDate(new Date(value), 'MMM d')}
            />
            <YAxis
              type="number"
              tickMargin={8}
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
              tickCount={4}
              // domain={[0, 'dataMax']}
            />

            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey={dataKey}
                  labelFormatter={(value) =>
                    new Date(value).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })
                  }
                />
              }
            />
            <Area
              dataKey={dataKey}
              type="linear"
              stroke={`var(--color-${dataKey})`}
              fill={`url(#fill-${dataKey})`}
              strokeWidth={2}
              dot={false}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
