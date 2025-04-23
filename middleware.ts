import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

// Mapping of routes to roles that can access them
const ROUTE_ACCESS: Record<string, string[]> = {
  '/dashboard/overview': ['ADMIN', 'MANAGER', 'STAFF'],
  '/dashboard/loanapplications': ['ADMIN', 'MANAGER'],
  '/dashboard/grantapplications': ['ADMIN', 'MANAGER'],
  '/dashboard/investments': ['ADMIN', 'MANAGER'],
  '/dashboard/contact': ['ADMIN', 'MANAGER', 'STAFF'],
  '/dashboard/webiste': ['ADMIN', 'MANAGER', 'STAFF'],
  '/dashboard/users': ['ADMIN'],
  '/dashboard/settings': ['ADMIN'],
  // Add more routes and their allowed roles as needed
};

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

    // Admin can access everything
    if (token.role === 'ADMIN') {
      return NextResponse.next();
    }

    // Check role-based access for the requested route
    const matchingRoute = Object.keys(ROUTE_ACCESS).find(route => 
      pathname.startsWith(route)
    );

    if (matchingRoute) {
      const allowedRoles = ROUTE_ACCESS[matchingRoute];
      // @ts-ignore - We know role exists on our token
      if (!allowedRoles.includes(token.role)) {
        // Redirect to the dashboard main page
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
    }
  }

  // If the user is already authenticated and tries to access signin or signup pages
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