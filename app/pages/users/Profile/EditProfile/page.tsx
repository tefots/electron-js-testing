'use client';
import { useState, useEffect, FormEvent } from 'react';
import { Save, X } from 'lucide-react';

// Define types for user data and IPC responses
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface FormData {
  name: string;
  email: string;
  password: string;
}

interface IpcResponse<T> {
  success: boolean;
  user?: T;
  message?: string;
}

// Define type for update-user payload
interface UpdateUserPayload {
  id: string;
  name: string;
  email: string;
  password?: string;
}

// Define type for window.electron.ipcRenderer
interface ElectronWindow extends Window {
  electron: {
    ipcRenderer: {
      invoke: {
        (channel: 'get-user', userId: string): Promise<IpcResponse<User>>;
        (channel: 'update-user', payload: UpdateUserPayload): Promise<IpcResponse<never>>;
      };
    };
  };
}

declare const window: ElectronWindow;

const EditProfile: React.FC = () => {
  const [user, setUser] = useState<User>({
    id: '',
    name: '',
    email: '',
    role: '',
  });
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState<string>('');

  // Fetch user data on mount
  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (userId) {
      window.electron.ipcRenderer.invoke('get-user', userId).then((result: IpcResponse<User>) => {
        if (result.success && result.user) {
          setUser(result.user);
          setFormData({ name: result.user.name, email: result.user.email, password: '' });
        } else {
          setError('Failed to load user data');
          window.location.hash = '/login';
        }
      });
    } else {
      window.location.hash = '/login';
    }
  }, []);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle profile update
  const handleUpdate = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setError('');
    const updatedData: UpdateUserPayload = {
      id: user.id,
      name: formData.name,
      email: formData.email,
      ...(formData.password && { password: formData.password }), // Only include password if provided
    };

    const result: IpcResponse<never> = await window.electron.ipcRenderer.invoke('update-user', updatedData);
    if (result.success) {
      setUser({ ...user, name: formData.name, email: formData.email });
      window.location.hash = '/dashboard'; // Redirect to dashboard after save
    } else {
      setError(result.message || 'Failed to update profile');
    }
  };

  // Handle cancel
  const handleCancel = (): void => {
    window.location.hash = '/dashboard'; // Redirect to dashboard
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white rounded-md shadow-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-6 text-center text-green-600">Edit Profile</h2>
        {error && <p className="text-red-600 mb-4 text-center">{error}</p>}
        <form onSubmit={handleUpdate}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1 text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1 text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium mb-1 text-gray-700">New Password (optional)</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
              placeholder="Leave blank to keep current password"
            />
          </div>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={handleCancel}
              className="flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
            >
              <X size={20} className="mr-2" />
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              <Save size={20} className="mr-2" />
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;