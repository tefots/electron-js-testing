"use client";

import { Bell, SearchIcon, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";

export function DashboardHeader() {
  const [categories, setCategories] = useState([
    "Fruit Trees",
    "Forest Trees",
    "Flowers",
  ]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [results, setResults] = useState([]);

  const handleCategoryChange = (category: React.SetStateAction<string>) => {
    setSelectedCategory(category);
    // Add logic to fetch products based on the selected category
  };

  return (
    <header className="bg-white shadow-sm p-4 mb-5">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Header Title */}
        <h1 className="text-2xl font-semibold text-gray-800">
          Lesotho Nursery Shop
        </h1>

        {/* Search and Category Selection */}
        <div className="flex flex-col md:flex-row items-center gap-4">
          {/* Search Input */}
          <div className="flex items-center w-full md:w-auto">
            <input
              type="text"
              placeholder="Search by category / name"
              className="w-full md:w-64 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Category Dropdown */}
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

          {/* Search Icon */}
          <div className="flex items-center">
            <button className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <SearchIcon className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Notification and User Icons */}
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" className="p-2">
            <Bell size={20} />
          </Button>
          <Button variant="ghost" size="icon" className="p-2">
            <User size={20} />
          </Button>
        </div>
      </div>
    </header>
  );
}
