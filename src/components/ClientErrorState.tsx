'use client';

import { Alert, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';

interface ErrorStateProps {
  errorMessage: string;
  onRetry: () => void;
}

export function ClientErrorState({ errorMessage, onRetry }: ErrorStateProps) {
  return (
    <Alert variant="destructive" className="rounded-2xl">
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
