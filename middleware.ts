import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Get token with minimal options to avoid edge runtime issues
  const token = await getToken({ 
    req: request, 
    secret: process.env.NEXTAUTH_SECRET
  });

  // Check if the path starts with /dashboard
  if (pathname.startsWith('/dashboard')) {
    // If the user is not authenticated, redirect to the sign-in page
    if (!token) {
      const url = new URL('/signin', request.url);
      url.searchParams.set('callbackUrl', encodeURI(pathname));
      return NextResponse.redirect(url);
    }

    // If the user is authenticated but doesn't have the required role for admin routes
    if (pathname.startsWith('/dashboard/users') || pathname.startsWith('/dashboard/settings')) {
      // @ts-ignore - We know role exists on our token
      if (token.role !== 'ADMIN' && token.role !== 'MANAGER') {
        // Redirect to the dashboard overview page
        return NextResponse.redirect(new URL('/dashboard/overview', request.url));
      }
    }
  }

  // If user is already authenticated and tries to access signin or signup pages
  if ((pathname === '/signin' || pathname === '/signup') && token) {
    // Redirect to dashboard
    const response = NextResponse.redirect(new URL('/dashboard', request.url));
    // Ensure no caching
    response.headers.set('Cache-Control', 'no-store, max-age=0');
    response.headers.set('x-middleware-cache', 'no-cache');
    return response;
  }

  return NextResponse.next();
}

// Configure the middleware to run only on specific paths
export const config = {
  matcher: ['/dashboard/:path*', '/signin', '/signup'],
}; 