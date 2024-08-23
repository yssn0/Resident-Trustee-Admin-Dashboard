// src/app/users/UserList.tsx
'use client';

import { useState, useEffect } from 'react';
import { useUsers } from '@/hooks/useUsers';
import UserDetails from './UserDetails';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { AppUser } from '@/types/appUser';
import { Trash2 } from 'lucide-react';
import { Eye } from 'lucide-react';

export default function UserList() {
  const { appUsers, loading, error, refetch } = useUsers();
  const [selectedUser, setSelectedUser] = useState<AppUser | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterUserType, setFilterUserType] = useState('');
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [userToDelete, setUserToDelete] = useState<AppUser | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (deleteSuccess) {
      timeoutId = setTimeout(() => {
        setDeleteSuccess(false);
      }, 3000);
    }
    return () => clearTimeout(timeoutId);
  }, [deleteSuccess]);

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500">Erreur: {error}</div>;
  if (!appUsers || appUsers.length === 0) return <div className="text-gray-500">Aucun utilisateur trouvé.</div>;

  const filteredUsers = appUsers.filter(user => {
    const fullName = `${user.name?.toLowerCase() ?? ''} ${user.surname?.toLowerCase() ?? ''}`.trim();
    const searchTermLower = searchTerm.toLowerCase();
    return (fullName.includes(searchTermLower) || user.email.toLowerCase().includes(searchTermLower)) &&
      (filterUserType === '' || user.userType.toLowerCase() === filterUserType.toLowerCase());
  });

  const handleDeleteClick = (user: AppUser) => {
    setUserToDelete(user);
    setShowDeleteConfirmation(true);
  };

  const handleDeleteConfirm = async () => {
    if (!userToDelete) return;

    setIsDeleting(true);
    try {
      const response = await fetch('/api/delete_user', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ _id: userToDelete._id }),
      });

      if (!response.ok) {
        throw new Error('Échec de la suppression de l\'utilisateur');
      }

      setDeleteSuccess(true);
      refetch();
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'utilisateur:', error);
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirmation(false);
      setUserToDelete(null);
      // Scroll to top after the deletion process is complete
    window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    
    <div className="flex flex-col max-w-[960px] flex-1">
            {deleteSuccess && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Succès!</strong>
          <span className="block sm:inline"> L'utilisateur a été supprimé avec succès.</span>
        </div>
      )}

      <div className="px-4 py-3 flex space-x-4">
        <label className="flex flex-col min-w-40 h-12 w-full">
          <div className="flex w-full flex-1 items-stretch rounded-xl h-full">
            <div className="text-blue-600 flex border-none bg-gray-100 items-center justify-center pl-4 rounded-l-xl border-r-0">
              <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"></path>
              </svg>
            </div>
            <input
              placeholder="Rechercher par nom ou email"
              className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-gray-800 focus:outline-0 focus:ring-0 border-none bg-gray-100 focus:border-none h-full placeholder:text-gray-400 px-4 rounded-l-none border-l-0 pl-2 text-base font-normal leading-normal"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </label>
        <select
          value={filterUserType}
          onChange={(e) => setFilterUserType(e.target.value)}
          className="px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100"
        >
          <option value="">Tous les Types</option>
          <option value="syndic">Syndic</option>
          <option value="user">Résident</option>
        </select>
      </div>
      <div className="px-4 py-3 @container">
        <div className="flex overflow-hidden rounded-xl border border-gray-200 bg-white">
          <table className="flex-1">
            <thead>
              <tr className="bg-white">
                <th className="table-column-120 px-4 py-3 text-left text-gray-800 w-[400px] text-sm font-medium leading-normal">Nom</th>
                <th className="table-column-240 px-4 py-3 text-left text-gray-800 w-[400px] text-sm font-medium leading-normal">Email</th>
                <th className="table-column-360 px-4 py-3 text-left text-gray-800 w-60 text-sm font-medium leading-normal">Type d'Utilisateur</th>
                <th className="table-column-480 px-4 py-3 text-left text-gray-800 w-60 text-sm font-medium leading-normal pl-8">Actions</th>

              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user._id.toString()} className="border-t border-t-gray-200">
                  <td className="table-column-120 h-[72px] px-4 py-2 w-[400px] text-gray-800 text-sm font-normal leading-normal">
                    {user.name} {user.surname}
                  </td>
                  <td className="table-column-240 h-[72px] px-4 py-2 w-[400px] text-gray-800 text-sm font-normal leading-normal">
                    {user.email}
                  </td>
                  <td className="table-column-360 h-[72px] px-4 py-2 w-60 text-sm font-normal leading-normal">
                    <div className="flex min-w-[84px] max-w-[480px] items-center justify-center overflow-hidden rounded-full h-8 px-4 bg-gray-100 text-gray-800 text-sm font-medium leading-normal w-full">
                      <span className="truncate">
                       {user.userType === 'user' ? 'Résident' : user.userType === 'syndic' ? 'Syndic' : user.userType}
                      </span>
                    </div>
                  </td>

                  <td className="table-column-480 h-[72px] px-4 py-2 w-60 text-blue-600 text-sm font-bold leading-normal tracking-[0.015em]">
                    <div className="flex items-center justify-between">
                      <button 
                        onClick={() => {
                          setSelectedUser(user);
                          setShowDetails(true);
                        }}
                      //  className="mr-4" // Add margin right to the button
                        className="flex items-center"
                      >
                        <Eye size={18} className="mr-2" />
                        Voir Détails
                      </button>
                      <button onClick={() => handleDeleteClick(user)} className="text-red-600 hover:text-red-800">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showDetails && selectedUser && (
        <UserDetails
          user={selectedUser}
          onClose={() => {
            setShowDetails(false);
            setSelectedUser(null);
            refetch();
          }}
        />
      )}

      {showDeleteConfirmation && userToDelete && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
          <div className="relative p-5 border w-96 shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-medium leading-6 text-gray-900 mb-2">Confirmer la suppression</h3>
            <p className="text-sm text-gray-500 mb-4">
              Êtes-vous sûr de vouloir supprimer l'utilisateur {userToDelete.name} {userToDelete.surname} ?
            </p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowDeleteConfirmation(false)}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
              >
                Annuler
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
      {isDeleting && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
          <LoadingSpinner />
        </div>
      )}
      <style jsx>{`
        @container (max-width: 120px) { .table-column-120 { display: none; } }
        @container (max-width: 240px) { .table-column-240 { display: none; } }
        @container (max-width: 360px) { .table-column-360 { display: none; } }
        @container (max-width: 480px) { .table-column-480 { display: none; } }
      `}</style>
    </div>
  );
}
