import { unstable_noStore as noStore } from "next/cache";

import { auth } from "@/server/auth";
import { api } from "@/trpc/server";
import MinScreen from "@/components/layout/min-screen";
import { Locale } from "@/i18n-config";

export default async function Home({
  params: { lang },
}: {
  params: { lang: Locale; };
}) {
  noStore();

  return (
    <MinScreen>
      <Collections />
      <LatestItems />
      <TagsCloud />
    </MinScreen>
  );
}


const Collections = () => {
  return <div>Collections</div>;
};
const LatestItems = () => {
  return <div>Latest</div>;
};


const TagsCloud = () => {
  return <div>TagsCloud</div>;
};