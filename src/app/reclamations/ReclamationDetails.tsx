// src/app/reclamations/ReclamationDetails.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { Reclamation } from '@/types/reclamation';
import { AppUser } from '@/types/appUser';
import Image from 'next/image';
import * as Realm from 'realm-web';
import { Trash2 } from 'lucide-react';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

interface ReclamationDetailsProps {
  reclamation: Reclamation;
  appUsers: AppUser[];
  onClose: () => void;
}

export default function ReclamationDetails({ reclamation, appUsers, onClose }: ReclamationDetailsProps) {
  const [syndicComment, setSyndicComment] = useState(reclamation.syndicComment || '');
  const [imageConfirmedUrl, setImageConfirmedUrl] = useState(reclamation.imageConfirmedUrl || '');
  const [status, setStatus] = useState(reclamation.status || '');
  const [isLoading, setIsLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState('');
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  const getUserName = (userId: Realm.BSON.ObjectId) => {
    const user = appUsers.find(u => u._id.toString() === userId.toString());
    return user ? `${user.name} ${user.surname}` : 'Unknown';
  };


  const getImageSource = (problem: string | undefined) => {
    if (!problem) return '/images/default.png';
    
    switch (problem.toLowerCase()) {
      case 'piscine':
        return '/images/piscine.png';
      case 'plomberie':
        return '/images/Plomeberie.png';
      case 'ascenseur':
        return '/images/elevator.png';
      case 'gazon':
        return '/images/gazon.png';
      default:
        return '/images/default.png';
    }
  };
  const handleUpdate = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/update_reclamation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reclamationId: reclamation._id.toString(),
          syndicComment,
          imageConfirmedUrl,
          status
        }),
      });
      if (!response.ok) throw new Error('Failed to update reclamation');
      setActionMessage('Réclamation mise à jour avec succès');
      setTimeout(() => setActionMessage(''), 3000); // Clear message after 3 seconds
    } catch (error) {
      console.error('Error updating reclamation:', error);
      setActionMessage('Erreur lors de la mise à jour de la réclamation');
      setTimeout(() => setActionMessage(''), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteComment = () => {
    setSyndicComment('');
    setActionMessage('Commentaire syndic supprimé');
    setTimeout(() => setActionMessage(''), 3000);
  };

  const handleDeleteImage = () => {
    setImageConfirmedUrl('');
    setActionMessage('Image confirmée supprimée');
    setTimeout(() => setActionMessage(''), 3000);
  };

  const getSatisfactionImage = (level: number | null | undefined) => {
    if (level === null || level === undefined) {
      return <span className="text-gray-500">Aucune réaction envoyée par le résident</span>;
    }
    switch (level) {
      case 0:
        return <Image src="/images/sad.png" alt="Sad" width={24} height={24} />;
      case 50:
        return <Image src="/images/medium.png" alt="Medium" width={24} height={24} />;
      case 100:
        return <Image src="/images/happy.png" alt="Happy" width={24} height={24} />;
      default:
        return null;
    }
  };

  return (
    <>
      {isLoading && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-[60] flex items-center justify-center">
          <LoadingSpinner />
        </div>
      )}
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 overflow-y-auto">
        <div ref={modalRef} className="relative max-w-4xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 bg-white shadow-lg rounded-lg transform transition-all sm:my-8 max-h-[90vh] overflow-y-auto">
          {actionMessage && (
            <div className="mb-4 p-2 bg-green-100 text-green-700 rounded-md">
              {actionMessage}
            </div>
          )}

        <div className="flex justify-between items-center mb-4 sm:mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Détails de la réclamation</h2>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-800 transition duration-150"> 
            <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
  
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-6">
          <div className="flex-1 relative">
            <img
              src={reclamation.imageUrl || getImageSource(reclamation.problem)}
              alt="Reclamation"
              className="w-full h-48 sm:h-64 object-cover rounded-md shadow-sm"
            />
            {!reclamation.imageUrl && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <span className="text-white text-xl sm:text-2xl font-bold">{reclamation.problem || 'Unknown Problem'}</span>
              </div>
            )}
          </div>
          <div className="flex-1 space-y-3 sm:space-y-4">
            <div><strong>Problème:</strong> <span>{reclamation.problem}</span></div>
            <div><strong>Utilisateur:</strong> <span>{getUserName(reclamation.userId!)}</span></div>
            <div><strong>Date:</strong> <span>{reclamation.date?.toLocaleString()}</span></div>
            <div><strong>Syndic:</strong> <span>{reclamation.syndicId ? getUserName(reclamation.syndicId) : 'Non assigné'}</span></div>
            <div><strong>Commentaire:</strong> <span>{reclamation.commentaire}</span></div>
            <div><strong>Commentaire de réaction:</strong> <span>{reclamation.reactionComment}</span></div>
            <div className="flex items-center">
              <strong>Niveau de satisfaction:</strong>
              <span className="ml-2">{getSatisfactionImage(reclamation.satisfactionLevel)}</span>
            </div>
          </div>
        </div>
  
        <div className="mt-8 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Commentaire Syndic:</label>
            <div className="relative">
              <textarea
                value={syndicComment}
                onChange={(e) => setSyndicComment(e.target.value)}
                className="block w-full px-3 py-2 text-gray-700 border rounded-lg shadow-sm focus:outline-none focus:border-blue-500 resize-none"
                rows={3}
                placeholder="Enter your comment here..."
              />
              {syndicComment && (
                <button
                  onClick={handleDeleteComment}
                  className="absolute top-1/2 right-2 transform -translate-y-1/2 hover:text-red-600 transition duration-150"
                >
                  <Trash2 className="w-5 h-5 text-red-600" />
                </button>
              )}
            </div>
          </div>

          {imageConfirmedUrl && (
            <div>
              <h3 className="font-semibold mb-2">Image confirmée:</h3>
              <div className="relative">
                <img
                  src={imageConfirmedUrl}
                  alt="Confirmed image"
                  className="max-w-full h-auto rounded-md shadow-sm"
                />
                <button
                  onClick={handleDeleteImage}
                  className="absolute top-2 right-2 hover:text-red-600 transition duration-150"
                >
                  <Trash2 className="w-5 h-5 text-red-600" />
                </button>
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Statut:</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="block w-full px-3 py-2 text-gray-700 border rounded-lg shadow-sm focus:outline-none focus:border-blue-500"
            >
              <option value="Ouverte">Ouverte</option>
              <option value="Prise en charge">Prise en charge</option>
              <option value="Traité">Traité</option>
            </select>
          </div>

          <div className="flex justify-end space-x-4 mt-6">
            <button
              onClick={handleUpdate}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow-sm hover:bg-blue-700 transition ease-in-out duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              disabled={isLoading}
            >
              Mettre à jour
            </button>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-300 text-gray-800 rounded-lg shadow-sm hover:bg-gray-400 transition ease-in-out duration-150 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
              disabled={isLoading}
            >
              Fermer
            </button>
          </div>
        </div>
        </div>
      </div>
    </>
  );
}