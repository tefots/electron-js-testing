"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/app/components/DashboardComponents/DashboardLayout';
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

  // setting the state for image
  const [imagePreview, setImagePreview] = useState< string | null>(null);
  const [imageFile, setImagefile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {

    const file = e.target.files?.[0];

    if(file){
      setImagefile(file);
      setImagePreview(URL.createObjectURL(file)); //Generate a preview
    }
  };


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // handle submit function
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    const formDataObj = new FormData();
    formDataObj.append('productName', formData.organizer);
    formDataObj.append('quantity', formData.organizerEmail);
    formDataObj.append('price', formData.website);
    if (imageFile) {
      formDataObj.append('imagePath', imageFile);
    }
  
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        body: formDataObj,
      });
  
      if (response.ok) {
        alert('Product added successfully');
        router.push('/Dashboard/Products'); // Redirect to dashboard
      } else {
        alert('Failed to add product');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  

  return (
    <DashboardLayout >
    <div className="flex items-center justify-center min-h-screen ">
      <form onSubmit={handleSubmit} className="space-y-4 w-1/2 bg-white p-8 rounded-lg shadow-xl text-center bottom-0">
      <h1 className="text-2xl text-slate-700 font-bold mb-4">Add Product</h1>
     
        <input
          type="text"
          name="productName"
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
          className="w-full border p-3 rounded-lg"
          required
        />
        <input
          type="number"
          name="organizerEmail"
          placeholder="Quantity"
          value={formData.organizerEmail}
          onChange={handleChange}
          className="w-full border p-3 rounded-lg"
          required />
          
          <input
          type="number"
          name="price"
          placeholder="Price of each product"
          value={formData.website}
          onChange={handleChange}
          className="w-full border p-3 rounded-lg"
        />

        <input
        type="file"
          name="product-image"
          accept="image/*"
          value={formData.description}
          onChange={handleFileChange}
          className="w-full border p-3 rounded-lg"
        />
        {imagePreview && <img src={imagePreview}
          alt="Image preview"
          className="mb-4"
          />  
      }
       
        <button
          type="submit"
          className="bg-slate-600 rounded-xl hover:bg-green-400 text-white px-4 py-2 ">
          Add Product
        </button>
      </form>
    </div>
    </DashboardLayout>
  );
};

export default CreateHackathon;
