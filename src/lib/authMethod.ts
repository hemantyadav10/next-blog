export type AuthMethod = 'google' | 'github' | 'email';
export type SocialProvider = Exclude<AuthMethod, 'email'>;
const KEY = 'lastAuthMethod';

export const saveAuthMethod = (method: AuthMethod) => {
  localStorage.setItem(KEY, method);
};

export const getLastAuthMethod = (): AuthMethod | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('lastAuthMethod') as AuthMethod | null;
};

const SOCIAL_PROVIDERS: SocialProvider[] = ['google', 'github'];

export function isSocialProvider(provider: string): provider is SocialProvider {
  return SOCIAL_PROVIDERS.includes(provider as SocialProvider);
}
