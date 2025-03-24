"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

// Define the shape of the response from the Electron API
interface LoginResponse {
  success: boolean;
  error?: string;
}

// Define the shape of the login data sent to Electron
interface LoginData {
  username: string;
  password: string;
}

// Extend the Window interface to include electronAPI
declare global {
  interface Window {
    electronAPI: {
      loginUser: (data: LoginData) => Promise<LoginResponse>;
    };
  }
}

export default function LoginForm() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const result = await window.electronAPI.loginUser({
        username,
        password,
      });

      if (result.success) {
        setMessage("Login successful!");
        setUsername("");
        setPassword("");
        router.push("/pages/Dashboard"); // Navigate to dashboard on success
      } else {
        setMessage(`Error: ${result.error || "Invalid username or password"}`);
      }
    } catch (error) {
      setMessage(`Error: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-300 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="username"
              className="block text-md font-medium text-gray-600 mb-2"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full text-start p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-start text-md font-medium text-gray-600 mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white font-semibold rounded-2xl shadow-xl hover:bg-blue-700 transition-all"
          >
            Login
          </button>
          <p className="text-center text-sm text-gray-600 mt-4">{message}</p>
          <div className="mt-6 text-center">
            Don&apos;t have an account?
            <Link
              href="/pages/Auth/Signup"
              className="text-center ms-4 text-blue-700 text-lg"
            >
              Sign up here
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}