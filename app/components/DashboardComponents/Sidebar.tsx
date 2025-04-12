"use client";
import Image from "next/image";
import logo from "./../../assets/logo.jpg";
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
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { LucideIcon } from "lucide-react"; // Import LucideIcon type

// Define NavItem interface for type safety
interface NavItem {
  href: string;
  icon: LucideIcon; // Use LucideIcon instead of ComponentType
  label: string;
}

export function DashboardSidebar() {
  // Initialize state from localStorage if available
  const [isOpen, setIsOpen] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("sidebarOpen") !== "false";
    }
    return true;
  });

  // Get current pathname for active state
  const pathname = usePathname();

  // Persist sidebar state to localStorage
  useEffect(() => {
    localStorage.setItem("sidebarOpen", isOpen.toString());
  }, [isOpen]);

  // Navigation items array
  const navItems: NavItem[] = [
    { href: "/pages/Dashboard", icon: Home, label: "Dashboard" },
    { href: "/pages/users", icon: Users, label: "Users" },
    { href: "/pages/Products", icon: ShoppingCart, label: "Products" },
    { href: "/pages/Analytics", icon: BarChart2, label: "Analytics" },
    { href: "/pages/Settings", icon: Settings, label: "Settings" },
    { href: "/", icon: LogOut, label: "Logout" },
  ];

  return (
    <aside
      className={`bg-gray-800 text-white h-screen transition-all duration-300 flex flex-col
        ${isOpen ? "w-64" : "w-16"}`}
    >
      <div className="flex items-center justify-between p-4">
        <div className={`${isOpen ? "block" : "hidden"}`}>
          <Image
            src={logo}
            width={50}
            height={50}
            alt="Company Logo"
            className="rounded-full"
            priority
          />
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-gray-500"
          aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
        >
          <Menu size={24} />
        </button>
      </div>

      <div
        className={`px-4 text-2xl font-bold mb-8 ${
          isOpen ? "block" : "hidden"
        }`}
      >
        Admin Dashboard
      </div>

      <nav className="flex-1 px-2">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.href} className="relative group">
              <Link
                href={item.href}
                className={`flex items-center p-2 rounded transition-colors duration-200 ${
                  pathname === item.href
                    ? "bg-gray-700"
                    : "hover:bg-gray-700"
                }`}
              >
                <item.icon className="min-w-[20px]" size={20} />
                {isOpen && <span className="ml-2">{item.label}</span>}
              </Link>
              {!isOpen && (
                <span
                  className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded
                    opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10"
                >
                  {item.label}
                </span>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}