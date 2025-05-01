"use client";

import { useState } from "react";

// Define the shape of the response from the Electron API
export interface SignupResponse {
  success: boolean;
  id?: number;
  error?: string;
}

// Define the shape of the user data sent to Electron
export interface UserData {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  status: string;
  userType: string;
  phoneNumber: string;
}

export default function SignupForm() {

  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [status, setStatus] = useState<string>("Off"); // Default to "Off"
  const [userType, setUserType] = useState<string>("user"); // Default to "user"
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const result = await window.electronAPI.signupUser({
        firstName,
        lastName,
        username,
        email,
        password,
        status,
        userType,
        phoneNumber,
      });

      if (result.success) {
        setMessage("User created successfully!");
        setMessageType('success');
        setFirstName("");
        setLastName("");
        setUsername("");
        setEmail("");
        setPassword("");
        setStatus("Off");
        setUserType("user");
        setPhoneNumber("");
      } else {
        if (result.error?.includes("UNIQUE constraint failed: users.email")) {
          setMessage("This email is already in use.");
          setMessageType('error');
        } else if (result.error?.includes("UNIQUE constraint failed: users.username")) {
          setMessage("This username is already taken.");
          setMessageType('error');
        } else {
          setMessage(result.error || "Unknown error");
          setMessageType('error');
        }
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : String(error));
      setMessageType('error');
    }
  };

  const handleInputChange = (field: keyof UserData) => 
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      if (message) {
        setMessage('');
        setMessageType('');
      }
      switch (field) {
        case 'firstName':
          setFirstName(e.target.value);
          break;
        case 'lastName':
          setLastName(e.target.value);
          break;
        case 'username':
          setUsername(e.target.value);
          break;
        case 'email':
          setEmail(e.target.value);
          break;
        case 'password':
          setPassword(e.target.value);
          break;
        case 'status':
          setStatus(e.target.value);
          break;
        case 'userType':
          setUserType(e.target.value);
          break;
        case 'phoneNumber':
          setPhoneNumber(e.target.value);
          break;
      }
    };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Add User
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {message && (
            <p 
              className={`text-center text-sm mb-4 ${
                messageType === 'error' ? 'text-red-600' : 'text-green-600'
              }`}
            >
              {message}
            </p>
          )}
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              value={firstName}
              onChange={handleInputChange('firstName')}
              required
              className="mt-1 block w-full px-4 py-2 border rounded-md"
            />
          </div>
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              value={lastName}
              onChange={handleInputChange('lastName')}
              required
              className="mt-1 block w-full px-4 py-2 border rounded-md"
            />
          </div>
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={handleInputChange('username')}
              required
              className="mt-1 block w-full px-4 py-2 border rounded-md"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={handleInputChange('email')}
              required
              className="mt-1 block w-full px-4 py-2 border rounded-md"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={handleInputChange('password')}
              required
              className="mt-1 block w-full px-4 py-2 border rounded-md"
            />
          </div>
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              id="status"
              value={status}
              onChange={handleInputChange('status')}
              className="mt-1 block w-full px-4 py-2 border rounded-md"
            >
              <option value="Active">Active</option>
              <option value="Off">Off</option>
            </select>
          </div>
          <div>
            <label htmlFor="userType" className="block text-sm font-medium text-gray-700">
              User Type
            </label>
            <select
              id="userType"
              value={userType}
              onChange={handleInputChange('userType')}
              className="mt-1 block w-full px-4 py-2 border rounded-md"
            >
              <option value="user">User</option>
              <option value="Employee">Employee</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
          <div>
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <input
              type="tel"
              id="phoneNumber"
              value={phoneNumber}
              onChange={handleInputChange('phoneNumber')}
              required
              className="mt-1 block w-full px-4 py-2 border rounded-md"
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md"
            >
              Sign Up
            </button>
          </div>
          <button
                onClick={() => window.history.back()} // Simple back navigation
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
                Back to Users
            </button>
    
        </form>
      </div>
    </div>
  );
}