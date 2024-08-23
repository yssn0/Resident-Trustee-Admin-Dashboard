//src\app\users\CreateUser.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

export default function CreateUser() {
  const router = useRouter();
  const [newUser, setNewUser] = useState({
    email: '',
    password: '',
    name: '',
    surname: '',
    phoneNumber: '',
    userType: '',
  });
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState('');
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewUser(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    setError('');
    setRegistrationSuccess(false);

    try {
      const response = await fetch('/api/create_user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      });

      if (!response.ok) {
        throw new Error("Échec de la création de l'utilisateur");
      }

      setRegistrationSuccess(true);
      setNewUser({
        email: '',
        password: '',
        name: '',
        surname: '',
        phoneNumber: '',
        userType: '',
      });

      router.push('/users/create');
    } catch (error) {
      console.error("Erreur lors de la création de l'utilisateur:", error);
      setError("Une erreur est survenue lors de la création de l'utilisateur");
    } finally {
      setIsCreating(false);
    }
  };

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (registrationSuccess) {
      timeoutId = setTimeout(() => {
        setRegistrationSuccess(false);
      }, 3000);
    }
    return () => clearTimeout(timeoutId);
  }, [registrationSuccess]);

  return (
    <div className="relative flex size-full min-h-screen flex-col overflow-x-hidden pt-10 bg-gray-100 rounded-xl">
      <div className="bg-white shadow-lg rounded-xl p-10 max-w-2xl mx-auto mt-10">
        <h1 className="text-3xl font-bold text-center mb-8">Créer un nouvel utilisateur</h1>
        {error && <p className="text-red-500 mb-6 text-center">{error}</p>}
        {registrationSuccess && (
          <div
            className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-md relative mb-6 text-center"
            role="alert"
          >
            <strong className="font-bold">Succès!</strong>
            <span className="block sm:inline"> L'utilisateur a été créé avec succès.</span>
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          {[
            { id: 'email', label: 'Email', type: 'email', required: true },
            { id: 'password', label: 'Mot de passe', type: 'password', required: true },
            { id: 'name', label: 'Nom', type: 'text' },
            { id: 'surname', label: 'Prénom', type: 'text' },
            { id: 'phoneNumber', label: 'Numéro de téléphone', type: 'tel' },
          ].map((field) => (
            <div key={field.id}>
              <label htmlFor={field.id} className="block text-sm font-medium text-gray-700">
                {field.label}
              </label>
              <input
                type={field.type}
                id={field.id}
                name={field.id}
                value={(newUser as any)[field.id]}
                onChange={handleInputChange}
                required={field.required}
                className="mt-2 block w-full px-4 py-2 rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              />
            </div>
          ))}
          <div>
            <label htmlFor="userType" className="block text-sm font-medium text-gray-700">
              Type d'utilisateur
            </label>
            <select
              id="userType"
              name="userType"
              value={newUser.userType}
              onChange={handleInputChange}
              required
              className="mt-2 block w-full px-4 py-2 rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            >
              <option value="">Sélectionnez le type d'utilisateur</option>
              <option value="user">Résident</option>
              <option value="syndic">Syndic</option>
            </select>
          </div>
          <button
            type="submit"
            disabled={isCreating}
            className="w-full py-3 px-4 border border-transparent rounded-md shadow-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {isCreating ? 'Création en cours...' : 'Créer un utilisateur'}
          </button>
        </form>
        {isCreating && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
            <LoadingSpinner />
          </div>
        )}
      </div>
    </div>
  );
}