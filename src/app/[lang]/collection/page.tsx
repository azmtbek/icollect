import { unstable_noStore as noStore } from "next/cache";
import { type Locale } from '@/i18n-config';
import { api } from '@/trpc/server';
import { redirect } from 'next/navigation';
import Collections from './view';

// testing
import { Payment, columns } from "./columns";
import { DataTable } from "./data-table";
import MinScreen from "@/components/layout/min-screen";

async function getData(): Promise<Payment[]> {
  // Fetch data from your API here.
  return [
    {
      id: "728ed52f",
      amount: 100,
      status: "failed",
      text: "",
      // text: "pending loreOn the other hand, we denounce with righteous indignation and dislike men who are so beguiled and demoralized by the charms of pleasure of the moment, so blinded by desire, that they cannot foresee the pain and trouble that are bound to ensue; and equal blame belongs to those who fail in their duty through weakness of will, which is the same as saying through shrinking from toil and pain.These cases are perfectly simple and easy to distinguish.In a free hour, when our power of choice is untrammelled and when nothing prevents our being able to do what we like best, every pleasure is to be welcomed and every pain avoided.But in certain circumstances and owing to the claims of duty or the obligations of business it will frequently occur that pleasures have to be repudiated and annoyances accepted.The wise man therefore always holds in these matters to this principle of selection: he rejects pleasures to secure other greater pleasures, or else he endures pains to avoid worse pains.",
      email: "mx@example.com",
    },
    {
      id: "728ed52f",
      amount: 10,
      status: "pending",
      text: '',
      email: "ma@example.com",
    },
    {
      id: "728ed523",
      amount: 1,
      status: "pending",
      text: '',
      email: "mb@example.com",
    },
    {
      id: "728ed524",
      amount: 2100,
      status: "pending",
      text: '',
      email: "mt@example.com",
    },
    // ...
  ];
}

const Page = async ({
  params
}: {
  params: { lang: Locale; };
}) => {
  noStore();
  const currUser = await api.user.getCurrent.query();
  const data = await getData();
  if (!currUser) redirect(`/${params.lang}/login`);

  return <>
    <MinScreen>
      <DataTable columns={columns} data={data} />
      <Collections />
    </MinScreen>
  </>;
};

export default Page;