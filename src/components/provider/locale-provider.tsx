'use client';
import { type Dictionoary } from '@/get-dictionary';
// import { defaultDictinary } from 'dictionaries/default';
import dict from "dictionaries/en.json";

import { createContext, useContext } from 'react';

type DictType = Awaited<ReturnType<Dictionoary>>;

const LocaleContext = createContext<DictType>(dict);

export function LocaleProvider({ children, dictionary }: { children: React.ReactNode; dictionary: DictType; }) {
  return (
    <LocaleContext.Provider value={dictionary}>
      {children}
    </LocaleContext.Provider>
  );
}

// TODO: check if it is working
export type UseLocale =
  <TState extends unknown, Selected = unknown>(
    selector: (state: TState) => Selected,
  ) => Selected;


export function useLocale<Selected>(selector: (state: DictType) => Selected): Selected {
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