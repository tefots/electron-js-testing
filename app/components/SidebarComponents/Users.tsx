"use client";

import { DashboardLayout } from '../DashboardComponents/DashboardLayout';
import Link from 'next/link';
import { useState, useEffect, SetStateAction } from 'react';


// an interface 
interface User {
  id: number;
  firstName: string;
  lastName: string;
  status: string;
  userType: string;
  email: string;
  phoneNumber: string;
}






export default function UsersPage() {
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState<User[]>([]);

  // Fetch users from the database
  const fetchUsers = async () => {
    try {
      const result = await window.electronAPI.getUsers();
      if (result.success) {
        setUsers(result.users || []);
      } else {
        console.error('Error fetching users:', result.error);
        setUsers([]); // set to empty array on error
      }
    } catch (error) {
      console.error('Error:', error);
      setUsers([]); // set to empty array on catch
    } finally {
      setLoading(false);
    }
  };

  // Delete all users
  const handleDeleteAll = async () => {
    if (confirm('Are you sure you want to delete all users?')) {
      try {
        const result = await window.electronAPI.deleteAllUsers();
        if (result.success) {
          setUsers([]);
        } else {
          console.error('Error deleting users:', result.error);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  // delete single user
  const handleDelete = async (id: number) => {
    if (confirm(`Are you sure you want to delete user with ID ${id}?`)) {
      try {
        const result = await window.electronAPI.deleteUser({ id });
        if (result.success) {
          setUsers(users.filter(user => user.id !== id));
        } else {
          console.error('Error deleting user:', result.error);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  // Handle search input change
  const handleSearchChange = (e: { target: { value: SetStateAction<string>; }; }) => {
    setSearchQuery(e.target.value);
  };

  // Filter users based on search query (by ID)
  const filteredUsers = users.filter(user =>
    user.id.toString().includes(searchQuery)
  );

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <DashboardLayout>
      <div className="container mx-auto mt-10 p-0 max-w-7xl">
        <div className="flex md:flex-row flex-row justify-between py-2">
          <h1 className="text-start mx-5 text-2xl font-bold">LNS Users</h1>
          {/* Search input */}
          <div>
            <label>Search User</label>
            <input
              type="text"
              placeholder="User ID"
              value={searchQuery}
              onChange={handleSearchChange}
              className="border text-center mx-4 border-gray-400 rounded h-9"
            />
          </div>
          {/* Action buttons */}
          <div className="flex justify-end items-end mb-4 flex-col sm:flex-row">
            <Link
              href={'/pages/Users/add'}
              className="bg-gray-800 text-white text-lg px-6 mr-3 py-2 rounded-3xl shadow hover:bg-blue-700 transition duration-300 mb-4 sm:mb-0"
            >
              + Add User
            </Link>
            <button
              onClick={handleDeleteAll}
              className="bg-red-600 text-white p-4 mr-5 py-2 rounded-3xl shadow hover:bg-red-700 transition duration-300"
            >
              Delete All Users
            </button>
          </div>
        </div>
        <div className="overflow-x-auto mt-5 mx-5">
          {loading ? (
            <p>Loading users...</p>
          ) : (
            <table className="min-w-full table-auto border-collapse mb-6">
              <thead>
                <tr className="p-4 gap-x-8 bg-slate-300 rounded-t-xl">
                  <th className="px-4 py-2 text-start border">ID</th>
                  <th className="px-4 py-2 text-start border">First Name</th>
                  <th className="px-4 py-2 text-left border-r">Last Name</th>
                  <th className="px-4 py-2 text-left border-r">Status</th>
                  <th className="px-4 py-2 text-left border-r">User Type</th>
                  <th className="px-4 py-2 text-left border-r">Email</th>
                  <th className="px-4 py-2 text-left border-r">Phone Number</th>
                  <th className="px-4 py-2 text-left border-r">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((item) => (
                    <tr key={item.id}>
                      <td className="px-4 py-2 text-left border">{item.id}</td>
                      <td className="px-4 py-2 text-left border">{item.firstName}</td>
                      <td className="px-4 py-2 text-left border">{item.lastName}</td>
                      <td className="px-4 py-2 text-left border-b">{item.status}</td>
                      <td className="px-4 py-2 text-left border-b">{item.userType}</td>
                      <td className="px-4 py-2 text-left border-b">{item.email}</td>
                      <td className="px-4 py-2 text-left border-b">{item.phoneNumber}</td>
                      <td className="px-4 py-2 text-left border-b">
                        <Link href={`/pages/users/details/${item.id}`} className="text-blue-500">
                          Details
                        </Link>
                        <button
                        onClick={() => handleDelete(item.id)}
                        className="ms-4 text-red-500">Delete</button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="px-4 py-2 text-center">
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}