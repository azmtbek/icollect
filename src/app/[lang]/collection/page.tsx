'use client';
import MinScreen from '@/components/layout/min-screen';
import { Button } from '@/components/ui/button';
import { Locale } from '@/i18n-config';
import { api } from '@/trpc/react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import React from 'react';

const Collections = () => {
  const { lang } = useParams<{ lang: Locale; }>();
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