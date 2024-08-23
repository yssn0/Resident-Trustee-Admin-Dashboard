// src/app/reclamations/AssignSyndicModal.tsx
import { useState, useEffect } from 'react';
import { useUsers } from '@/hooks/useUsers';
import { useReclamations } from '@/hooks/useReclamations';
import { Reclamation } from '@/types/reclamation';
import { AppUser } from '@/types/appUser';
import * as Realm from 'realm-web';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

interface AssignSyndicModalProps {
  reclamation: Reclamation;
  onClose: (success: boolean) => void;
}

export default function AssignSyndicModal({ reclamation, onClose }: AssignSyndicModalProps) {
  const { appUsers, loading: usersLoading, error: usersError } = useUsers();
  const { reclamations, loading: reclamationsLoading, error: reclamationsError } = useReclamations();
  const [syndics, setSyndics] = useState<(AppUser & { assignedCount: number })[]>([]);
  const [selectedSyndicId, setSelectedSyndicId] = useState<string | null>(null);
  const [isAssigning, setIsAssigning] = useState(false);

  useEffect(() => {
    if (appUsers && reclamations) {
      const syndicUsers = appUsers.filter(user => user.userType === 'syndic');
      const assignedCounts = syndicUsers.map(syndic => ({
        ...syndic,
        assignedCount: reclamations.filter(rec => 
          rec.syndicId?.toString() === syndic._id.toString()
        ).length
      }));
      const sortedSyndics = assignedCounts.sort((a, b) => a.assignedCount - b.assignedCount);
      setSyndics(sortedSyndics);
    }
  }, [appUsers, reclamations]);

  const assignSyndic = async () => {
    if (!selectedSyndicId) return;

    setIsAssigning(true);
    try {
      const response = await fetch('/api/assign_syndic', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          reclamationId: reclamation._id.toString(), 
          syndicId: new Realm.BSON.ObjectId(selectedSyndicId)
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to assign syndic');
      }

      onClose(true);
    } catch (error) {
      console.error('Error assigning syndic:', error);
      onClose(false);
    } finally {
      setIsAssigning(false);
    }
  };

  if (usersLoading || reclamationsLoading) {
    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (usersError || reclamationsError) return <div>Error loading data</div>;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
      <div className="relative p-5 border w-96 shadow-lg rounded-md bg-white">
        {isAssigning ? (
          <div className="absolute inset-0 bg-white bg-opacity-80 flex items-center justify-center">
            <LoadingSpinner />
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800">Assigner un Syndic</h2>
              <button onClick={() => onClose(false)} className="text-gray-600 hover:text-gray-800">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>

            <div className="mt-4">
              <select
                value={selectedSyndicId || ''}
                onChange={(e) => setSelectedSyndicId(e.target.value)}
                className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-blue-500"
              >
                <option value="">Sélectionner un syndic</option>
                {syndics.map(syndic => (
                  <option key={syndic._id.toString()} value={syndic._id.toString()}>
                    {syndic.name} {syndic.surname} ({syndic.assignedCount} assignées)
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end space-x-2 mt-6">
              <button
                onClick={assignSyndic}
                disabled={!selectedSyndicId}
                className={`px-4 py-2 rounded-md ${
                  selectedSyndicId
                    ? 'bg-blue-500 text-white hover:bg-blue-600'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Assigner
              </button>
              <button
                onClick={() => onClose(false)}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
              >
                Annuler
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}