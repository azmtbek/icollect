import { auth } from '@/server/auth';
import Item from './form';
// import { Dashboard, Landing } from './components';

export default async function Layout() {
  const session = await auth();
  return <Item session={session} />;
}