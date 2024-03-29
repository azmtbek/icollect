import { type NextAuthConfig } from 'next-auth';
import "next-auth";

export const authConfig = {
  pages: {
    signIn: '/login',
  },
  providers: [
  ],
  callbacks: {
    async authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.split('/')[2] === 'admin';
      console.log('check', isOnDashboard, nextUrl.pathname);
      if (isOnDashboard) {
        if (isLoggedIn) {
          return true;
        }
        return false;

        // return Response.redirect(new URL('/', nextUrl));
        // Redirect unauthenticated users to login page
      }
      // else if (isLoggedIn) {
      //   return Response.redirect(new URL('/', nextUrl));
      // }
      return true;
    },
  },
} satisfies NextAuthConfig;
