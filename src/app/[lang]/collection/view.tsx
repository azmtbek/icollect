'use client';
import MinScreen from '@/components/layout/min-screen';
import { useLocale } from '@/components/provider/locale-provider';
import { Button } from '@/components/ui/button';
import { type Locale } from '@/i18n-config';
import { api } from '@/trpc/react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import React, { useMemo } from 'react';
import { DataTable } from './data-table';
import { columns } from './col-columns';

const Collections = () => {
  const { lang } = useParams<{ lang: Locale; }>();
  const locale = useLocale((state) => state.collection.view);
  const localeTitles = useLocale((state) => state.titles);
  const { data: collections } = api.collection.getUserCollections.useQuery();
  const filteredCollections = useMemo(() => {
    console.log(collections);

    return collections ?? [];
  }, [collections]);
  return (
    <>
      <div className='flex items-center justify-between w-full'>
        <div className='text-2xl'>{localeTitles.collections}</div>
        <Link href={`/${lang}/collection/create`}><Button>{locale.addCollection}</Button></Link>
      </div>

      <DataTable data={filteredCollections} columns={columns} />
    </>
  );
};

export default Collections;