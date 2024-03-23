import { unstable_noStore as noStore } from "next/cache";
import Link from "next/link";

import { auth } from "@/server/auth";
import { api } from "@/trpc/server";
import MinScreen from "@/components/layout/min-screen";
import { Locale } from "i18n-config";

export default async function Home({
  params: { lang },
}: {
  params: { lang: Locale; };
}) {
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