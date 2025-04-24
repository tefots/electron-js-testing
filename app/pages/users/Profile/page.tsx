'use client';
import { useState, useEffect, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, LogOut, Settings, Edit } from 'lucide-react';

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

// Define type for window.electron.ipcRenderer
interface ElectronWindow extends Window {
  electron: {
    ipcRenderer: {
      invoke: (channel: string, ...args: any[]) => Promise<any>;
    };
  };
}

declare const window: ElectronWindow;

const UserProfile: React.FC = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
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
          navigate('/login');
        }
      });
    } else {
      navigate('/login');
    }
  }, [navigate]);

  // Handle logout
  const handleLogout = (): void => {
    localStorage.removeItem('userId');
    navigate('/login');
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle profile update
  const handleUpdate = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setError('');
    const updatedData = {
      id: user.id,
      name: formData.name,
      email: formData.email,
      ...(formData.password && { password: formData.password }), // Only include password if provided
    };

    const result: IpcResponse<never> = await window.electron.ipcRenderer.invoke('update-user', updatedData);
    if (result.success) {
      setUser({ ...user, name: formData.name, email: formData.email });
      setIsEditing(false);
    } else {
      setError(result.message || 'Failed to update profile');
    }
  };

  return (
    <div className="relative">
      {/* User Icon in Navbar */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 text-white hover:text-green-200"
      >
        <User size={24} />
        <span>{user.name || 'User'}</span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg z-10">
          <div className="p-4 border-b">
            <p className="font-semibold">{user.name}</p>
            <p className="text-sm text-gray-600">{user.email}</p>
            <p className="text-sm text-gray-600">Role: {user.role}</p>
            <p className="text-sm text-gray-600">ID: {user.id}</p>
          </div>
          <div className="p-2">
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center w-full text-left p-2 hover:bg-green-100"
            >
              <Edit size={20} className="mr-2" />
              Edit Profile
            </button>
            {user.role === 'admin' && (
              <button
                onClick={() => navigate('/settings')}
                className="flex items-center w-full text-left p-2 hover:bg-green-100"
              >
                <Settings size={20} className="mr-2" />
                Settings
              </button>
            )}
            <button
              onClick={handleLogout}
              className="flex items-center w-full text-left p-2 hover:bg-green-100 text-red-600"
            >
              <LogOut size={20} className="mr-2" />
              Logout
            </button>
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
          <div className="bg-white rounded-md p-6 w-96">
            <h2 className="text-lg font-semibold mb-4">Edit Profile</h2>
            {error && <p className="text-red-600 mb-4">{error}</p>}
            <form onSubmit={handleUpdate}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">New Password (optional)</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md"
                  placeholder="Leave blank to keep current password"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 bg-gray-200 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-md"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;