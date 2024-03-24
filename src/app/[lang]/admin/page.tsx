import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import MinScreen from '@/components/layout/min-screen';
import { api } from '@/trpc/server';
import { UsersTable } from './users-table';
import { Locale } from '@/i18n-config';

type Props = {
  params: { lang: Locale; };
};

const Admin = async ({ params: { lang } }: Props) => {
  const users = await api.user.getAll.query();
  const blockUsers = async () => {
    'use server';
  };
  const deleteUsers = async () => {
    'use server';
  };
  const unblockUsers = async () => {
    'use server';
  };

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
      <UsersTable
        users={users}
        blockUsers={blockUsers}
        deleteUsers={deleteUsers}
        unblockUsers={unblockUsers}
      />
    </MinScreen>
  );
};

export default Admin;