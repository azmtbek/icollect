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
  const tagName = searchP?.get('tag') ?? '';
  const { data: results } = api.tag.getItemsByTagId.useQuery({ tagName });
  const { data: resultsFTS } = api.search.getResultsFTS.useQuery({ search });

  return (
    <Card className='w-full'>
      <div >
        <CardHeader>
          <div className='py-4 text-lg'>Seach Results For : <span className='italic'> {search}</span></div>
        </CardHeader>
        <CardContent>
          <div className='flex flex-col items-start'>{results?.map(item => {
            return <Link key={item.id}
              href={`/${lang}/collection/${item.collectionId}/item/${item.id}`}
              className='size-full gap-2 m-0 cursor-pointer hover:bg-secondary border-t rounded-none py-4'>
              <span className='text-xl'>
                title: {item.name}{' '}
              </span>
              <span className='gap-2 flex'>
                <span> Content: </span>
                {item.customString1 && <span>
                  {item.customString1},
                </span>}
                {item.customString2 && <span>
                  {item.customString2},
                </span>}
                {item.customString3 && <span>
                  {item.customString3},
                </span>}
                {item.customText1 && <span>
                  {item.customText1},
                </span>}

                {item.customText2 && <span>
                  {item.customText2},
                </span>}
                {item.customText3 && <span>
                  {item.customText3},
                </span>}
              </span>
            </Link>;
          })}
          </div>
          <hr />
          <div className='flex flex-col items-start'>{resultsFTS?.map(item => {
            return <Link key={item.id}
              href={`/${lang}/collection/${item.collectionId}/item/${item.id}`}
              className='size-full gap-2 m-0 cursor-pointer hover:bg-secondary border-t rounded-none py-4'>
              <span className='text-xl'>
                title: {item.name}{' '}
              </span>
              <span className='gap-2 flex'>
                <span> Content: </span>
                {item.customString1 && <span>
                  {item.customString1},
                </span>}
                {item.customString2 && <span>
                  {item.customString2},
                </span>}
                {item.customString3 && <span>
                  {item.customString3},
                </span>}
                {item.customText1 && <span>
                  {item.customText1},
                </span>}

                {item.customText2 && <span>
                  {item.customText2},
                </span>}
                {item.customText3 && <span>
                  {item.customText3},
                </span>}
              </span>
            </Link>;
          })}
          </div>
        </CardContent>
      </div>
    </Card>
  );
};

export default Search;