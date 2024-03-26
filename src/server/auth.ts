import type { DefaultSession } from "next-auth";
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { compare } from 'bcrypt-ts';
import { api } from '@/trpc/server';
import { authConfig } from './auth.config';
/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      isAdmin: boolean;
    } & DefaultSession["user"];
  }
}


export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize({ email, password }: { email?: string, password?: string; }) {
        if (!email || !password) return null;
        const user = await api.user.getByEmail.query({ email });
        if (user == null) return null;
        if (user.status === 'blocked') return null;
        const passwordsMatch = await compare(password, user.password);
        if (passwordsMatch) return user;
        return null;
      },
    }),
  ],
});
