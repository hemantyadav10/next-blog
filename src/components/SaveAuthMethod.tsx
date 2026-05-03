'use client';

import { isSocialProvider, saveAuthMethod } from '@/lib/authMethod';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { toast } from 'sonner';

export function SaveAuthMethod() {
  const searchParams = useSearchParams();
  const providerFromUrl = searchParams.get('provider');
  const oauthStatus = searchParams.get('oauth');

  useEffect(() => {
    if (
      oauthStatus === 'success' &&
      providerFromUrl &&
      isSocialProvider(providerFromUrl)
    ) {
      saveAuthMethod(providerFromUrl);
      toast.success('Signed in successfully');

      const url = new URL(window.location.href);
      url.searchParams.delete('provider');
      url.searchParams.delete('oauth');
      window.history.replaceState({}, '', url);
    }
  }, [providerFromUrl, oauthStatus]);

  return null;
}
