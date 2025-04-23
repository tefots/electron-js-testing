"use client";

import { Bell, UserRound } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import React, { useState, useEffect } from "react";

export function DashboardHeader() {
  const [showUserOverlay, setShowUserOverlay] = useState(false);
  const [showNotificationsOverlay, setShowNotificationsOverlay] = useState(false);
  const [user, setUser] = useState<{
    id: number;
    name: string;
    email: string;
    role: string;
  } | null>(null);
  const [notifications, setNotifications] = useState<string[]>([
    "Welcome to the platform!",
    "Your profile was updated recently.",
    "New message received.",
  ]);

  const router = useRouter();

  // Load user data from localStorage when component mounts
  useEffect(() => {
    const storedUser = localStorage.getItem("loggedInUser");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      console.log("Parsed user from localStorage:", parsedUser);
      setUser(parsedUser);
    }
  }, []);

  const toggleUserOverlay = () => {
    setShowUserOverlay(!showUserOverlay);
    setShowNotificationsOverlay(false); // Close notifications overlay if open
  };

  const toggleNotificationsOverlay = () => {
    setShowNotificationsOverlay(!showNotificationsOverlay);
    setShowUserOverlay(false); // Close user overlay if open
  };

  const handleEditProfile = () => {
    setShowUserOverlay(false);
    router.push("/edit-profile");
  };

  // Function to generate initials from the user's name (optional, kept for reference)
  const getInitials = (name: string) => {
    const nameParts = name.split(" ");
    const initials = nameParts
      .map((part) => part.charAt(0))
      .join("")
      .toUpperCase();
    return initials.slice(0, 2);
  };

  return (
    <header className="bg-white shadow-sm p-4 mb-5">
      <div className="flex justify-between items-center gap-4">
        {/* Search Bar */}
        <div className="flex items-center w-1/3">
          <input
            type="text"
            placeholder="Search..."
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* Centered Office Timings */}
        <div className="text-gray-600 text-sm">
          Office timings: 9 am est to 11 pm est
        </div>

        {/* Notifications and User Info */}
        <div className="flex items-center space-x-3 relative">
          {/* Notifications Icon */}
          <Button
            variant="ghost"
            className="p-2 w-10 h-10 flex items-center justify-center relative"
            onClick={toggleNotificationsOverlay}
          >
            <Bell size={24} className="text-gray-600" />
            {notifications.length > 0 && (
              <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {notifications.length}
              </span>
            )}
          </Button>

          {/* Notifications Overlay */}
          {showNotificationsOverlay && (
            <div className="absolute right-0 top-12 w-64 bg-white rounded-lg shadow-lg p-4 z-10 border border-gray-200">
              <div className="flex flex-col">
                <h3 className="text-sm font-semibold text-gray-800 mb-2">
                  Notifications
                </h3>
                {notifications.length > 0 ? (
                  <ul className="text-sm text-gray-600 space-y-2">
                    {notifications.map((notification, index) => (
                      <li key={index} className="border-b py-1">
                        {notification}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500">No notifications</p>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3"
                  onClick={() => setShowNotificationsOverlay(false)}
                >
                  Close
                </Button>
              </div>
            </div>
          )}

          {/* User Email */}
          {user && (
            <span className="text-sm text-gray-600">{user.email}</span>
          )}

          {/* User Profile Picture/Icon */}
          <Button
            variant="ghost"
            className="p-2 w-10 h-10 flex items-center justify-center"
            onClick={toggleUserOverlay}
          >
            {user?.name ? (
              <Image
                src="/path-to-profile-pic.jpg"
                alt="Profile"
                width={32}
                height={32}
                className="rounded-full"
              />
            ) : (
              <UserRound
                size={24}
                className="text-gray-600 bg-gray-200 rounded-full p-1"
              />
            )}
          </Button>

          {/* User Overlay */}
          {showUserOverlay && user && (
            <div className="absolute right-0 top-12 w-64 bg-white rounded-lg shadow-lg p-4 z-10 border border-gray-200">
              <div className="flex flex-col">
                <span className="text-sm text-gray-500">
                  ID: {user.id}
                </span>
                <span className="font-semibold text-gray-800">
                  {user.name}
                </span>
                <span className="text-sm text-gray-600">{user.email}</span>
                <span className="text-sm text-gray-500 mt-1">
                  Role: {user.role}
                </span>
                <div className="flex space-x-2 mt-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleEditProfile}
                  >
                    Edit Profile
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowUserOverlay(false)}
                  >
                    Close
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}