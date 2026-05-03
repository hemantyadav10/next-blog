import { useState } from 'react';

export function useGoogleAuth(intent: 'login' | 'register') {
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleGoogleAuth = () => {
    if (isGoogleLoading) return;
    setIsGoogleLoading(true);
    window.location.assign(`/api/auth/google?intent=${intent}`);
  };

  return { isGoogleLoading, handleGoogleAuth };
}
