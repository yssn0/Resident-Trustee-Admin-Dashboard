// src/app/dashboard/page.tsx

import { getSession } from '@auth0/nextjs-auth0';
import { redirect } from 'next/navigation';
import DashboardContent from '../../components/dashboard/DashboardContent';

export default async function DashboardPage() {
  const session = await getSession();

  if (!session) {
    redirect('/api/auth/login');
  }

  return <DashboardContent />;
}