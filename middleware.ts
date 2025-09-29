import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;

    // Proteggi le route admin
    if (pathname.startsWith('/admin')) {
      // Se non è autenticato, reindirizza al login
      if (!token) {
        const signInUrl = new URL('/auth/signin', req.url);
        signInUrl.searchParams.set('callbackUrl', req.url);
        return NextResponse.redirect(signInUrl);
      }

      // Se è autenticato ma non è admin, mostra messaggio di accesso negato
      if (!token.isAdmin) {
        return NextResponse.rewrite(new URL('/auth/access-denied', req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;
        
        // Le route pubbliche sono sempre accessibili
        if (!pathname.startsWith('/admin')) {
          return true;
        }

        // Per le route admin, richiedi autenticazione
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    // Proteggi tutte le route admin
    '/admin/:path*',
  ],
};
