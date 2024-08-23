// src/app/reclamations/UnassignedReclamations.tsx
'use client';

import { useReclamations } from '@/hooks/useReclamations';
import ReclamationCard from './ReclamationCard';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { useState } from 'react';
import AssignSyndicModal from './AssignSyndicModal';
import ReclamationDetails from './ReclamationDetails';
import { Reclamation } from '@/types/reclamation';

export default function UnassignedReclamations() {
  const { reclamations, appUsers, loading, error, refetchReclamations } = useReclamations();
  const [selectedReclamation, setSelectedReclamation] = useState<Reclamation | null>(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [isAssigning, setIsAssigning] = useState(false);
  const [assignmentSuccess, setAssignmentSuccess] = useState(false);

  if (loading) return <LoadingSpinner />;
  if (error) return <div>Error: {error}</div>;

  const unassignedReclamations = reclamations.filter(
    (r) => r.status === 'Ouverte' && !r.syndicId
  );

  if (unassignedReclamations.length === 0) {
    return <div>Aucune réclamation non assignée pour le moment.</div>;
  }

  const handleAssignmentComplete = async (success: boolean) => {
    if (success) {
      setIsAssigning(true);
      await refetchReclamations();
      setIsAssigning(false);
      setAssignmentSuccess(true);
      setTimeout(() => setAssignmentSuccess(false), 3000);
    }
    setShowAssignModal(false);
    setSelectedReclamation(null);
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 relative">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Réclamations Non Assignées</h2>
      {assignmentSuccess && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Succès!</strong>
          <span className="block sm:inline"> La réclamation a été assignée avec succès.</span>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {unassignedReclamations.map((reclamation) => (
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

      {isAssigning && (
        <div className="absolute inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
          <LoadingSpinner />
        </div>
      )}
    </div>
  );
}