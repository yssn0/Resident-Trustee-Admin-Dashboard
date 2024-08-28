import React, { useState } from 'react';
import { AccessRequest } from '@/types/accessRequest';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import CreateUserFromAccessRequest from './CreateUserFromAccessRequest';

interface AccessRequestDetailsProps {
  accessRequest: AccessRequest;
  onClose: () => void;
}

export default function AccessRequestDetails({ accessRequest, onClose }: AccessRequestDetailsProps) {
  const [showCreateUser, setShowCreateUser] = useState(false);
  const [isRefusing, setIsRefusing] = useState(false);

  const handleRefuseRequest = async () => {
    setIsRefusing(true);
    try {
      const response = await fetch('/api/update_access_request', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ requestId: accessRequest._id, status: 'rejected' }),
      });

      if (!response.ok) {
        throw new Error('Échec du refus de la demande d\'accès');
      }

      onClose(); // Close the details view and refresh the list
    } catch (error) {
      console.error('Error refusing access request:', error);
      // Handle error (e.g., show error message to user)
    } finally {
      setIsRefusing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 overflow-y-auto h-full w-full z-50 flex items-start justify-center pt-80">
      {!showCreateUser ? (
        <div className="relative mx-auto p-10 border w-full max-w-3xl shadow-lg rounded-md bg-white">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-3xl font-bold text-gray-800">Détails de la Demande d'Inscription</h2>
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
                <p className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50">{accessRequest.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Prénom</label>
                <p className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50">{accessRequest.surname}</p>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <p className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50">{accessRequest.email}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Numéro de téléphone</label>
              <p className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50">{accessRequest.phoneNumber}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Motif de l'inscription</label>
              <p className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50">{accessRequest.reason}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Statut</label>
              <p className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50">{accessRequest.status}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Date de création</label>
              <p className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50">{new Date(accessRequest.createdAt).toLocaleString()}</p>
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
              onClick={handleRefuseRequest}
              disabled={isRefusing}
              className="px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition-colors duration-200"
            >
              {isRefusing ? 'Refusing...' : 'Refuser la demande'}
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
        <CreateUserFromAccessRequest
        accessRequest={accessRequest}
          onClose={() => {
            setShowCreateUser(false);
            onClose();
        }}
      />
    )}
  </div>
);
}