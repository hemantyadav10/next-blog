import {
  clearOAuthCookies,
  createAuthResponse,
  exchangeGoogleCode,
  findOrCreateGoogleUser,
  GoogleOAuthError,
  verifyGoogleIdToken,
} from '@/lib/auth';
import { COOKIE_NAMES, OAUTH_ERRORS } from '@/lib/constants';
import { NextRequest, NextResponse } from 'next/server';

type AuthIntent = 'login' | 'register';

export async function GET(request: NextRequest) {
  const intent: AuthIntent =
    request.cookies.get(COOKIE_NAMES.OAUTH_INTENT)?.value === 'register'
      ? 'register'
      : 'login';

  try {
    const { code, oauthNonce } = validateOAuthCallback(request);
    const tokenData = await exchangeGoogleCode(code);
    const payload = await verifyGoogleIdToken(tokenData.id_token, oauthNonce);
    const user = await findOrCreateGoogleUser(payload);

    return createAuthResponse(user, request, 'google');
  } catch (error) {
    console.error('Google OAuth error:', error);

    if (error instanceof GoogleOAuthError)
      return redirectWithError(request, error.code, intent);

    return redirectWithError(request, OAUTH_ERRORS.SERVER_ERROR, intent);
  }
}

function redirectWithError(
  request: NextRequest,
  error: string,
  intent: AuthIntent = 'login',
) {
  const response = NextResponse.redirect(
    new URL(`/${intent}?error=${error}`, request.nextUrl),
  );

  clearOAuthCookies(response);

  return response;
}

function validateOAuthCallback(request: NextRequest): {
  code: string;
  oauthNonce: string;
} {
  const { searchParams } = request.nextUrl;

  const error = searchParams.get('error');
  if (error) {
    if (error === 'access_denied')
      throw new GoogleOAuthError(OAUTH_ERRORS.ACCESS_DENIED);
    throw new GoogleOAuthError(OAUTH_ERRORS.OAUTH_ERROR);
  }

  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const oauthState = request.cookies.get(COOKIE_NAMES.OAUTH_STATE)?.value;
  const oauthNonce = request.cookies.get(COOKIE_NAMES.OAUTH_NONCE)?.value;

  if (!code || !state) throw new GoogleOAuthError(OAUTH_ERRORS.MISSING_PARAMS);

  // OAuth state and OAuth nonce must exist to confirm this callback belongs to an active session.
  if (!oauthState) throw new GoogleOAuthError(OAUTH_ERRORS.SESSION_EXPIRED);

  if (!oauthNonce) throw new GoogleOAuthError(OAUTH_ERRORS.SESSION_EXPIRED);

  // Prevent CSRF by validating callback state against the original request.
  if (state !== oauthState)
    throw new GoogleOAuthError(OAUTH_ERRORS.INVALID_STATE);

  return { code, oauthNonce };
}
