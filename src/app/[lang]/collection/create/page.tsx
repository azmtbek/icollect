import { unstable_noStore as noStore } from "next/cache";
import CreateCollection from './create';

const Page = async () => {
  noStore();
  return <CreateCollection />;
};

export default Page;