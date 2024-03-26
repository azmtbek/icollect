import { unstable_noStore as noStore } from "next/cache";
import MinScreen from "@/components/layout/min-screen";

export default async function Home() {
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