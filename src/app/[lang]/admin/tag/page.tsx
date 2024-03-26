import { unstable_noStore as noStore } from "next/cache";
import React from 'react';
import Tag from "./tag";

const Page = async () => {
  noStore();
  return (
    <Tag />
  );
};

export default Page;