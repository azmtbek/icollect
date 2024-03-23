import { NextAuthConfig } from 'next-auth';
import {
  api
} from '@/trpc/server';
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import * as schema from "./db/schema";
import "next-auth";

export const authConfig = {
  pages: {
    signIn: '/login',
  },
  providers: [
  ],
  callbacks: {
    async authorized({ auth, request: { nextUrl } }) {
      let isLoggedIn = !!auth?.user;
      let isOnDashboard = nextUrl.pathname.split('/')[1] === 'admin';
      if (isOnDashboard) {
        if (isLoggedIn) {
          return true;
        }
        return false; // Redirect unauthenticated users to login page
      } else if (isLoggedIn) {
        return Response.redirect(new URL('/', nextUrl));
      }
      return true;
    },
  },
} satisfies NextAuthConfig;
