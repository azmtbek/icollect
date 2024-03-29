import React from 'react';
import ThemeButton from './theme-button';
import Link from 'next/link';
import { signIn, signOut } from '@/server/auth';
import { Button } from '@/components/ui/button';
import { api } from '@/trpc/server';
import LocaleSwitcher from './locale-switcher';
import { type Locale } from '@/i18n-config';
import { getDictionary } from '@/get-dictionary';

type Props = { lang: Locale; };

export const Header = async ({ lang }: Props) => {

  const dictionary = await getDictionary(lang);
  const currUser = await api.user.getCurrent.query();
  return (
    <header className='sticky h-16 pt-3 w-full border-b-2'>
      <div className='flex justify-between items-center container'>
        <div className='flex gap-2 items-center'>
          <Link href={`/${lang}`}
            className='flex gap-2 items-center py-1 px-4 border rounded-lg bg-lime-700 text-white text-xl font-mono'>
            iCollect
          </Link>
          <ThemeButton dictionary={dictionary.theme} />
          <LocaleSwitcher />
          {currUser?.isAdmin &&
            <Link href={`/${lang}/admin`}>
              <Button variant={'link'} className='text-xl'>Admin</Button>
            </Link>
          }
          {currUser &&
            <Link href={`/${lang}/collection`}>
              <Button variant={'link'} className='text-xl'>{dictionary.titles.collections}</Button>
            </Link>
          }
        </div>
        <div></div>
        <div className='flex gap-4 items-center'>
          <Button variant={'secondary'}>{currUser?.name}</Button>
          {currUser ?
            <SignOut /> :
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