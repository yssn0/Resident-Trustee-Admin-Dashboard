// src/components/dashboard/DashboardContent.tsx

'use client';

import { useUser } from '@auth0/nextjs-auth0/client';
import FeatureCard from './FeatureCard';
import LoadingSpinner from '@/components/ui/LoadingSpinner'; 

export default function DashboardContent() {
  const { user, error, isLoading } = useUser();

  if (isLoading)  return <LoadingSpinner />; 
  if (error) return <div>{error.message}</div>;

  const features = [
    {
      title: 'Réclamations',
      description: 'Gérer et résoudre les plaintes des utilisateurs.',
      image: 'https://cdn.usegalileo.ai/sdxl10/782a8f22-ac24-4d59-8b67-900b50c24ae5.png',
      link: '/reclamations'
    },
    {
      title: 'Utilisateurs',
      description: 'Voir et gérer vos utilisateurs.',
      image: 'https://cdn.usegalileo.ai/sdxl10/46f6c4e1-1ad8-44b7-8b84-6b00c78f7d65.png',
      link: '/users'
    },
    {
      title: 'Notifications',
      description: 'Envoyer et gérer les notifications pour vos utilisateurs.',
      image: 'https://cdn.usegalileo.ai/sdxl10/de9f2f9a-e337-45d0-b076-170793b1c22e.png',
      link: '/notifications'
    },
    {
      title: 'Statistiques',
      description: 'Comprendre comment votre application est utilisée.',
      image: 'https://cdn.usegalileo.ai/sdxl10/51184d70-5965-4c01-9605-035c8fd4c50b.png',
      link: '/statistics'
    }
  ];

  return (
    <div className="px-40 flex flex-1 justify-center py-5">
      <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
        <div className="flex flex-wrap justify-between gap-3 p-4">
          <p className="text-black tracking-light text-[32px] font-bold leading-tight min-w-72">Bienvenue sur le dashboard d'administration</p>
        </div>
        <p className="text-black text-base font-normal leading-normal pb-3 pt-1 px-4">
          Votre site web d'administration Verve est prêt. Voici un aperçu rapide de ce que vous pouvez faire.
        </p>
        {features.map((feature, index) => (
          <FeatureCard key={index} {...feature} />
        ))}
      </div>
    </div>
  );
}