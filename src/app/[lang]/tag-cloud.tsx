'use client';
import { useLocale } from '@/components/provider/locale-provider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { api } from '@/trpc/react';
import { useMemo } from 'react';
import { type ColorOptions, TagCloud } from 'react-tagcloud';



const options: ColorOptions = {
  luminosity: 'bright',
  hue: 'blue',
};


const CustomTagsCloud = ({ className }: { className?: string; }) => {
  const { data: tags } = api.tag.getAll.useQuery();
  const mappedTags = useMemo(() => {
    return tags?.map(tag => ({ ...tag, value: tag.name })) ?? [];
  }, [tags]);


  const localeTitles = useLocale((state) => state.titles);

  return <Card className={className}>
    <CardHeader>
      <CardTitle>{localeTitles.tagsCloud}</CardTitle>

    </CardHeader>
    <CardContent>
      <TagCloud
        tags={mappedTags}
        colorOptions={options}
        onClick={(tag) => console.log('clicking on tag:', tag)}
        minSize={12} maxSize={40}
        className='flex flex-wrap gap-2'
      />
    </CardContent>
  </Card>;
};

export default CustomTagsCloud;