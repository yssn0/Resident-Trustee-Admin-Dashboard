// src/app/reclamations/ReclamationList.tsx
'use client';

import { useState } from 'react';
import { useReclamations } from '@/hooks/useReclamations';
import ReclamationCard from './ReclamationCard';
import ReclamationDetails from './ReclamationDetails';
import AssignSyndicModal from './AssignSyndicModal';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { Reclamation } from '@/types/reclamation';
import * as Realm from 'realm-web';

export default function ReclamationList() {
  const { reclamations, appUsers, loading, error, refetchReclamations } = useReclamations();
  const [selectedReclamation, setSelectedReclamation] = useState<Reclamation | null>(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [sortBy, setSortBy] = useState<keyof Reclamation>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [assignmentSuccess, setAssignmentSuccess] = useState(false);

  console.log('ReclamationList rendering. Reclamations:', reclamations);

  if (loading) return <LoadingSpinner />;
  if (error) return <div>Error: {error}</div>;
  if (!reclamations || reclamations.length === 0) return <div>Aucune réclamation trouvée.</div>;

  const sortedReclamations = [...reclamations].sort((a, b) => {
    if (a[sortBy] && b[sortBy]) {
      if (a[sortBy] < b[sortBy]) return sortOrder === 'asc' ? -1 : 1;
      if (a[sortBy] > b[sortBy]) return sortOrder === 'asc' ? 1 : -1;
    }
    return 0;
  });

  const handleSort = (key: keyof Reclamation) => {
    if (key === sortBy) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(key);
      setSortOrder('asc');
    }
  };

  const handleAssignmentComplete = async (success: boolean) => {
    if (success) {
      await refetchReclamations();
      setAssignmentSuccess(true);
      setTimeout(() => setAssignmentSuccess(false), 3000);
    }
    setShowAssignModal(false);
    setSelectedReclamation(null);

    // Scroll to top after the deletion process is complete
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const getButtonStyle = (key: keyof Reclamation) => {
    const baseStyle = "px-3 py-1 rounded-md text-sm";
    if (sortBy === key) {
      return `${baseStyle} bg-blue-500 text-white hover:bg-blue-600`;
    }
    return `${baseStyle} bg-gray-200 hover:bg-gray-300`;
  };

  return ( 
    <div className="bg-white shadow-md rounded-lg p-6">
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-800">Liste des Réclamations</h2>
        <div className="flex space-x-2">
          <button 
            onClick={() => handleSort('userId')} 
            className={getButtonStyle('userId')}
          >
            Trier par Utilisateur {sortBy === 'userId' && (sortOrder === 'asc' ? '↑' : '↓')}
          </button>
          <button 
            onClick={() => handleSort('date')} 
            className={getButtonStyle('date')}
          >
            Trier par Date {sortBy === 'date' && (sortOrder === 'asc' ? '↑' : '↓')}
          </button>
          <button 
            onClick={() => handleSort('status')} 
            className={getButtonStyle('status')}
          >
            Trier par Statut {sortBy === 'status' && (sortOrder === 'asc' ? '↑' : '↓')}
          </button>
        </div>
      </div>
      
      {assignmentSuccess && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Succès!</strong>
          <span className="block sm:inline"> La réclamation a été assignée avec succès.</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedReclamations.map((reclamation) => (
          <ReclamationCard
            key={reclamation._id.toString()}
            reclamation={reclamation}
            onAssign={() => {
              setSelectedReclamation(reclamation);
              setShowAssignModal(true);
            }}
            onViewDetails={() => {
              setSelectedReclamation(reclamation);
              setShowDetails(true);
            }}
          />
        ))}
      </div>

      {showAssignModal && selectedReclamation && (
        <AssignSyndicModal
          reclamation={selectedReclamation}
          onClose={handleAssignmentComplete}
        />
      )}

      {showDetails && selectedReclamation && (
        <ReclamationDetails
          reclamation={selectedReclamation}
          appUsers={appUsers}
          onClose={() => {
            setShowDetails(false);
            setSelectedReclamation(null);
            refetchReclamations();
          }}
        />
      )}
    </div>
  );
}