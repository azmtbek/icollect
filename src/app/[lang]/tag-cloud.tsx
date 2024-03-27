'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { type ColorOptions, TagCloud } from 'react-tagcloud';

const data = [
  { value: 'JavaScript', count: 38 },
  { value: 'React', count: 300 },
  { value: 'Nodejs', count: 28 },
  { value: 'Express.js', count: 25 },
  { value: 'HTML5', count: 133 },
  { value: 'MongoDB', count: 18 },
  { value: 'CSS3', count: 10020 },
];



const options: ColorOptions = {
  luminosity: 'bright',
  hue: 'green',
};


const customRenderer = (tag: any, size: number, color: string) => {
  return (
    <span key={tag.value} style={{ color }} className={`tag-${size} w-full px-2`}>
      {tag.value}
    </span>
  );
};


const CustomTagsCloud = ({ className }: { className?: string; }) => {

  return <Card className={className}>
    <CardHeader>
      <CardTitle>Tags</CardTitle>
    </CardHeader>
    <CardContent>
      <TagCloud
        tags={data}
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