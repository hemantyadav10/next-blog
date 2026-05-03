'use client';

import { GithubIcon } from '@/assets/icons/GithubIcon';
import { type AuthMethod, getLastAuthMethod } from '@/lib/authMethod';
import { cn } from '@/lib/utils';
import { useSyncExternalStore } from 'react';
import { toast } from 'sonner';
import { GoogleIcon } from './icons/google-icon';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Spinner } from './ui/spinner';

type SocialProvider = Exclude<AuthMethod, 'email'>;

interface SocialButtonProps {
  provider: SocialProvider;
  showLastUsed?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
}

const providerConfig: Record<
  SocialProvider,
  { label: string; icon: React.ReactNode }
> = {
  google: {
    label: 'Continue with Google',
    icon: <GoogleIcon className="size-5" />,
  },
  github: {
    label: 'Continue with Github',
    icon: <GithubIcon className="size-5" />,
  },
};

function SocialButton({
  provider,
  showLastUsed,
  onClick,
  disabled,
  loading,
}: SocialButtonProps) {
  const lastUsed = useLastAuthMethod();
  const isLastUsed = showLastUsed && lastUsed === provider;
  const { label, icon } = providerConfig[provider];

  const defaultOnClick = () => {
    if (provider === 'google') {
      window.location.assign('/api/auth/google');
      return;
    }
    toast.info('GitHub login coming soon! Please use Google or email for now.');
  };

  return (
    <Button
      variant="outline"
      type="button"
      size={'lg'}
      onClick={onClick ?? defaultOnClick}
      className={cn('relative w-full', isLastUsed && 'ring-ring/50 ring')}
      disabled={disabled || loading}
    >
      {loading ? <Spinner /> : icon}
      {label}
      {isLastUsed && (
        <Badge className="absolute top-0 -right-2 -translate-y-1/2 rounded text-[10px]">
          Last used
        </Badge>
      )}
    </Button>
  );
}

export default SocialButton;

function useLastAuthMethod() {
  return useSyncExternalStore(
    () => () => {},
    () => getLastAuthMethod(),
    () => null,
  );
}
