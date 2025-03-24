"use client";

import Link from "next/link";
import { useState } from "react";

// Define the shape of the response from the Electron API
interface SignupResponse {
  success: boolean;
  id?: number;
  error?: string;
}

// Define the shape of the user data sent to Electron
interface UserData {
  username: string;
  email: string;
  password: string;
  role: string;
}

// Extend the Window interface to include electronAPI
declare global {
  interface Window {
    electronAPI: {
      signupUser: (user: UserData) => Promise<SignupResponse>;
    };
  }
}

export default function SignupForm() {
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [role, setRole] = useState<string>("user");
  const [message, setMessage] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const result = await window.electronAPI.signupUser({
        username,
        email,
        password,
        role,
      });

      if (result.success) {
        setMessage("User created successfully!");
        setUsername("");
        setEmail("");
        setPassword("");
        setRole("user");
      } else {
        // Handle specific SQLite constraint errors
        if (result.error?.includes("UNIQUE constraint failed: users.email")) {
          setMessage("Warning! This email is already in use.");
          setUsername("");
          setEmail("");
          setPassword("");
          setRole("user");
        } else if (result.error?.includes("UNIQUE constraint failed: users.username")) {
          setMessage("Error: This username is already taken.");
        } else {
          setMessage(`Error: ${result.error || "Unknown error"}`);
        }
      }
    } catch (error) {
      setMessage(`Error: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Sign Up
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="mt-1 block w-full px-4 py-2 border rounded-md"
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full px-4 py-2 border rounded-md"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full px-4 py-2 border rounded-md"
            />
          </div>
          <div>
            <label
              htmlFor="role"
              className="block text-sm font-medium text-gray-700"
            >
              Role
            </label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border rounded-md"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div>
            <button
              type="submit"
              className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md"
            >
              Sign Up
            </button>
          </div>
          <p className="text-center text-sm text-gray-600">{message}</p>
          <div className="text-center">
            Already have an account?
            <Link href="/pages/Auth/Login" className="text-blue-700 ml-2">
              Sign in here
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}