//src\app\users\sponsorship\SponsorshipDetails.tsx

import { useState } from 'react';
import { Sponsorship } from '@/types/sponsorship';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import CreateUserFromSponsorship from './CreateUserSponsorship';

interface SponsorshipDetailsProps {
  sponsorship: Sponsorship & {
    sponsor?: {
      name?: string;
      surname?: string;
    };
  };
  onClose: () => void;
}

export default function SponsorshipDetails({ sponsorship, onClose }: SponsorshipDetailsProps) {
  const [showCreateUser, setShowCreateUser] = useState(false);

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 overflow-y-auto h-full w-full z-50 flex items-start justify-center pt-80">
      {!showCreateUser ? (
        <div className="relative mx-auto p-10 border w-full max-w-3xl shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-3xl font-bold text-gray-800">Détails du parrainage</h2>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-800">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nom</label>
            <p className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50">{sponsorship.name}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Prénom</label>
            <p className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50">{sponsorship.surname}</p>
          </div>
        </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <p className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50">{sponsorship.email}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Numéro de téléphone</label>
            <p className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50">{sponsorship.phoneNumber}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Résident Parrain</label>
            <p className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50">
              {sponsorship.sponsor ? `${sponsorship.sponsor.name || ''} ${sponsorship.sponsor.surname || ''}`.trim() : 'Non spécifié'}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Commentaire du Résident</label>
            <p className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50">{sponsorship.comment || 'Aucun commentaire'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Date de création</label>
            <p className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50">{new Date(sponsorship.createdAt).toLocaleString()}</p>
          </div>
      </div>

      <div className="flex justify-end space-x-4 mt-8">
            <button
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition-colors duration-200"
            >
              Fermer
            </button>
            <button
              onClick={() => setShowCreateUser(true)}
              className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-200"
            >
              Créer l'utilisateur
            </button>
          </div>
        </div>
      ) : (
        <CreateUserFromSponsorship
          sponsorship={sponsorship}
          onClose={() => {
            setShowCreateUser(false);
            onClose();
          }}
        />
      )}
    </div>
  );
}