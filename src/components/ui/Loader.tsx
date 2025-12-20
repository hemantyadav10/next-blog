import { cn } from '@/lib/utils';
import React from 'react';

type LoaderSize = 'sm' | 'md' | 'lg' | 'xl';
interface LoaderProps {
  size?: LoaderSize;
  color?: string;
  duration?: number;
  easing?: string;
  className?: string;
  center?: boolean;
}

const sizeMap = {
  sm: 16,
  md: 24,
  lg: 36,
  xl: 48,
} as const;

const Loader: React.FC<LoaderProps> = ({
  size = 'lg',
  color = 'var(--primary)',
  className = '',
  center = false,
}) => {
  const loaderElement = (
    <div
      className={cn(`animate-rotate inline-block`, className)}
      style={{ width: sizeMap[size], height: sizeMap[size] }}
    >
      <svg viewBox="0 0 50 50" className="h-full w-full">
        <circle
          cx="25"
          cy="25"
          r="20"
          fill="none"
          stroke={color}
          strokeWidth="4"
          style={{
            strokeDasharray: '80px, 200px',
            strokeDashoffset: '0px',
          }}
          className="animate-dash"
        />
      </svg>
    </div>
  );

  return center ? (
    <div className="flex justify-center">{loaderElement}</div>
  ) : (
    loaderElement
  );
};

export default Loader;
