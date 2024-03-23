import { unstable_noStore as noStore } from "next/cache";
import Link from "next/link";

import { auth } from "@/server/auth";
import { api } from "@/trpc/server";
import MinScreen from "@/components/layout/min-screen";

export default async function Home() {
  noStore();
  const session = await auth();
  return (
    <MinScreen>
      <Collections />
      <TagsCloud />
    </MinScreen>
  );
}


const Collections = () => {
  return <div>Collections</div>;
};

const TagsCloud = () => {
  return <div>TagsCloud</div>;
};