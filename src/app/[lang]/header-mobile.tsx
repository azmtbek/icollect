'use client';
import { Button } from '@/components/ui/button';
import React from 'react';
import SearchInput from './search-input';
import { Boxes, Menu, Shield, User, X } from 'lucide-react';
import Link from 'next/link';
import { useLocale } from '@/components/provider/locale-provider';
import { useParams } from 'next/navigation';
import { type Locale } from '@/i18n-config';
import { cn } from '@/lib/utils';
import { type MediaEnum, useMedia } from '@/components/provider/media-provider';
import { Separator } from '@/components/ui/separator';

type Props = {
  currUser: {
    id: string;
    name: string | null;
    image: string | null;
    email: string;
    status: string;
    isAdmin: boolean;
  } | undefined;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
};

const HeaderMobile = ({ currUser, signIn, signOut }: Props) => {
  const { media, setMedia } = useMedia();
  const { lang } = useParams<{ lang: Locale; }>();
  const localeTitles = useLocale((state) => state.titles);
  const toggleMenu = () => {
    setMedia?.((prev: MediaEnum) => prev === 'desktop' ? 'mobile' : 'desktop');
  };
  return (
    <div className='relative overflow-hidden max-h-scrn z-20'>
      <Button variant={'ghost'} onClick={toggleMenu} >{media == 'mobile' ? <X /> : <Menu />}</Button>
      <div className='fixed top-16 left-0 z-20 bg-muted '>
        <div
          className={cn('bg-muted bg-opacity-100 gap-2 opacity-100 ',
            'w-screen min-h-scrn z-20 flex flex-col justify-center items-start',
            'px-4 overflow-hidden max-h-scrn'
          )}
          style={{ display: media == 'mobile' ? 'flex' : 'none', zIndex: 200 }}
        >
          <div className='h-6'></div>
          <SearchInput />
          <Separator />
          {currUser?.isAdmin &&
            <Link href={`/${lang}/admin`}>
              <Button variant={'link'} className='text-xl gap-3'><Shield /> Admin</Button>
            </Link>
          }
          {currUser &&
            <Link href={`/${lang}/collection`}>
              <Button variant={'link'} className='text-xl gap-3'><Boxes />{localeTitles.collections}</Button>
            </Link>
          }
          <Separator />
          <div className='flex flex-col gap-4 items-center'>
            {currUser && <Button variant={'secondary'} className='rounded-full gap-3'><User />{currUser.name}</Button>}
            {currUser ?
              <form
                action={signOut}
              >
                <Button type="submit" variant="outline">
                  Sign out
                </Button>
              </form> :
              <form
                action={signIn}
              >
                <Button type="submit" variant="outline">
                  Sign In
                </Button>
              </form>
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeaderMobile;