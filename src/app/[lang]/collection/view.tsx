'use client';
import { useLocale } from '@/components/provider/locale-provider';
import { Button } from '@/components/ui/button';
import { type Locale } from '@/i18n-config';
import { api } from '@/trpc/react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import React, { useMemo } from 'react';
import { DataTable } from './data-table';
import { columns } from './columns';
import { CSVLink } from "react-csv";

const Collections = () => {
  const { lang } = useParams<{ lang: Locale; }>();
  const locale = useLocale((state) => state.collection.view);
  const localeTitles = useLocale((state) => state.titles);
  const { data: collections } = api.collection.getUserCollections.useQuery();
  const filteredCollections = useMemo(() => {
    return collections ?? [];
  }, [collections]);

  return (
    <>
      <div className='flex items-center justify-between w-full'>
        <div className='text-2xl'>{localeTitles.collections}</div>
        <div>
          <div className='flex items-center gap-3'>
            <CSVLink data={filteredCollections} filename='data.csv'> <Button variant={'outline'}>Export to CSV</Button></CSVLink>
            <Link href={`/${lang}/collection/create`}><Button>{locale.addCollection}</Button></Link>
          </div>
        </div>

      </div>

      <DataTable data={filteredCollections} columns={columns} />
    </>
  );
};

export default Collections;