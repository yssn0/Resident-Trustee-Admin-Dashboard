// src/components/ClientHeader.tsx

'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useUser } from '@auth0/nextjs-auth0/client';
import { useState, useRef, useEffect } from 'react';

export default function ClientHeader() {
  const { user } = useUser();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#EEEEEE] px-10 py-3">
      <div className="flex items-center gap-4 text-black">
        <div className="w-8 h-8 relative">
          <Image 
            src="/favicon.ico" 
            alt="Logo" 
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            style={{ objectFit: 'contain' }}
          />
        </div>
        <h2 className="text-black text-lg font-bold leading-tight tracking-[-0.015em]">Verve Admin</h2>
      </div>
      <div className="flex flex-1 justify-end gap-8">
        <nav className="flex items-center gap-9">
          <Link href="/" className="text-black text-sm font-medium leading-normal">Accueil</Link>
          {/*
          <Link href="/reclamations" className="text-black text-sm font-medium leading-normal">Réclamations</Link>
          <Link href="/users" className="text-black text-sm font-medium leading-normal">Utilisateurs</Link>
          <Link href="/notifications" className="text-black text-sm font-medium leading-normal">Notifications</Link>
          */}
        </nav>
        {user && (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
              style={{ backgroundImage: `url(${user.picture})` }}
            />
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                <a href="/api/auth/logout" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Déconnexion
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}