'use client';
import MinScreen from '@/components/layout/min-screen';
import { Button } from '@/components/ui/button';
import { api } from '@/trpc/react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import React from 'react';

const Collection = () => {
  const { collectionId } = useParams();

  const { data: items } = api.item.getAll.useQuery();
  return (
    <MinScreen>
      <div>
        <Link href={`/collection/${collectionId}/item/create`} > <Button>Add Item</Button></Link>
      </div>
      <div>{items?.map(item => <div key={item.id}>
        <Link href={`/collection/${collectionId}/item/${item.id}`} >{item.name}</Link>
      </div>)}</div>
    </MinScreen >
  );
};

export default Collection;;