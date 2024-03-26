
import { unstable_noStore as noStore } from 'next/cache';
import React from 'react';
import Register from './register';

const Page = async () => {
  noStore();
  return (
    <Register />
  );
};

export default Page;