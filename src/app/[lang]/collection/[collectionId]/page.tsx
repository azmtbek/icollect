'use client';
import MinScreen from '@/components/layout/min-screen';
import { useLocale } from '@/components/provider/locale-provider';
import { Button } from '@/components/ui/button';
import { type Locale } from '@/i18n-config';
import { api } from '@/trpc/react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import React, { useMemo } from 'react';
import { useColumns } from './columns';
import { DataTable } from './data-table';

const Collection = () => {
  const { collectionId, lang } = useParams<{ collectionId: string; lang: Locale; }>();
  const locale = useLocale((state) => state.collection.view);
  const { data: collection, isLoading: collectionIsLoading } = api.collection.getById.useQuery({ id: +collectionId });
  const { data: items, isLoading: itemIsloading } = api.item.getCollectionItems.useQuery({ collectionId: +collectionId });
  const { data: tags } = api.tag.getItemTagNames.useQuery({ itemId: items?.[0]?.id });
  const filteredItems = useMemo(() => {
    console.log(items);
    return items?.map(i => ({ ...i, tags: tags?.map(t => '' + t.tag?.id) })) ?? [];
  }, [items]);
  const columns = useColumns();
  return (
    <MinScreen>
      <div className='flex items-center justify-between w-full'>
        <div className='text-2xl'>{locale.title} : {collection?.name}</div>
        <Link href={`/${lang}/collection/${collectionId}/item/create`}><Button>{locale.addItem}</Button></Link>
      </div>
      <DataTable data={filteredItems} columns={columns} />
    </MinScreen >
  );
};

export default Collection;;