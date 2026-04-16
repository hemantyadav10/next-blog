'use client';

import { Alert, AlertTitle, alertVariants } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { VariantProps } from 'class-variance-authority';
import { RotateCcw } from 'lucide-react';

interface ErrorStateProps {
  errorMessage: string;
  onRetry: () => void;
  variant?: VariantProps<typeof alertVariants>['variant'];
}

export function ClientErrorState({
  errorMessage,
  onRetry,
  variant = 'destructive',
}: ErrorStateProps) {
  return (
    <Alert variant={variant} className={cn('rounded-2xl')}>
      <AlertTitle className="flex items-center justify-between">
        {errorMessage}{' '}
        <Button
          onClick={onRetry}
          size="sm"
          variant="outline"
          className="text-foreground rounded-full"
        >
          <RotateCcw /> Retry
        </Button>
      </AlertTitle>
    </Alert>
  );
}
