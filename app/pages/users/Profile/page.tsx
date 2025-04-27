'use client';
import { useState, useEffect } from 'react';
import { User, LogOut, Settings, Edit } from 'lucide-react';

// Define types for user data and IPC responses
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
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
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [user, setUser] = useState<User>({
    id: '',
    name: '',
    email: '',
    role: '',
  });
  const [error, setError] = useState<string>('');

  // Fetch user data on mount
  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (userId) {
      window.electron.ipcRenderer.invoke('get-user', userId).then((result: IpcResponse<User>) => {
        if (result.success && result.user) {
          setUser(result.user);
        } else {
          setError('Failed to load user data');
          window.location.hash = '/login';
        }
      });
    } else {
      window.location.hash = '/login';
    }
  }, []);

  // Handle logout
  const handleLogout = (): void => {
    localStorage.removeItem('userId');
    window.location.hash = '/login';
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
            {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
          </div>
          <div className="p-2">
            <button
              onClick={() => (window.location.hash = '/pages/users/Profile/EditProfile')}
              className="flex items-center w-full text-left p-2 hover:bg-green-100"
            >
              <Edit size={20} className="mr-2" />
              Edit Profile
            </button>
            {user.role === 'admin' && (
              <button
                onClick={() => (window.location.hash = '/settings')}
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
    </div>
  );
};

export default UserProfile;