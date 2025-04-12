"use client";
import Image from "next/image";
import logo from "./../../assets/logo.jpg"
import {
  Home,
  Users,
  ShoppingCart,
  BarChart2,
  Settings,
  LogOut,
  Menu,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export function DashboardSidebar() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <aside
      className={`bg-gray-800 text-white ${
        isOpen ? "w-64" : "w-16"
      } p-4 h-screen transition-all duration-300`}
    >
      <div className="flex space-x-5">
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-gray-500 mb-4"
      >
        <Menu size={24} />
      </button>
      <div className="">
        <Image
        src ={logo} 
        width ={50}
        height={50}
        alt={'logo'}
        className="rounded-full mb-6 "
        />
      </div>

      </div>
      <div className={`${isOpen ? "block" : "hidden"} text-2xl font-bold mb-8`}>
        Admin Dashboard
      </div>
      <nav>
        <div className="space-y-2">
          <Link
            href="/pages/Dashboard"
            className="flex items-center p-2 hover:bg-gray-700 rounded"
          >
            <Home className="mr-2" size={20} />
            {isOpen && "Dashboard"}
          </Link>

          <Link
            href="/pages/users"
            className="flex items-center p-2 hover:bg-gray-700 rounded"
          >
            <Users className="mr-2" size={20} />
            {isOpen && "Users"}
          </Link>

          <Link
            href="/pages/Products"
            className="flex items-center p-2 hover:bg-gray-700 rounded"
          >
            <ShoppingCart className="mr-2" size={20} />
            {isOpen && "Products"}
          </Link>

          <Link
            href="/pages/Analytics"
            className="flex items-center p-2 hover:bg-gray-700 rounded"
          >
            <BarChart2 className="mr-2" size={20} />
            {isOpen && "Analytics"}
          </Link>

          <Link
            href="/pages/Settings"
            className="flex items-center p-2 hover:bg-gray-700 rounded"
          >
            <Settings className="mr-2" size={20} />
            {isOpen && "Settings"}
          </Link>

          <Link
            href="/"
            className="flex items-center p-2 hover:bg-gray-700 rounded"
          >
            <LogOut className="mr-2" size={20} />
            {isOpen && "Logout"}
          </Link>
        </div>
      </nav>
    </aside>
  );
}
