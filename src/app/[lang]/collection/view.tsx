'use client';
import MinScreen from '@/components/layout/min-screen';
import { useLocale } from '@/components/provider/locale-provider';
import { Button } from '@/components/ui/button';
import { type Locale } from '@/i18n-config';
import { api } from '@/trpc/react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import React, { useMemo } from 'react';

const Collections = () => {
  const { lang } = useParams<{ lang: Locale; }>();
  const locale = useLocale((state) => state.collection.view);
  const localeTitles = useLocale((state) => state.titles);
  const { data: collections } = api.collection.getUserCollections.useQuery();
  const filteredCollections = useMemo(() => {
    return collections ?? [];
  }, [collections]);
  return (
    <MinScreen>
      <div>
        <Link href={`/${lang}/collection/create`}><Button>{locale.addCollection}</Button></Link>
      </div>
      <div>{localeTitles.collections}</div>
      {filteredCollections.map(col =>
        <div key={col.id}><Link href={`/${lang}/collection/${col.id}`}>
          {col.name}
        </Link>
        </div>)}
    </MinScreen>
  );
};

export default Collections;