"use client";

import { Bell, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import React, { useState, useEffect } from "react";

export function DashboardHeader() {

  const [showUserOverlay, setShowUserOverlay] = useState(false);
  const [user, setUser] = useState<{
    id: number;
    name: string;
    email: string;
    role: string;

  } | null>(null);

  // Load user data from localStorage when component mounts
  useEffect(() => {
    const storedUser = localStorage.getItem("loggedInUser");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      console.log("Parsed user from localStorage:", parsedUser); // Debug log
      setUser(parsedUser);
    }
  }, []);

  const toggleUserOverlay = () => {
    setShowUserOverlay(!showUserOverlay);
  };

  return (
    <header className="bg-white shadow-sm p-4 mb-5">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Header Title */}
        <h1 className="text-2xl font-semibold text-gray-800">
          Lesotho Nursery Shop
        </h1>

        {/* Notification and User Icons */}
        <div className="flex items-center space-x-4 relative">
          <Button variant="ghost" className="p-3 w-12 h-12 flex items-center justify-center">
            <Bell size={32} />
          </Button>

          <div className="relative">
            <Button
              variant="ghost"
              // size="icon"
              className="p-3 p-3 w-20 h-12 flex items-center justify-center"
              onClick={toggleUserOverlay}
            >
              <User size={36} className="bg-gray-400 rounded-full" />
            </Button>

            {/* User Overlay - Only show if user is logged in */}
            {showUserOverlay && user && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg p-4 z-10 border border-gray-200">
                <div className="flex flex-col">
                <span className="text-sm text-gray-500 mt-1">
                    ID: {user.id}
                  </span>
                  <span className="font-semibold text-gray-800">
                    {user.name}
                  </span>
                  <span className="text-sm text-gray-600">{user.email}</span>
                  <span className="text-sm text-gray-500 mt-1">
                    Role: {user.role}
                  </span>
                 
                  
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-3"
                    onClick={() => setShowUserOverlay(false)}
                  >
                    Close
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
{/*
     Search and Category Selection *
    <div className="flex flex-col md:flex-row items-center gap-4">
    {/* Search Input *
    <div className="flex items-center w-full md:w-auto" >
      <input
        type="text"
        placeholder="Search by category / name"
        className="w-full md:w-64 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>

    {/* Category Dropdown *
    <div className="w-full md:w-auto">
      <select
        id="category"
        value={selectedCategory}
        onChange={(e) => handleCategoryChange(e.target.value)}
        className="w-full md:w-48 h-10 px-3 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">Select Category</option>
        {categories.map((cat, index) => (
          <option key={index} value={cat}>
            {cat}
          </option>
        ))}
      </select>
    </div>

    {/* Search Icon *
    <div className="flex items-center">
      <button className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
        <SearchIcon className="h-5 w-5" />
      </button>
    </div>
  </div>
  
  
  */}