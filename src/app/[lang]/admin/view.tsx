'use client';
import { useLocale } from '@/components/provider/locale-provider';
import { api } from '@/trpc/react';
import React, { useMemo } from 'react';
import { DataTable } from './data-table';
import { useColumns } from './columns';

const Users = () => {
  const localeTitles = useLocale((state) => state.titles);
  const { data: users, isLoading } = api.user.getAll.useQuery();
  const columns = useColumns();
  const filteredUsers = useMemo(() => {
    return users ?? [];
  }, [users]);

  return (
    <>
      <div className='flex items-center justify-between w-full'>
        <div className='text-2xl'>{localeTitles.admin}</div>
      </div>
      <DataTable data={filteredUsers} columns={columns} isLoading={isLoading} />
    </>
  );
};

export default Users;