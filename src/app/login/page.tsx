import React from 'react';
import Login from './form';
import { signIn } from "next-auth/react";

const Page = () => {

  return (
    <Login />
  );
};

export default Page;