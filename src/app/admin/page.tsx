import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import MinScreen from '@/components/layout/min-screen';
import { api } from '@/trpc/server';
import { UsersTable } from './users-table';

const Admin = async () => {
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
      <Link href="/admin/topic" >
        <Button>
          Manage Topics
        </Button>
      </Link>
      <Link href="/admin/tag" >
        <Button>
          Manage Tags
        </Button>
      </Link>
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