import { config } from '@/config/config';
import { COOKIE_NAMES, IS_PROD } from '@/lib/constants';
import { ResponseCookie } from 'next/dist/compiled/@edge-runtime/cookies';
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'node:crypto';

const COOKIE_OPTIONS: Partial<ResponseCookie> = {
  httpOnly: true,
  secure: IS_PROD,
  sameSite: 'lax',
  path: '/',
  maxAge: 60 * 15, // 15 minutes
};

export async function GET(request: NextRequest) {
  const intent =
    request.nextUrl.searchParams.get('intent') === 'register'
      ? 'register'
      : 'login';

  const state = crypto.randomUUID();

  const searchParams = new URLSearchParams({
    response_type: 'code',
    client_id: config.GOOGLE_CLIENT_ID,
    scope: 'openid profile email',
    redirect_uri: config.GOOGLE_REDIRECT_URI,
    state,
    nonce: crypto.randomUUID(),
    access_type: 'offline',
  });

  const uri = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  uri.search = searchParams.toString();
  const authenticationURI = uri.toString();

  const response = NextResponse.redirect(authenticationURI);

  // Store the state in a secure, HTTP-only cookie to verify it later in the callback
  response.cookies.set(COOKIE_NAMES.OAUTH_STATE, state, COOKIE_OPTIONS);
  response.cookies.set(COOKIE_NAMES.OAUTH_INTENT, intent, COOKIE_OPTIONS);

  return response;
}
