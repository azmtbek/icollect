
import React from 'react';
import Login from './form';
import { signIn } from "@/server/auth";

const Page = async () => {
  const login = async ({ email, password }: { email: string, password: string; }) => {
    'use server';
    await signIn('credentials', {
      redirectTo: '/',
      // callbackUrl: '/',
      email: email,
      password: password,
    });
  };
  return (
    <Login login={login} />
  );
};

export default Page;