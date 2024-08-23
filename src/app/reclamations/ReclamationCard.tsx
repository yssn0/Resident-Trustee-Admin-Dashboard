// src/app/reclamations/ReclamationCard.tsx
import { Reclamation } from '@/types/reclamation';
import { Tooltip } from '@/components/ui/Tooltip';

interface ReclamationCardProps {
  reclamation: Reclamation;
  onAssign: () => void;
  onViewDetails: () => void;
}

export default function ReclamationCard({ reclamation, onAssign, onViewDetails }: ReclamationCardProps) {
  const isAssignable = reclamation.status !== 'Traité';

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

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="w-[300px] h-[200px] overflow-hidden relative">
        <img
          src={reclamation.imageUrl || getImageSource(reclamation.problem)}
          alt="Reclamation"
          className="w-full h-full object-cover rounded-md"
        />
        {!reclamation.imageUrl && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <span className="text-white text-2xl font-bold">{reclamation.problem || 'Unknown Problem'}</span>
          </div>
        )}
      </div>
    
      <h3 className="text-lg font-semibold mb-2">{reclamation.problem || 'Unknown Problem'}</h3>
      <p className="text-sm text-gray-600 mb-2">Status: {reclamation.status || 'Unknown'}</p>
      <p className="text-sm text-gray-600 mb-4">Date: {reclamation.date?.toLocaleString() || 'Unknown'}</p>
      <div className="flex justify-between">
        <Tooltip content={isAssignable ? "" : "Cette réclamation a déjà été traitée"}>
          <button
            onClick={onAssign}
            className={`px-3 py-1 rounded-md text-sm ${
              isAssignable
                ? 'bg-blue-500 text-white hover:bg-blue-600'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
            disabled={!isAssignable}
          >
            Assigner
          </button>
        </Tooltip>
        <button
          onClick={onViewDetails}
          className="bg-gray-200 text-gray-800 px-3 py-1 rounded-md text-sm hover:bg-gray-300"
        >
          Voir Détails
        </button>
      </div>
    </div>
  );
}
