'use client';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { AlertCircleIcon, RotateCcw } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';

interface ErrorStateProps {
  resource: string;
  onReset?: () => void;
  error?: Error & { digest?: string };
}

export function ErrorState({ resource, onReset, error }: ErrorStateProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleRetry = () => {
    startTransition(() => {
      if (onReset) {
        onReset();
      }
      router.refresh();
    });
  };

  if (error) {
    console.error(`Error loading ${resource}:`, error);
  }

  return (
    <Alert variant="destructive" className="rounded-2xl">
      <AlertCircleIcon className="h-4 w-4" />
      <AlertTitle>Unable to load {resource}</AlertTitle>
      <AlertDescription className="space-y-3">
        <p>Something went wrong while loading the {resource}.</p>
        <Button
          onClick={handleRetry}
          size="sm"
          disabled={isPending}
          variant="outline"
          className="text-foreground rounded-full"
        >
          {isPending ? <Spinner /> : <RotateCcw />}{' '}
          {isPending ? 'Retrying...' : 'Retry'}
        </Button>
      </AlertDescription>
    </Alert>
  );
}
