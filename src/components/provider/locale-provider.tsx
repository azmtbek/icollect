'use client';
import { Dictionoary } from '@/get-dictionary';
import { defaultDictinary } from 'dictionaries/default';

import { createContext, useContext, useState } from 'react';

type DictType = Awaited<ReturnType<Dictionoary>>;

const LocaleContext = createContext<DictType>(defaultDictinary);

export function LocaleProvider({ children, dictionary }: { children: React.ReactNode; dictionary: DictType; }) {
  return (
    <LocaleContext.Provider value={dictionary}>
      {children}
    </LocaleContext.Provider>
  );
}


export interface UseLocale<StateType = unknown> {
  <TState extends StateType = StateType, Selected = unknown>(
    selector: (state: TState) => Selected,
  ): Selected;
}

export function useLocale<Selected extends unknown>(selector: (state: DictType) => Selected): Selected {
  const context = useContext(LocaleContext);
  return selector(context);
  // return context;
}


// export function LocaleProvider({ children }:{}) {
//   return (
//     <Locale>
//       {children}
//     </Locale>
//   );
// }