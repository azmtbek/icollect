import { unstable_noStore as noStore } from "next/cache";
import UpdateCollection from './form';

const Page = async () => {
  noStore();
  return <UpdateCollection />;
};

export default Page;