"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

interface User {
  id: number;
  firstName: string;
  lastName: string;
  status: string;
  userType: string;
  email: string;
  phoneNumber: string;
}

export default function UserDetails() {
  const router = useRouter();
  const { id } = router.query; // Get the id from the URL
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const result = await window.electronAPI.getUsers();
      if (result.success && result.users) {
        const foundUser = result.users.find(u => u.id === Number(id));
        setUser(foundUser || null);
      } else {
        console.error('Error fetching users:', result.error);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchUser();
    }
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!user) return <p>User not found</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">User Details</h1>
      <div className="bg-white p-4 rounded shadow">
        <p><strong>ID:</strong> {user.id}</p>
        <p><strong>First Name:</strong> {user.firstName}</p>
        <p><strong>Last Name:</strong> {user.lastName}</p>
        <p><strong>Status:</strong> {user.status}</p>
        <p><strong>User Type:</strong> {user.userType}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Phone Number:</strong> {user.phoneNumber}</p>
      </div>
      <button
        onClick={() => router.push('/pages/Users')}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Back to Users
      </button>
    </div>
  );
}