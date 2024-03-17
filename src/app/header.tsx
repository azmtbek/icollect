import React from 'react';
import ThemeButton from './theme-button';
import Link from 'next/link';

export const Header = () => {
  return (
    <header className='sticky h-16 pt-3 w-full border-b-2'>
      <div className='flex justify-between items-center container'>
        <ThemeButton />
        <div></div>
        <div className='flex gap-2'>
          <Link href={'/login'}> Sign in</Link>
        </div>
      </div>
    </header >
  );
};
