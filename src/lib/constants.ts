export const COOKIE_NAMES = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
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
