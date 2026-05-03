export const COOKIE_NAMES = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
  ANONYMOUS_TOKEN: 'anon_token',
  OAUTH_STATE: 'oauth_state',
  OAUTH_INTENT: 'intent',
} as const;

export const ENV = process.env.NODE_ENV;
export const IS_DEV = ENV === 'development';
export const IS_PROD = ENV === 'production';
export const IS_TEST = ENV === 'test';

export const APP_NAME = 'InfiniteInk' as const;

export const MODEL_NAMES = {
  BLOG: 'Blog',
  BLOG_VIEW: 'BlogView',
  BOOKMARK: 'Bookmark',
  CATEGORY: 'Category',
  COMMENT: 'Comment',
  FOLLOW: 'Follow',
  LIKE: 'Like',
  SEARCH_HISTORY: 'SearchHistory',
  TAG: 'Tag',
  USER: 'User',
  PASSWORD_RESET_TOKEN: 'PasswordResetToken',
} as const;

export const EMAIL_FROM = `${APP_NAME} <onboarding@resend.dev>` as const;

export const OAUTH_ERRORS = {
  ACCESS_DENIED: 'access_denied',
  OAUTH_ERROR: 'oauth_error',
  MISSING_PARAMS: 'missing_params',
  SESSION_EXPIRED: 'session_expired',
  INVALID_STATE: 'invalid_state',
  TOKEN_EXCHANGE_FAILED: 'token_exchange_failed',
  EMAIL_REQUIRED: 'email_required',
  SERVER_ERROR: 'server_error',
} as const;

export const OAUTH_ERROR_MESSAGES: Record<
  (typeof OAUTH_ERRORS)[keyof typeof OAUTH_ERRORS],
  string
> = {
  access_denied: 'Google sign-in was denied or cancelled.',
  oauth_error: 'Google sign-in failed. Please try again.',
  missing_params: 'Invalid authentication response. Please try again.',
  session_expired: 'Your sign-in session expired. Please try again.',
  invalid_state: 'Security validation failed. Please try again.',
  token_exchange_failed:
    'Unable to complete Google authentication. Please try again.',
  email_required: 'Your Google account did not provide an email address.',
  server_error: 'Something went wrong. Please try again.',
};
