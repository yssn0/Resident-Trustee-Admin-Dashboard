// src/components/dashboard/UserHeader.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function UsersDashboardHeader() {
  const pathname = usePathname();

  const tabs = [
    { name: 'Toutes les Utilisateurs', href: '/users' },
    { name: 'Créer un Utilisateur', href: '/users/create' },
    { name: 'Parrainage', href: '/users/sponsorship' },
    { name: 'Statistiques des Utilisateurs', href: '/statistics/usersStatistics' },

  ];

  return (
    <header className="bg-white shadow-md py-4 px-6 sticky top-0 z-10">
      <div className="flex items-center justify-between mb-4">
      </div>
      <nav className="flex space-x-4">
        {tabs.map((tab) => (
          <Link
            key={tab.href}
            href={tab.href}
            className={`px-3 py-2 rounded-md text-sm font-medium ${
              pathname === tab.href
                ? 'bg-gray-900 text-white'
                : 'text-gray-700 hover:bg-gray-200 hover:text-gray-900'
            }`}
          >
            {tab.name}
          </Link>
        ))}
      </nav>
    </header>
  );
}