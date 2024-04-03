import React from 'react';
import ThemeButton from './theme-button';
import Link from 'next/link';
import { signIn, signOut } from '@/server/auth';
import { Button } from '@/components/ui/button';
import { api } from '@/trpc/server';
import LocaleSwitcher from './locale-switcher';
import { type Locale } from '@/i18n-config';
import { type ServerDictionary, getDictionary } from '@/get-dictionary';
import SearchInput from './search-input';
import HeaderMobile from './header-mobile';

type Props = { lang: Locale; };

export const Header = async ({ lang }: Props) => {

  const dictionary = await getDictionary(lang);
  const currUser = await api.user.getCurrent.query();

  const signout = async () => {
    'use server';
    await signOut();
  };

  const signin = async () => {
    'use server';
    await signIn();
  };

  return (
    <header className='sticky h-16 pt-3 w-full border-b-2'>
      {/* ui for mobile */}
      <div className='flex justify-between items-center container md:hidden z-20'>
        <div className='flex gap-2 items-center'>
          <Link href={`/${lang}`}
            className='flex gap-2 items-center py-1 px-4 border rounded-lg bg-lime-700 text-white text-xl font-mono'>
            iCollect
          </Link>
          <ThemeButton />
          <LocaleSwitcher />
        </div>
        <HeaderMobile signIn={signin} signOut={signout} currUser={currUser} />
      </div>
      {/* ui for desktop */}
      <div className='hidden md:flex justify-between items-center container '>
        <div className='flex gap-2 items-center'>
          <Link href={`/${lang}`}
            className='flex gap-2 items-center py-1 px-4 border rounded-lg bg-lime-700 text-white text-xl font-mono'>
            iCollect
          </Link>
          <ThemeButton />
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
        <SearchInput />
        <div className='flex gap-4 items-center'>
          {currUser && <Button variant={'secondary'} className='rounded-full'>{currUser.name}</Button>}
          {currUser ?
            <SignOut dictionary={dictionary.signing} /> :
            <SignIn dictionary={dictionary.signing} />}
        </div>
      </div>
    </header >
  );
};

async function SignOut({ dictionary }: { dictionary: ServerDictionary["signing"]; }) {
  const signout = async () => {
    'use server';
    await signOut();
  };
  return (
    <form
      action={signout}
    >
      <Button type="submit" variant="outline">
        {dictionary.signout}
      </Button>
    </form>
  );
}

async function SignIn({ dictionary }: { dictionary: ServerDictionary["signing"]; }) {
  const signin = async () => {
    'use server';
    await signIn();
  };
  return (
    <form
      action={signin}
    >
      <Button type="submit" variant="outline">
        {dictionary.signin}
      </Button>
    </form>
  );
}