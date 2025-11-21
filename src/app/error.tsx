'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { AlertCircle, RefreshCcw } from 'lucide-react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  console.error(error);

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-8">
      <Card className="w-full max-w-lg shadow-lg">
        <CardHeader className="text-center">
          <div className="bg-destructive/10 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
            <AlertCircle className="text-destructive h-8 w-8" />
          </div>
          <CardTitle className="text-2xl font-bold">
            Oops! Something went wrong
          </CardTitle>
          <CardDescription className="text-base">
            We encountered an unexpected error. Don&apos;t worry, it&apos;s not
            your fault.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {process.env.NODE_ENV === 'development' && (
            <div className="border-destructive/20 bg-destructive/5 rounded-lg border p-4">
              <p className="text-destructive mb-2 text-sm font-medium">
                Error Details (Development Only):
              </p>
              <p className="text-muted-foreground font-mono text-xs break-all">
                {error.message}
              </p>
              {error.digest && (
                <p className="text-muted-foreground mt-2 text-xs">
                  Error ID: {error.digest}
                </p>
              )}
            </div>
          )}

          <div className="text-muted-foreground space-y-2 text-sm">
            <p>Here are a few things you can try:</p>
            <ul className="ml-2 list-inside list-disc space-y-1">
              <li>Refresh the page</li>
              <li>Check your internet connection</li>
              <li>Try again in a few moments</li>
            </ul>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-2 sm:flex-row">
          <Button
            onClick={reset}
            className="w-full sm:w-auto"
            variant="default"
          >
            <RefreshCcw /> Try Again
          </Button>
          <Button className="w-full sm:w-auto" variant="outline" asChild>
            <Link href={'/'}>Go Home</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
