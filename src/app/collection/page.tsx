'use client';
import MinScreen from '@/components/layout/min-screen';
import { Button } from '@/components/ui/button';
import { api } from '@/trpc/react';
import Link from 'next/link';
import React from 'react';

const Collections = () => {
  const { data: collections } = api.collection.getUserCollections.useQuery();
  return (
    <MinScreen>
      <div>
        <Link href='/collection/create'><Button>Add Collection</Button></Link>
      </div>
      <div>Collections</div>
      {collections?.map(col =>
        <div><Link href={'/collection/' + col.id}>
          {col.name}
        </Link>
        </div>)}
    </MinScreen>
  );
};

export default Collections;