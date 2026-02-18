import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from './lib/auth';
import { COOKIE_NAMES } from './lib/constants';

// 1. Specify protected and public routes
const authRoutes = ['/login', '/register'];
const protectedRoutes = [
  '/dashboard',
  '/write',
  '/settings',
  '/profile',
  '/reading-list',
];

export async function proxy(request: NextRequest) {
  // 2. Check if the current route is protected or public
  const path = request.nextUrl.pathname;
  const isPublicRoute = authRoutes.some((route) => path.startsWith(route));
  const isProtectedRoute = protectedRoutes.some((route) =>
    path.startsWith(route),
  );

  // 3. Decrypt the access token from the cookie
  const accessToken = request.cookies.get(COOKIE_NAMES.ACCESS_TOKEN)?.value;
  const tokenResult = await verifyToken(accessToken);

  // 4. Redirect to /login if the user is not authenticated
  if (isProtectedRoute && !tokenResult.success) {
    return NextResponse.redirect(new URL('/login', request.nextUrl));
  }

  // 5. Redirect to / if the user is authenticated
  if (isPublicRoute && tokenResult.success && tokenResult.payload.userId) {
    return NextResponse.redirect(new URL('/', request.nextUrl));
  }

  return NextResponse.next();
}

// Routes Proxy should not run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};
