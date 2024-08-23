// src/components/dashboard/Header.tsx
'use client'; 

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function DashboardHeader() {
  const pathname = usePathname();

  const tabs = [
    { name: 'Toutes les Réclamations', href: '/reclamations' },
    { name: 'Réclamations Non Assignées', href: '/reclamations/unassigned' },
    { name: 'Statistiques des Réclamations', href: '/statistics/reclamationsStatistics' },
  ];

  return (
    <header className="bg-white shadow-md py-4 px-6 sticky top-0 z-10">
      <div className="flex items-center justify-between mb-4">
        {/*<h1 className="text-xl font-semibold text-gray-800">Admin Dashboard</h1>*/}
        {/* Add user profile or logout button here */}
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
