'use client';
import React from 'react';
import { useMedia } from '../provider/media-provider';

const MinScreen = (
  { children }: { children: React.ReactNode; }
) => {
  const { media } = useMedia();
  return (

    <div className="flex min-h-scrn max-h-scrn flex-col items-center justify-start overflow-x-scroll">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 rounded-xl ">
        {media === 'desktop' ?
          children
          : null
        }
      </div>
    </div>

  );
};

export default MinScreen;