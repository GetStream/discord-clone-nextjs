import { authMiddleware, clerkClient, redirectToSignIn } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import { NextResponse } from 'next/server';

// See https://clerk.com/docs/references/nextjs/auth-middleware
// for more information about configuring your Middleware

export default authMiddleware({
  // Allow signed out users to access the specified routes:
  // publicRoutes: ['/anyone-can-visit-this-route'],
  // Prevent the specified routes from accessing
  // authentication information:
  // ignoredRoutes: ['/no-auth-in-this-route'],

  async afterAuth(auth, request) {
    // if users are not authenticated
    if (!auth.userId && !auth.isPublicRoute) {
      return redirectToSignIn({ returnBackUrl: request.url });
    }

    // If user has signed up, register on Stream backend
    if (auth.userId && !auth.user?.privateMetadata?.streamRegistered) {
      // return redirect('/register');
    } else {
      console.log(
        '[Middleware] User already registered on Stream backend: ',
        auth.userId
      );
    }

    return NextResponse.next();
  },
});

export const config = {
  matcher: [
    // Exclude files with a "." followed by an extension, which are typically static files.
    // Exclude files in the _next directory, which are Next.js internals.

    '/((?!.+\\.[\\w]+$|_next).*)',
    // Re-include any files in the api or trpc folders that might have an extension
    '/(api|trpc)(.*)',
  ],
};
