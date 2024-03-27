import { unstable_noStore as noStore } from "next/cache";
import MinScreen from "@/components/layout/min-screen";
import CustomTagsCloud from "./tag-cloud";
import LatestItems from "./latest-items";
import Collections from "./collections";

export default async function Home() {
  noStore();

  return (
    <MinScreen>
      <div className="flex flex-col-reverse md:grid md:grid-rows-3 md:grid-cols-6 md:grid-flow-col gap-4">
        <LatestItems className="flex flex-col min-w-96  w-full md:row-span-3  md:col-span-4" />
        <Collections className="md:row-span-1 md:col-span-2" />
        <CustomTagsCloud className="flex flex-wrap md:row-span-2 md:col-span-2" />

      </div>
    </MinScreen>
  );
}


