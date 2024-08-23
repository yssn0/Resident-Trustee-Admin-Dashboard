// src/app/notifications/SendNotificationForm.tsx
'use client';

import { useState, useEffect } from 'react';
import { useUsers } from '@/hooks/useUsers';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

export default function SendNotificationForm() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [recipientType, setRecipientType] = useState('all');
  const [selectedUserType, setSelectedUserType] = useState(''); //  state to select between Résident and Syndic
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { appUsers } = useUsers();

  useEffect(() => {
    if (message.includes('succès')) {
      const timer = setTimeout(() => setMessage(''), 3000); // Remove message after 3 seconds
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/send_notification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          content,
          recipientType,
          selectedUsers,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Notification envoyée avec succès');
        setTitle('');
        setContent('');
        setRecipientType('all');
        setSelectedUserType('');
        setSelectedUsers([]);
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('refreshNotifications'));
        }
      } else {
        setMessage(data.error || 'Échec de l\'envoi de la notification');
      }
    } catch (error) {
      setMessage('Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredUsers = appUsers.filter(user => 
    (selectedUserType === 'residents' && user.userType === 'user') ||
    (selectedUserType === 'syndics' && user.userType !== 'user')
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-6 bg-white rounded-md shadow-md">
      {message && (
        <div className={`p-4 rounded-md text-center font-semibold ${
          message.includes('succès') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {message}
        </div>
      )}
      
      <div className="mb-4">
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">Titre</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          required
          placeholder="Entrez le titre de la notification"
        />
      </div>
      
      <div className="mb-4">
        <label htmlFor="content" className="block text-sm font-medium text-gray-700">Contenu</label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          rows={4}
          required
          placeholder="Entrez le contenu de la notification"
        />
      </div>
      
      <div className="mb-4">
        <label htmlFor="recipientType" className="block text-sm font-medium text-gray-700">Type de destinataire</label>
        <select
          id="recipientType"
          value={recipientType}
          onChange={(e) => setRecipientType(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          required
        >
          <option value="all">Tous les utilisateurs</option>
          <option value="residents">Tous les résidents</option>
          <option value="syndics">Tous les syndics</option>
          <option value="specific">Utilisateur spécifique</option>
        </select>
      </div>

      {recipientType === 'specific' && (
        <>
          <div className="mb-4">
            <label htmlFor="selectedUserType" className="block text-sm font-medium text-gray-700">Choisir le type d'utilisateur</label>
            <select
              id="selectedUserType"
              value={selectedUserType}
              onChange={(e) => setSelectedUserType(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            >
              <option value="">-- Sélectionner --</option>
              <option value="residents">Résidents</option>
              <option value="syndics">Syndics</option>
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="selectedUsers" className="block text-sm font-medium text-gray-700">Sélectionner les utilisateurs</label>
            <select
              id="selectedUsers"
              multiple
              value={selectedUsers}
              onChange={(e) => setSelectedUsers(Array.from(e.target.selectedOptions, option => option.value))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            >
              {filteredUsers.map(user => (
                <option key={user._id.toString()} value={user._id.toString()}>
                  {user.name} ({user.email}) - {user.userType === 'user' ? 'Résident' : 'Syndic'}
                </option>
              ))}
            </select>
          </div>
        </>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        {isLoading ? 'Envoi en cours...' : 'Envoyer la notification'}
      </button>

      {isLoading && (
      <div className="flex flex-col max-w-[960px] flex-1">
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
          <LoadingSpinner />
        </div>
      </div>
      )}
    </form>
  );
}
