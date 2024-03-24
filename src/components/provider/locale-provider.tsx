'use client';
import { Dictionoary } from '@/get-dictionary';

import { createContext, useContext, useState } from 'react';

const LocaleContext = createContext<Partial<Awaited<ReturnType<Dictionoary>>>>({});

export function LocaleProvider({ children, dictionary }: { children: React.ReactNode; dictionary: Partial<Awaited<ReturnType<Dictionoary>>>; }) {
  return (
    <LocaleContext.Provider value={dictionary}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  return useContext(LocaleContext);
}


// export function LocaleProvider({ children }:{}) {
//   return (
//     <Locale>
//       {children}
//     </Locale>
//   );
// }