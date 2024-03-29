'use client';
import MinScreen from '@/components/layout/min-screen';
import { api } from '@/trpc/react';
import { useParams } from 'next/navigation';
import React from 'react';
import { Comments } from './comments';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Like } from './like';
import { type Collection } from '@/lib/types/collection';
import { Item } from '@/lib/types/item';
import { Separator } from '@/components/ui/separator';
import { useLocale } from '@/components/provider/locale-provider';
import Link from 'next/link';
import { type Locale } from '@/i18n-config';
import { collectionToItem } from '@/lib/collection-item-mapper';


const Item = () => {
  const { itemId, collectionId, lang } = useParams<{ itemId: string; collectionId: string; lang: Locale; }>();
  const { data: user } = api.user.getCurrent.useQuery();
  const { data: item, refetch: itemRefetch } = api.item.getById.useQuery({ id: +itemId });
  const { data: collection } = api.collection.getById.useQuery({ id: +collectionId });
  const locale = useLocale(state => state.collection.view);
  return (
    <MinScreen>
      <Card className='w-full'>
        <CardHeader className='flex items-center'>
          <CardTitle>{item?.name}</CardTitle>
          <CardDescription>
            <Link href={`/${lang}/collection/${collectionId}`}
              className="w-full h-full underline-offset-4 hover:underline">
              {locale.title} : {collection?.name}
            </Link>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div> {collectionToItem(collection)
            .map((col => {
              let itm = item && item[col as keyof Omit<Item, "tags">];
              if (itm instanceof Date)
                itm = new Intl.DateTimeFormat("en-US").format(itm);

              return <div key={col}>
                <div className='text-xl w-full'>
                  <div className='py-4 flex items-center justify-center'>
                    <Separator className='w-1/12' />
                  </div>
                  {collection?.[`${col}Name` as keyof Collection]}:
                </div>
                {itm
                  ? <div className='pl-10 pt-4 pb-6 '>{itm}</div>
                  : <div className='pl-10 pt-4 pb-6 italic'>No Value</div>
                }

              </div>;
            }))}
          </div>


          <Like
            userId={user?.id ?? ''}
            itemId={itemId}
            likesCount={item?.likesCount ?? 0}
            itemRefetch={itemRefetch}
          />
        </CardContent>
        <CardFooter className='flex flex-col'>
          {/* <hr className="h-px my-2 bg-primary border-0 w-full" /> */}
          <Separator />
          <div className='py-6'></div>
          <Comments
            userId={user?.id ?? ''}
            itemId={itemId}
            commentsCount={item?.commentsCount ?? 0}
            itemRefetch={itemRefetch}
          />
        </CardFooter>
      </Card>
    </MinScreen>
  );
};

export default Item;

