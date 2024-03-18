'use client';
import React from 'react';

import ThemeButton from './theme-button';
import Link from 'next/link';
import { auth, getServerAuthSession } from '@/server/auth';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
// import { useSession } from 'next-auth/react';

export const Header = () => {
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
          <Link href='/admin'>
            <Button variant={'outline'} className='text-xl'>Admin</Button>
          </Link>
          <Link href='/collection'>
            <Button variant={'outline'} className='text-xl'>Collections</Button>
          </Link>
          <Link href={'/login'}> Sign in</Link>
        </div>
      </div>
    </header >
  );
};
