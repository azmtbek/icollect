'use client';
import { type Dictionoary } from '@/get-dictionary';
import defaultDictionary from "dictionaries/en.json";

import { createContext, useContext } from 'react';

type DictType = Awaited<ReturnType<Dictionoary>>;

const LocaleContext = createContext<DictType>(defaultDictionary);

export function LocaleProvider({ children, dictionary }: { children: React.ReactNode; dictionary: DictType; }) {
  return (
    <LocaleContext.Provider value={dictionary}>
      {children}
    </LocaleContext.Provider>
  );
}

// export type UseLocale =
//   <TState, Selected = unknown>(
//     selector: (state: TState) => Selected,
//   ) => Selected;


export function useLocale<Selected>(selector: (state: DictType) => Selected): Selected {
  const context = useContext(LocaleContext);
  return selector(context);
}