import { unstable_noStore as noStore } from "next/cache";

import React from 'react';

import Topic from './topic';

const Page = async () => {
  noStore();
  return (
    <Topic />
  );
};

export default Page;