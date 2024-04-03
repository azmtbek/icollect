'use server';
import { Button } from "@/components/ui/button";
import { signIn, signOut } from "@/server/auth";
import { api } from "@/trpc/server";


export const Singing = async () => {
  const currentUser = await api.user.getCurrent.query();

  return currentUser ? <SignOut /> : <SignIn />;
};



export async function SignOut() {
  const signout = async () => {
    'use server';
    await signOut();
  };
  return (
    <form
      action={signout}
    >
      <Button type="submit" variant="outline">
        Sign out
      </Button>
    </form>
  );
}

export async function SignIn() {
  const signin = async () => {
    'use server';
    await signIn();
  };
  return (
    <form
      action={signin}
    >
      <Button type="submit" variant="outline">
        Sign In
      </Button>
    </form>
  );
}