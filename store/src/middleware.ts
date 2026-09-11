import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from './lib/auth';

// Define the paths that require authentication
const protectedRoutes = ['/admin'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the route is protected (any route starting with /admin, except /admin/login)
  const isProtectedRoute = protectedRoutes.some(
    (route) => pathname.startsWith(route) && pathname !== '/admin/login'
  );

  if (isProtectedRoute) {
    const token = request.cookies.get('admin_token')?.value;

    if (!token) {
      // Redirect to login if no token is found
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Verify the token
    const payload = await verifyToken(token);

    if (!payload) {
      // Redirect to login if token is invalid or expired
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      // Also clear the invalid cookie
      const response = NextResponse.redirect(loginUrl);
      response.cookies.delete('admin_token');
      return response;
    }
  }

  // Check if trying to access login page while already authenticated
  if (pathname === '/admin/login') {
    const token = request.cookies.get('admin_token')?.value;
    if (token) {
      const payload = await verifyToken(token);
      if (payload) {
        // Redirect to admin dashboard if already logged in
        return NextResponse.redirect(new URL('/admin', request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
