'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import { useRouter } from 'next/navigation';
import LoadingSpinner from '@/components/ui/LoadingSpinner'; 

export default function Home() {
  const { user, error, isLoading } = useUser();
  const router = useRouter();
  const [loadingState, setLoadingState] = useState('initial');

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (!isLoading) {
      if (user) {
        setLoadingState('redirecting');
        timeoutId = setTimeout(() => router.push('/dashboard'), 100);
      } else {
        setLoadingState('redirecting');
        timeoutId = setTimeout(() => router.push('/api/auth/login'), 100);
      }
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [user, isLoading, router]);

  if (isLoading || loadingState === 'initial') {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  //return <div>Redirecting...</div>;
  return <LoadingSpinner />;
}