'use client';

import { ErrorState } from '@/components/error-state';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  console.error(error);
  return <ErrorState resource="posts" onReset={reset} />;
}
