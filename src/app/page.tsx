'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import { useRouter } from 'next/navigation';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import DashboardContent from '@/components/dashboard/DashboardContent';
import ScrollToTop from '@/components/ScrollToTop';

export default function Home() {
  const { user, error, isLoading } = useUser();
  const router = useRouter();
  const [loadingState, setLoadingState] = useState('initial');

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        setLoadingState('redirecting');
        router.push('/api/auth/login');
      } else {
        setLoadingState('loaded');
      }
    }
  }, [user, isLoading, router]);

  if (isLoading || loadingState === 'initial') {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (loadingState === 'redirecting') {
    return <LoadingSpinner />;
  }

  return <DashboardContent />;
}