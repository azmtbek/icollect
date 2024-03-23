// import { DrizzleAdapter } from "@auth/drizzle-adapter";
import {
  // getServerSession,
  type DefaultSession,
  // type NextAuthOptions,
  // type User,
} from "next-auth";
import { type Adapter } from "next-auth/adapters";

// // import DiscordProvider from "next-auth/providers/discord";

// // import { env } from "@/env";
import { db } from "@/server/db";
// import { pgTable } from "@/server/db/schema";
// import EmailProvider from "next-auth/providers/email";
// import { env } from "@/env";
// import Credentials from "next-auth/providers/credentials";
// import { api } from "@/trpc/server";
// import { compare } from "bcrypt-ts";
// import NextAuth from "next-auth/next";
// /**
//  * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
//  * object and keep type safety.
//  *
//  * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
//  */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string | undefined;
      // ...other properties
      isAdmin: boolean;
    } & DefaultSession["user"];
  }

  type User = {
    // ...other properties
    isAdmin: boolean;
  } & DefaultSession["user"];
}

// /**
//  * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
//  *
//  * @see https://next-auth.js.org/configuration/options
//  */
// export const authOptions: NextAuthOptions = {
//   pages: {
//     signIn: "/login",
//   },
//   callbacks: {
//     session: ({ session, user }) => ({
//       ...session,
//       user: {
//         ...session.user,
//         id: user.id,
//       },
//     }),

//   },
//   adapter: DrizzleAdapter(db, pgTable) as Adapter,
//   providers: [
//     // TODO: update providers
//     // DiscordProvider({
//     //   clientId: env.DISCORD_CLIENT_ID,
//     //   clientSecret: env.DISCORD_CLIENT_SECRET,
//     // }),
//     /**
//      * ...add more providers here.
//      *
//      * Most other providers require a bit more work than the Discord provider. For example, the
//      * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
//      * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
//      *
//      * @see https://next-auth.js.org/providers/github
//      */
//     // EmailProvider({
//     //   server: env.EMAIL_SERVER,
//     //   from: env.EMAIL_FROM
//     // }),
//     Credentials({
//       name: "credentials",
//       credentials: {
//         email: { label: "Email", type: "text", placeholder: "jon@mail.com" },
//         password: { label: "Password", type: "password" }
//       },
//       async authorize({ email, password }: any, req: any) {
//         const user = await api.user.getByEmail.query({ email });
//         if (!user) return null;
//         if (user.status === 'blocked') return null;
//         let passwordsMatch = await compare(password, user.password);
//         console.log('match', passwordsMatch);
//         if (passwordsMatch) return user as any;
//         return null;
//       },
//     }),
//   ],
// };

// /**
//  * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
//  *
//  * @see https://next-auth.js.org/configuration/nextjs
//  */
// export const getServerAuthSession = () => getServerSession(authOptions);
// export const { auth, signIn, signOut } = NextAuth(authOptions);


import NextAuth, { User } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { compare } from 'bcrypt-ts';
import { api } from '@/trpc/server';
import { authConfig } from './auth.config';

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize({ email, password }: any) {
        // let user = await getUserByEmail(email);
        let user = await api.user.getByEmail.query({ email });
        // let status = await getUserStatusByEmail(email);
        console.log('user', user);
        if (user == null) return null;
        if (user.status === 'blocked') return null;
        let passwordsMatch = await compare(password, user.password!);
        if (passwordsMatch) return user as any;
      },
    }),
  ],
});
