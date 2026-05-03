import { Alert, AlertTitle } from '@/components/ui/alert';
import { OAUTH_ERROR_MESSAGES } from '@/lib/constants';
import { isOAuthErrorCode } from '@/lib/utils';
import { AlertCircleIcon } from 'lucide-react';

interface OAuthErrorProps {
  error?: string | null;
}

export function OAuthError({ error }: OAuthErrorProps) {
  if (!error || !isOAuthErrorCode(error)) return null;

  const message = OAUTH_ERROR_MESSAGES[error];

  return (
    <Alert variant="destructive">
      <AlertCircleIcon />
      <AlertTitle>{message}</AlertTitle>
    </Alert>
  );
}
