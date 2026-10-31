import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect all /administrator routes except /administrator/login
  if (pathname.startsWith('/administrator') && pathname !== '/administrator/login') {
    const token = request.cookies.get('admin_token')?.value;

    if (!token) {
      const loginUrl = new URL('/administrator/login', request.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // If already logged in and visiting /administrator/login, redirect to dashboard
  if (pathname === '/administrator/login') {
    const token = request.cookies.get('admin_token')?.value;
    if (token) {
      return NextResponse.redirect(new URL('/administrator', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/administrator/:path*'],
};
