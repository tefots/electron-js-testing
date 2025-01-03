"use client";

import { Bell, SearchIcon, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import React, { useState, useEffect} from 'react'

export function DashboardHeader() {
  const [categories, setCategories]= useState([
    'Fruit Trees', 'Forest Trees', 'Flowers'
  ]);
  const [selectedCategory, setSelectedCategory] = useState ('');
  const [results, setResults] = useState([]);

  const handleCategoryChange = (category: React.SetStateAction<string>) => {
    setSelectedCategory(category);

    //code to fetch product based on the category selected
    

  }
  return (
    <header className="bg-white shadow-sm p-4">
      <div className="flex flex-col md:flex-row justify-between items-center">
        <h1 className="text-2xl font-semibold">Lesotho Nursery Shop</h1>
        <div className="flex flex-col md:flex-row   mx-5 rounded-xl">
            <div className="p-1 ">
              <input 
               type='text'
               placeholder='Search by category / name'
               className="border-slate-200 border rounded-lg text-start p-2"
               />               
            </div>

            <div className='px-2'>
              <select 
              id="category"
              value={selectedCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="w-full h-10 mt-1 ps-2 pr-2 rounded-lg bg-slate-100">
                <option value={""}>Select Category</option>
                {categories.map((cat, index) => (
                  <option key={index} value={cat}>{cat}</option>
                ))}
              
              </select>
            </div>
            {/* search icon */}
            <div className="px-2 p-3  ">
                <SearchIcon className="h-" />
            </div>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon">
            <Bell size={20} />
          </Button>
          <Button variant="ghost" size="icon">
            <User size={20} />
          </Button>
        </div>
      </div>
    </header>
  )
}

