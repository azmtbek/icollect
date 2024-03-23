// 'use client';
import React from 'react';

import ThemeButton from './theme-button';
import Link from 'next/link';
import { auth, signIn, signOut } from '@/server/auth';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { api } from '@/trpc/server';
// import { useSession } from 'next-auth/react';

export const Header = async () => {
  const session = await auth();
  const currUser = await api.user.getCurrent.query();
  return (
    <header className='sticky h-16 pt-3 w-full border-b-2'>
      <div className='flex justify-between items-center container'>
        <div className='flex gap-2 items-center'>
          <Link href='/' className='flex gap-2 items-center py-1 px-4 border rounded-lg bg-lime-700 text-white text-xl font-mono'>
            iCollect
          </Link>
          <ThemeButton />
          <div>Lang</div>
        </div>
        <div></div>
        <div className='flex gap-4 items-center'>
          {currUser?.isAdmin &&
            <Link href='/admin'>
              <Button variant={'outline'} className='text-xl'>Admin</Button>
            </Link>
          }
          <Link href='/collection'>
            <Button variant={'outline'} className='text-xl'>Collections</Button>
          </Link>
          {session?.user?.name}
          {session?.user?.id}
          {session?.user ? <SignOut /> :
            <SignIn />}
        </div>
      </div>
    </header >
  );
};

function SignOut() {
  return (
    <form
      action={async () => {
        'use server';
        await signOut();
      }}
    >
      <Button type="submit" variant="outline">
        Sign out
      </Button>
    </form>
  );
}

function SignIn() {
  return (
    <form
      action={async () => {
        'use server';
        await signIn();
      }}
    >
      <Button type="submit" variant="outline">
        Sign In
      </Button>
    </form>
  );
}