'use client';
import { useLocale } from '@/components/provider/locale-provider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Locale } from '@/i18n-config';
import { cn } from '@/lib/utils';
import { api } from '@/trpc/react';
import { useParams, useRouter } from 'next/navigation';
import { useMemo } from 'react';
import { type ColorOptions, TagCloud, type Tag } from 'react-tagcloud';


const options: ColorOptions = {
  luminosity: 'bright',
  hue: 'blue',
};

declare module "react-tagcloud" {
  interface Tag {
    id: number;
  }
}

const customRenderer = (tag: Tag, size: number, color: string) => {
  return (
    <p key={tag.value} style={{ color, fontSize: `${size}px` }}
      className={' hover:bg-secondary self-center p-1 rounded'}
    >
      {tag.value}
    </p>
  );
};


const CustomTagsCloud = ({ className }: { className?: string; }) => {

  const { lang } = useParams<{ lang: Locale; }>();
  const { data: tags } = api.tag.getAll.useQuery();
  const mappedTags = useMemo(() => {
    return tags?.map(tag => ({ ...tag, value: tag.name })) ?? [];
  }, [tags]);

  const router = useRouter();

  const localeTitles = useLocale((state) => state.titles);
  const onClickTag = (tag: Tag) => {
    router.push(`/${lang}/search?tag=${tag.id}`);
  };

  return <Card className={className}>
    <CardHeader>
      <CardTitle>{localeTitles.tagsCloud}</CardTitle>
    </CardHeader>
    <CardContent>
      <TagCloud
        tags={mappedTags}
        colorOptions={options}
        onClick={onClickTag}
        minSize={14} maxSize={40}
        className='flex flex-wrap gap-2 cursor-pointer'
        renderer={customRenderer}
      />
    </CardContent>
  </Card>;
};

export default CustomTagsCloud;