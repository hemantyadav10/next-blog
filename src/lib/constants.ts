export const COOKIE_NAMES = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
} as const;

export const ENV = process.env.NODE_ENV;
export const IS_DEV = ENV === 'development';
export const IS_PROD = ENV === 'production';
export const IS_TEST = ENV === 'test';

export const APP_NAME = 'InfiniteInk' as const;
