'use client';

import { Dispatch, SetStateAction, createContext, useContext, useState } from 'react';

export type MediaEnum = 'desktop' | 'mobile';

type Media = { media: MediaEnum, setMedia?: Dispatch<SetStateAction<MediaEnum>>; };

const MediaContext = createContext<Media>({ media: 'desktop' });

export function MediaProvider({ children }: { children: React.ReactNode; }) {
  const [media, setMedia] = useState<MediaEnum>('desktop');
  return (
    <MediaContext.Provider value={{ media, setMedia }}>
      {children}
    </MediaContext.Provider>
  );
}


export function useMedia() {
  const context = useContext(MediaContext);
  return { ...context };
}