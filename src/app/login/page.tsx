
import { unstable_noStore as noStore } from 'next/cache';
import Login from './form';
import { signIn } from "@/server/auth";
// import { toast } from '@/components/ui/use-toast';

const Page = async () => {
  noStore();
  const login = async ({ email, password }: { email: string, password: string; }) => {
    'use server';
    let error = '';
    // try {
    await signIn('credentials', {
      redirectTo: '/',
      // callbackUrl: '/',
      email: email,
      password: password,
    });
    // } catch (e) {
    //   error = "Couldn't sign in.You are either blocked or don't have an account!";
    // }
    return error;
  };
  return (
    <Login login={login} />
  );
};

export default Page;