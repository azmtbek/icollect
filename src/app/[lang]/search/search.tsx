'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { type Locale } from '@/i18n-config';
import { api } from '@/trpc/react';
import Link from 'next/link';

import { useParams, useSearchParams } from 'next/navigation';

const Search = () => {
  const { lang } = useParams<{ lang: Locale; }>();
  const searchP = useSearchParams();
  const search = searchP?.get('q') ?? '';
  const { data: results } = api.search.getResults.useQuery({ search });
  // const { data: resultsFTS } = api.search.getResultsFTS.useQuery({ search });

  return (
    <Card className='w-full'>

      <div >
        <CardHeader>
          <div className='py-4 text-lg'>Seach Results For : <span className='italic'> {search}</span></div>
        </CardHeader>
        <CardContent>
          <div className='flex flex-col'>{results?.map(item => {
            return <div key={item.id} className='w-full'>
              <Link href={`/${lang}/collection/${item.collectionId}/item/${item.id}`}>
                <Button variant={'ghost'}
                  className='size-full cursor-pointer hover:bg-secondary border-t rounded-none py-4'>
                  {item.name}
                </Button>
              </Link>
            </div>;
          })}
          </div>
          <hr />
          {/* <div>FTS</div>
          <div className='flex flex-col'>{resultsFTS?.map(item => {
            return <div key={item.id} className='w-full'>
              <Link href={`/${lang}/collection/${item.collectionId}/item/${item.id}`}>
                <Button variant={'ghost'}
                  className='size-full cursor-pointer hover:bg-secondary border-t rounded-none py-4'>
                  {item.name}
                </Button>
              </Link>
            </div>;
          })}
          </div> */}
        </CardContent>
      </div>
    </Card>
  );
};

export default Search;