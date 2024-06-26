'use client';
import { useLocale } from '@/components/provider/locale-provider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { type Locale } from '@/i18n-config';
import { Search } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import React, { useState } from 'react';

const SearchInput = () => {
  const { lang } = useParams<{ lang: Locale; }>();
  const router = useRouter();
  const [search, setSearch] = useState('');
  const localeTitles = useLocale(state => state.titles);
  return (
    <div className='flex gap-2'>
      <Input type='search' placeholder={localeTitles.search}
        onChange={(e) => {
          e.preventDefault(); setSearch(e.target.value);
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            router.push(`/${lang}/search?q=${search}`);
          }
        }}
      />
      <Button variant={'outline'} onClick={(e) => {
        e.preventDefault();
        router.push(`/${lang}/search?q=${search}`);
      }}><Search /></Button>
    </div>
  );
};

export default SearchInput;