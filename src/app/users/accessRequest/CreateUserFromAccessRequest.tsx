//src\app\users\accessRequest\CreateUserFromAccessRequest.tsx
import { useState } from 'react';
import { AccessRequest } from '@/types/accessRequest';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

interface CreateUserFromAccessRequestProps {
  accessRequest: AccessRequest;
  onClose: () => void;
}
interface FormErrors {
  name?: string;
  surname?: string;
  email?: string;
  phoneNumber?: string;
  userType?: string;
  password?: string;
}


export default function CreateUserFromAccessRequest({ accessRequest, onClose }: CreateUserFromAccessRequestProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [message, setMessage] = useState<string | null>(null);
  const [newUser, setNewUser] = useState({
    name: accessRequest.name,
    surname: accessRequest.surname,
    email: accessRequest.email,
    phoneNumber: accessRequest.phoneNumber,
    userType: 'user',
    password: '', 
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewUser(prev => ({ ...prev, [name]: value }));
    
    // Clear the error when the user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prevErrors => ({
        ...prevErrors,
        [name]: undefined
      }));
    }
  };
  
  

  const handleCreateUser = async () => {
    if (!validateForm()) {
      return; // Stop here if the form is not valid
    }
    setIsCreating(true);
    setMessage(null);
    try {
      // Create user
      const createUserResponse = await fetch('/api/create_user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      });

      if (!createUserResponse.ok) {
        const errorData = await createUserResponse.json();
        throw new Error(errorData.error || 'Failed to create user');
      }

      // If user creation is successful, delete the accessRequest
      const deleteAccessRequestResponse = await fetch('/api/delete_access_request', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ _id: accessRequest._id }),
      });

      if (!deleteAccessRequestResponse.ok) {
        throw new Error('Failed to delete AccessRequest');
      }

      setMessage('Utilisateur créé avec succès et accessRequest est supprimé');
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      console.error('Error creating user or deleting AccessRequest:', error);
      setMessage((error as Error).message || 'Une erreur est survenue lors de la création de l\'utilisateur ou de la suppression du parrainage');
    } finally {
      setIsCreating(false);
    }
  };

  const validateForm = () => {
    let tempErrors: FormErrors = {};
    if (!newUser.password.trim()) {
      tempErrors.password = "Le mot de passe est requis";
    }
    // Add other field validations here if needed
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };
  

  
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 overflow-y-auto h-full w-full z-50 flex items-start justify-center pt-80">
      <div className="relative mx-auto p-10 border w-full max-w-3xl shadow-lg rounded-md bg-white">
        {isCreating && (
          <div className="flex flex-col max-w-[960px] flex-1">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
            <LoadingSpinner />
          </div>
          </div>

        )}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-3xl font-bold text-gray-800">Créer un utilisateur à partir du parrainage</h2>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-800">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        {message && (
          <div className={`mb-4 p-4 rounded-md ${message.includes('succès') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
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
                value={newUser.name}
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
                value={newUser.surname}
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
              value={newUser.email}
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
              value={newUser.phoneNumber}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            />
          </div>
          <div>
            <label htmlFor="userType" className="block text-sm font-medium text-gray-700">Type d'utilisateur</label>
            <select
              id="userType"
              name="userType"
              value={newUser.userType}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            >
              <option value="user">Résident</option>
            </select>
          </div>
          <div>
  <label htmlFor="password" className="block text-sm font-medium text-gray-700">Mot de passe</label>
  <input
    type="password"
    id="password"
    name="password"
    value={newUser.password}
    onChange={handleInputChange}
    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 ${
      errors.password ? 'border-red-500' : ''
    }`}
    required
  />
  {errors.password && (
    <p className="mt-1 text-sm text-red-500">{errors.password}</p>
  )}
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
            onClick={handleCreateUser}
            className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-200"
          >
            Créer l'utilisateur
          </button>
        </div>
      </div>
    </div>
  );
}