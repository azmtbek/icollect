import { unstable_noStore as noStore } from "next/cache";
import { type Locale } from '@/i18n-config';
import { api } from '@/trpc/server';
import { redirect } from 'next/navigation';
import Collections from './view';

const Page = async ({
  params
}: {
  params: { lang: Locale; };
}) => {
  noStore();
  const currUser = await api.user.getCurrent.query();
  if (!currUser) redirect(`/${params.lang}/login`);

  return <Collections />;
};

export default Page;