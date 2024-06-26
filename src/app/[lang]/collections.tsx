'use client';

import { useLocale } from "@/components/provider/locale-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type Locale } from "@/i18n-config";
import { api } from "@/trpc/react";
import Link from "next/link";
import { useParams } from "next/navigation";

const Collections = ({ className }: { className: string; }) => {
  const { data: collections, isLoading } = api.collection.getBiggestFive.useQuery();
  const { lang } = useParams<{ lang: Locale; }>();
  const localeTitles = useLocale((state) => state.titles);

  return < Card className={className} >
    <CardHeader>
      <CardTitle>{localeTitles.biggestCollections}</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="flex flex-wrap">
        {isLoading
          ? <div>Loading ...</div> :
          collections?.map((col) => <div key={col.id} >
            <Link href={`/${lang}/collection/${col.id}`}>
              <Button variant={'link'}>
                {col.name}
              </Button>
            </Link>
          </div>)
        }
      </div>
    </CardContent>
  </Card >;
};

export default Collections;