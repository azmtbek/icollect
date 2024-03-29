'use client';
import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useParams } from 'next/navigation';
import { type Locale } from '@/i18n-config';
import { api } from '@/trpc/react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useLocale } from '@/components/provider/locale-provider';

const LatestItems = ({ className }: { className?: string; }) => {
  const { data: items } = api.item.getLatest.useQuery();
  const { lang } = useParams<{ lang: Locale; }>();
  const localeTitles = useLocale((state) => state.titles);
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{localeTitles.latestItems}</CardTitle>
      </CardHeader>
      <CardContent>
        {items?.map(item => {
          return <div key={item.id} className='w-full'>
            <Link href={`/${lang}/collection/${item.collectionId}/item/${item.id}`}>
              <Button variant={'ghost'}
                className='size-full flex justify-start cursor-pointer hover:bg-secondary border-t rounded-none py-4'>
                {item.name}
              </Button>
            </Link>
          </div>;
        })}
      </CardContent>
    </Card>
  );
};

export default LatestItems;