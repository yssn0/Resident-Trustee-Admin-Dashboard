// src\app\notifications\NotificationList.tsx

import { useState, useEffect } from 'react';
import { useNotifications } from '@/hooks/useNotifications';
import { AppNotification } from '@/types/AppNotification';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { Trash2 } from 'lucide-react';

type NotificationWithRecipient = AppNotification & {
  recipient?: {
    name?: string;
    surname?: string;
    userType?: string
  };
};

export default function NotificationList() {
  const { loading, error, refetch, notifications } = useNotifications();
  const [filteredNotifications, setFilteredNotifications] = useState<NotificationWithRecipient[]>([]);
  const [filterType, setFilterType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [notificationToDelete, setNotificationToDelete] = useState<AppNotification | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);

  useEffect(() => {
    const handleRefresh = () => refetch();
    window.addEventListener('refreshNotifications', handleRefresh);
    return () => window.removeEventListener('refreshNotifications', handleRefresh);
  }, [refetch]);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (deleteSuccess) {
      timeoutId = setTimeout(() => {
        setDeleteSuccess(false);
      }, 3000);
    }
    return () => clearTimeout(timeoutId);
  }, [deleteSuccess]);

  const handleDeleteClick = (notification: AppNotification) => {
    setNotificationToDelete(notification);
    setShowDeleteConfirmation(true);
  };

  const handleDeleteConfirm = async () => {
    if (!notificationToDelete) return;

    setIsDeleting(true);
    try {
      const response = await fetch('/api/delete_notification', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ _id: notificationToDelete._id }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete notification');
      }

      setDeleteSuccess(true);
      refetch();
    } catch (error) {
      console.error('Error deleting notification:', error);
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirmation(false);
      setNotificationToDelete(null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    setFilteredNotifications(
      notifications.filter((notification) => {
        const matchesSearch =
          notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          `${notification.recipient?.name} ${notification.recipient?.surname}`.toLowerCase().includes(searchTerm.toLowerCase());

        let matchesFilter = true;
        if (filterType === 'residents') {
          matchesFilter = notification.recipient?.userType === 'user';
        } else if (filterType === 'syndics') {
          matchesFilter = notification.recipient?.userType === 'syndic';
        }

        return matchesSearch && matchesFilter;
      })
    );
  }, [notifications, searchTerm, filterType]);

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500">Erreur: {error}</div>;

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      {deleteSuccess && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Succès!</strong>
          <span className="block sm:inline"> La notification a été supprimée avec succès.</span>
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
              placeholder="Rechercher par titre ou destinataire"
              className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-gray-800 focus:outline-0 focus:ring-0 border-none bg-gray-100 focus:border-none h-full placeholder:text-gray-400 px-4 rounded-l-none border-l-0 pl-2 text-base font-normal leading-normal"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </label>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100"
        >
            <option value="all">Toutes les notifications</option>
            <option value="residents">Résidents</option>
            <option value="syndics">Syndics</option>
          </select>
      </div>

      <ul className="divide-y divide-gray-200">
        {filteredNotifications.map((notification ) => (
          <li key={notification._id.toString()} className="p-4 hover:bg-gray-50">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-800">{notification.title}</h3>
              <span className="text-sm text-gray-500">
                {new Date(notification.createdAt).toLocaleString()}
              </span>
            </div>
            <p className="mt-2 text-gray-600">{notification.content}</p>
            <div className="mt-2 flex justify-between items-center">
              <span className={`px-2 py-1 rounded-full text-xs ${
                notification.isRead ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
              }`}>
                {notification.isRead ? 'Lu' : 'Non lu'}
              </span>
              <div className="flex items-center">
                <span className="text-sm text-gray-600 mr-4">
                  Destinataire: {notification.recipient ? `${notification.recipient.name} ${notification.recipient.surname} (${notification.recipient.userType === 'user' ? 'Résident' : 'Syndic'})` : 'Inconnu'}
                </span>
                <button
                  onClick={() => handleDeleteClick(notification)}
                  className="text-red-600 hover:text-red-800"
                  disabled={isDeleting}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {showDeleteConfirmation && notificationToDelete && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
          <div className="relative p-5 border w-96 shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-medium leading-6 text-gray-900 mb-2">Confirmer la suppression</h3>
            <p className="text-sm text-gray-500 mb-4">
              Êtes-vous sûr de vouloir supprimer cette notification ?
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
    </div>
  );
}