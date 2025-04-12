// app/pages/Auth/Login/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import LoginForm from "../../../components/Auth/LoginForm";

const LoginPage: React.FC = () => {
  const [user, setUser] = useState<{ name: string } | null>(null);

  useEffect(() => {
    // Check localStorage for logged-in user
    const storedUser = localStorage.getItem("loggedInUser");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error("Error parsing stored user:", error);
        localStorage.removeItem("loggedInUser"); // Clear invalid data
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    setUser(null);
  };

  return (
    <div>
      {user ? (
        <div className="min-h-screen flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">
              Welcome, {user.name}!
            </h1>
            <button
              onClick={handleLogout}
              className="py-2 px-4 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-all"
            >
              Logout
            </button>
          </div>
        </div>
      ) : (
        <LoginForm />
      )}
    </div>
  );
};

export default LoginPage;