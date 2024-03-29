'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { type Locale } from '@/i18n-config';
import { useParams, useRouter } from 'next/navigation';
import React, { useState } from 'react';

const SearchInput = () => {
  const { lang } = useParams<{ lang: Locale; }>();
  const router = useRouter();
  const [search, setSearch] = useState('');
  return (
    <div className='flex gap-2'>
      <Input type='search' placeholder='Search' onChange={(e) => {
        e.preventDefault(); setSearch(e.target.value);
      }}
      />
      <Button variant={'outline'} onClick={(e) => {
        e.preventDefault();
        router.push(`/${lang}/search?q=${search}`);
      }}>Search</Button>
    </div>
  );
};

export default SearchInput;