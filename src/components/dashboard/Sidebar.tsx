// src/components/dashboard/Sidebar.tsx
'use client'
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiHome, FiAlertCircle, FiUsers, FiBell, FiPieChart } from 'react-icons/fi';

export default function Sidebar() {
  const pathname = usePathname();

  const links = [
    { href: '/dashboard', label: 'Accueil', icon: FiHome },
    { href: '/reclamations', label: 'Réclamations', icon: FiAlertCircle },
    { href: '/users', label: 'Utilisateurs', icon: FiUsers },
    { href: '/notifications', label: 'Notifications', icon: FiBell },
    { href: '/statistics', label: 'Statistiques', icon: FiPieChart },
  ];

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === href;
    }
    return pathname && pathname.startsWith(href);
  };

  return (
    <div className="bg-gray-800 text-white w-64 flex-shrink-0 overflow-y-auto">
      <nav className="py-7 px-2 flex flex-col gap-3">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`flex items-center py-2.5 px-4 rounded transition duration-200 ${
              isActive(link.href)
                ? 'bg-gray-700 font-semibold'
                : 'hover:bg-gray-700'
            }`}
          >
            <link.icon className="mr-3" size={20} />
            {link.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}