'use client';
import React from 'react';

import ThemeButton from './theme-button';
import Link from 'next/link';
import { auth, getServerAuthSession } from '@/server/auth';
import { useSession } from 'next-auth/react';

export const Header = () => {

  // let session2 = await auth();
  // const session = await getServerAuthSession();
  const { data: session, status } = useSession();
  return (
    <header className='sticky h-16 pt-3 w-full border-b-2'>
      <div className='flex justify-between items-center container'>
        <ThemeButton />
        <div></div>
        <div className='flex gap-2'>
          {JSON.stringify(session)}
          {/* {JSON.stringify(session2)} */}
          <Link href={'/login'}> Sign in</Link>
        </div>
      </div>
    </header >
  );
};
