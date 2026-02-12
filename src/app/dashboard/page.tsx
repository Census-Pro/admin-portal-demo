import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { getFirstAccessibleRoute } from '@/lib/permission-check';

export default async function Dashboard() {
  const session = await auth();

  // Redirect to first accessible route based on user permissions
  const firstRoute = getFirstAccessibleRoute(session);
  redirect(firstRoute);
}
