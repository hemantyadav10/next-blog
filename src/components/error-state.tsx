'use client';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { AlertCircleIcon, RotateCcw } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';

interface ErrorStateProps {
  resource: string;
  onReset: () => void;
  error?: Error & { digest?: string };
}

export function ErrorState({ resource, onReset }: ErrorStateProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleRetry = () => {
    startTransition(() => {
      router.refresh();
      onReset();
    });
  };

  return (
    <Alert variant="destructive" className="rounded-2xl">
      <AlertCircleIcon className="h-4 w-4" />
      <AlertTitle>Unable to load {resource}</AlertTitle>
      <AlertDescription className="space-y-3">
        <p>Something went wrong while fetching {resource}.</p>
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
