import { unstable_noStore as noStore } from "next/cache";
import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import MinScreen from '@/components/layout/min-screen';
// import { api } from '@/trpc/server';
// import { UsersTable } from './users-table';
import { type Locale } from '@/i18n-config';
import Users from "./view";
import { api } from "@/trpc/server";
import { redirect } from "next/navigation";

type Props = {
  params: { lang: Locale; };
};

const Admin = async ({ params: { lang } }: Props) => {
  noStore();
  const user = await api.user.getCurrent.query();
  if (!user) redirect(`/${lang}`);
  return (
    <MinScreen>
      <div className='flex gap-2 w-full'>
        <Link href={`/${lang}/admin/topic`} >
          <Button>
            Manage Topics
          </Button>
        </Link>
        <Link href={`/${lang}/admin/tag`} >
          <Button>
            Manage Tags
          </Button>
        </Link>
      </div>
      {/* <UsersTable /> */}
      <Users />
    </MinScreen>
  );
};

export default Admin;