 // src/app/users/UserDetails.tsx
import { useState } from 'react';
import { AppUser } from '@/types/appUser';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

interface UserDetailsProps {
  user: AppUser;
  onClose: () => void;
}

export default function UserDetails({ user, onClose }: UserDetailsProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [updatedUser, setUpdatedUser] = useState(user);
  const [message, setMessage] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setUpdatedUser(prev => ({ ...prev, [name]: value }));
  };
  
  const handleUpdate = async () => {
    setIsUpdating(true);
    setMessage(null);
    try {
      const response = await fetch('/api/update_user', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedUser),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update user');
      }

      setMessage('Mise à jour de l\'utilisateur réussie');
      setTimeout(() => onClose(), 2000);
    } catch (error) {
      console.error('Error updating user:', error);
      setMessage((error as Error).message || 'An error occurred while updating the user');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
  <div className="fixed inset-0 bg-gray-600 bg-opacity-75 overflow-y-auto h-full w-full z-50 flex items-start justify-center pt-80">
    <div className="relative mx-auto p-10 border w-full max-w-3xl shadow-lg rounded-md bg-white">
        {isUpdating && (
      <div className="flex flex-col max-w-[960px] flex-1">
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
            <LoadingSpinner />
          </div>
          </div>
        )}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-3xl font-bold text-gray-800">Détails de l'utilisateur</h2>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-800">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        
        {message && (
          <div className={`mb-4 p-4 rounded-md ${message.includes('réussie') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {message}
          </div>
        )}

        <form className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nom</label>
              <input
                type="text"
                id="name"
                name="name"
                value={updatedUser.name || ''}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              />
            </div>
            <div>
              <label htmlFor="surname" className="block text-sm font-medium text-gray-700">Prénom</label>
              <input
                type="text"
                id="surname"
                name="surname"
                value={updatedUser.surname || ''}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              />
            </div>
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={updatedUser.email}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            />
          </div>
          <div>
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">Numéro de téléphone</label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={updatedUser.phoneNumber || ''}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            />
          </div>
          <div>
            <label htmlFor="userType" className="block text-sm font-medium text-gray-700">Type d'utilisateur</label>
            <select
              id="userType"
              name="userType"
              value={updatedUser.userType}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            >
          <option value="user">Réseident</option>
          <option value="syndic">Syndic</option>
        </select>
          </div>
        </form>

        <div className="flex justify-end space-x-4 mt-8">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition-colors duration-200"
          >
            Annuler
          </button>
          <button
            onClick={handleUpdate}
            className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-200"
          >
            Mettre à jour
          </button>
        </div>
      </div>
    </div>
  );
}