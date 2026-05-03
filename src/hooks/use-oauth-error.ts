import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export function useOAuthError() {
  const searchParams = useSearchParams();
  const [oauthError] = useState(() => searchParams.get('error'));

  useEffect(() => {
    if (!oauthError) return;
    const url = new URL(window.location.href);
    url.searchParams.delete('error');
    window.history.replaceState({}, '', url);
  }, [oauthError]);

  return oauthError;
}
