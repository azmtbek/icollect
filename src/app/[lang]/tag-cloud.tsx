'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { api } from '@/trpc/react';
import { useMemo } from 'react';
import { type ColorOptions, TagCloud } from 'react-tagcloud';



const options: ColorOptions = {
  luminosity: 'bright',
  hue: 'blue',
};


const customRenderer = (tag: any, size: number, color: string) => {
  return (
    <span key={tag.value} style={{ color }} className={`tag-${size} w-full px-2`}>
      {tag.value}
    </span>
  );
};


const CustomTagsCloud = ({ className }: { className?: string; }) => {
  const { data: tags } = api.tag.getAll.useQuery();
  const mappedTags = useMemo(() => {
    return tags?.map(tag => ({ ...tag, value: tag.name })) ?? [];
  }, [tags]);

  return <Card className={className}>
    <CardHeader>
      <CardTitle>Tags</CardTitle>

    </CardHeader>
    <CardContent>
      <TagCloud
        tags={mappedTags}
        colorOptions={options}
        onClick={(tag) => console.log('clicking on tag:', tag)}
        minSize={20} maxSize={50}
        // renderer={customRenderer}
        className='flex flex-wrap gap-2'
      />
    </CardContent>
  </Card>;
};

export default CustomTagsCloud;