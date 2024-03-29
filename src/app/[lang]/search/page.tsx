import { unstable_noStore as noStore } from "next/cache";
// import { type Locale } from '@/i18n-config';
// import { api } from '@/trpc/server';
// import { redirect } from 'next/navigation';
// import Collections from './view';

import MinScreen from "@/components/layout/min-screen";
import Search from "./search";

const Page = async () => {
  noStore();
  // const currUser = await api.user.getCurrent.query();
  // if (!currUser) redirect(`/${params.lang}/login`);
  // const { data: results } = api.search.getResults.useQuery({ search });

  return <>
    <MinScreen>
      <Search />
    </MinScreen>
  </>;
};

export default Page;