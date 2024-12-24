"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
// import { createHackathon } from '../../../../services/hackathonService';

const CreateHackathon = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    hackathonName: '',
    organizer: '',
    organizerEmail: '',
    startDate: '',
    endDate: '',
    location: '',
    description: '',
    website: '',
    registrationLink: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addProduct(formData);
      router.push('/pages/Dash');
    } catch (error) {
      console.error('Error creating hackathon:', error);
      alert('Failed to create hackathon. Please try again.');
    }
  };

  return (
    <div className="container mx-auto p-6 items-center w-1/2 justify-center">
      <h1 className="text-2xl font-bold mb-4">Add Product</h1>
      <form onSubmit={handleSubmit} className="space-y-4 w-1/2 ">
        <input
          type="text"
          name="hackathonName"
          placeholder="name of user"
          value={formData.hackathonName}
          onChange={handleChange}
          className="w-full border p-2 rounded hidden"
          required
        />
        <input
          type="text"
          name="productName"
          placeholder="Product Name"
          value={formData.organizer}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="number"
          name="organizerEmail"
          placeholder="Quantity"
          value={formData.organizerEmail}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

       <label htmlFor="product-image"
       className=""
       >Image</label>

        <input
        type="file"
          name="product-image"
          placeholder="Image of Product"
          value={formData.description}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
          
          <input
          type="number"
          name="price"
          placeholder="Price of each product"
          value={formData.website}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
       
        <button
          type="submit"
          className="bg-purple-500 rounded-xl hover:bg-blue-600 text-white px-4 py-2 "
        >
          Create Hackathon
        </button>
      </form>
    </div>
  );
};

export default CreateHackathon;
