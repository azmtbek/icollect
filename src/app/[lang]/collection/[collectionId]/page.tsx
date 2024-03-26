'use client';
import MinScreen from '@/components/layout/min-screen';
import { useLocale } from '@/components/provider/locale-provider';
import { Button } from '@/components/ui/button';
import { type Locale } from '@/i18n-config';
import { api } from '@/trpc/react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import React from 'react';

const Collection = () => {
  const { collectionId, lang } = useParams<{ collectionId: string; lang: Locale; }>();
  const locale = useLocale((state) => state.collection.view);
  const { data: collection, isLoading: collectionIsLoading } = api.collection.getById.useQuery({ id: +collectionId });
  const { data: items, isLoading: itemIsloading } = api.item.getCollectionItems.useQuery({ collectionId: +collectionId });
  return (
    <MinScreen>
      {collectionIsLoading ? <>Collection Loading</> :
        collection && <div className='text-2xl'>{locale.title} : {collection.name}</div>
      }
      <div>
        <Link href={`/${lang}/collection/${collectionId}/item/create`} > <Button>{locale.addItem}</Button></Link>
      </div>
      <div>
        {itemIsloading ? <>Items Loading</> :
          items?.map(item => <div key={item.id}>
            <Link href={`/${lang}/collection/${collectionId}/item/${item.id}`} >{item.name}</Link>
          </div>)
        }</div>
    </MinScreen >
  );
};

export default Collection;;