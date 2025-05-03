import { NextResponse } from 'next/server';

export function middleware(request) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname;
  
  // Define public paths that don't require authentication
  const isPublicPath = 
    path === '/auth/login' || 
    path === '/auth/register' || 
    path === '/' || 
    path.startsWith('/about') || 
    path.startsWith('/contact') || 
    path.startsWith('/lands/available') || 
    path.startsWith('/why-us') || 
    path.startsWith('/blog') || 
    path.startsWith('/book-inspection') || 
    path.startsWith('/admin/login');
  
  // Check if the path is for protected dashboard routes
  const isProtectedPath = 
    path.startsWith('/dashboard') || 
    path.startsWith('/favorites') || 
    path.startsWith('/my-portfolio');
  
  // Check if the path is for protected admin routes
  const isAdminPath = 
    path.startsWith('/admin') && 
    path !== '/admin/login';
  
  // Get the token from cookies
  const token = request.cookies.get('token')?.value;
  const adminToken = request.cookies.get('adminToken')?.value;
  
  // Redirect logic for protected routes
  if (isProtectedPath && !token) {
    // Redirect to login if trying to access protected route without token
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }
  
  // Redirect logic for admin routes
  if (isAdminPath && !adminToken) {
    // Redirect to admin login if trying to access admin route without admin token
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }
  
  // Redirect logic for login/register pages when already authenticated
  if (isPublicPath && path.includes('/auth/') && token) {
    // Redirect to dashboard if already logged in
    return NextResponse.redirect(new URL('/dashboard/profile', request.url));
  }
  
  // Redirect logic for admin login when already authenticated as admin
  if (path === '/admin/login' && adminToken) {
    // Redirect to admin dashboard if already logged in as admin
    return NextResponse.redirect(new URL('/admin/dashboard', request.url));
  }
  
  return NextResponse.next();
}

// Configure the middleware to run on specific paths
export const config = {
  matcher: [
    '/',
    '/auth/:path*',
    '/dashboard/:path*',
    '/admin/:path*',
    '/favorites',
    '/my-portfolio',
    '/lands/:path*',
  ],
};
