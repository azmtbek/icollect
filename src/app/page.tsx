import { unstable_noStore as noStore } from "next/cache";
import Link from "next/link";

import { CreatePost } from "@/app/_components/create-post";
import { getServerAuthSession } from "@/server/auth";
import { api } from "@/trpc/server";

export default async function Home() {
  noStore();
  const hello = await api.post.hello.query({ text: "from tRPC" });

  const session = await getServerAuthSession();
  return (
    <main className="flex min-h-[100vh-4rem] flex-col items-center justify-center">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 bg-black/30">
        container
      </div>
      <div className="flex flex-col items-center gap-2">
        <div className="flex flex-col items-center justify-center gap-4">
          <p className="text-center text-2xl text-white">
            {session && <span>Logged in as {session.user?.name}</span>}
          </p>
          <Link href={'/login'} className="px-4 py-2 rounded-full bg-slate-500">Login</Link>
        </div>
      </div>

      <CrudShowcase />
    </main >
  );
}

async function CrudShowcase() {
  const session = await getServerAuthSession();
  if (!session?.user) return null;

  const latestPost = await api.post.getLatest.query();

  return (
    <div className="w-full max-w-xs">
      {latestPost ? (
        <p className="truncate">Your most recent post: {latestPost.name}</p>
      ) : (
        <p>You have no posts yet.</p>
      )}

      <CreatePost />
    </div>
  );
}
