
import { type Locale } from '@/i18n-config';
import { api } from '@/trpc/server';
import { redirect } from 'next/navigation';
import React from 'react';

const Layout = async ({
  children,
  params
}: {
  children: React.ReactNode;
  params: { lang: Locale; };
}) => {

  const currUser = await api.user.getCurrent.query();
  if (!currUser) redirect(`/${params.lang}/login`);
  return (
    <div>{children}</div>
  );
};

export default Layout;