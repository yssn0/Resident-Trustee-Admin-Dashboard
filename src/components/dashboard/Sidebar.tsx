// src/components/dashboard/Sidebar.tsx
import Link from 'next/link';

export default function Sidebar() {
  return (
    <div className="bg-gray-800 text-white w-64 flex-shrink-0 overflow-y-auto">
      <nav className="py-7 px-2">
        <Link href="/dashboard" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700">
        Accueil
        </Link>
        <Link href="/reclamations" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700">
        Réclamations
        </Link>
        <Link href="/users" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700">
        Utilisateurs
        </Link>
        <Link href="/notifications" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700">
        Notifications
        </Link>
        <Link href="/statistics" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700">
        Statistiques
        </Link>
      
        {/* Add more navigation links */}
      </nav>
    </div>
  );
}