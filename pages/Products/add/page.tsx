"use client";

import { useState } from "react";
import { DashboardLayout } from "@/app/components/DashboardComponents/DashboardLayout";

// Define the shape of the response from the Electron API
export interface addProductResponse {
  success: boolean;
  id?: number;
  error?: string;
}

// Define the shape of the product data to be sent to Electron API
export interface ProductData {
  productName: string;
  category: string;
  price: string;
  quantity: string;
  description: string;
  imageURL: string;
  creationDate: string;
}

const AddProduct = () => {
  const [productName, setProductName] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [quantity, setQuantity] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [imageURL, setImageUrl] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | null>(null); // State for selected image file
  const [message, setMessage] = useState<string>("");
  const [messageType, setMessageType] = useState<"success" | "error" | "">("");

  // Handle file input change
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type (optional)
      if (!file.type.startsWith("image/")) {
        setMessage("Please select an image file.");
        setMessageType("error");
        e.target.value = ""; // Reset input
        return;
      }
      setImageFile(file);
      setImageUrl(file.name); // Temporary placeholder; actual URL will come from backend
      if (message) {
        setMessage("");
        setMessageType("");
        console.log(imageURL)
      }
    }
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    try {
      let savedImageURL = "";
      if (imageFile) {
        const imageResult = await window.electronAPI.saveProductImage(imageFile);
        if (imageResult.success) {
          savedImageURL = imageResult.imageURL;
        } else {
          setMessage(imageResult.error || "Failed to save image");
          setMessageType("error");
          return;
        }
      }
  
      const productData: ProductData = {
        productName,
        category,
        price,
        quantity,
        description,
        imageURL: savedImageURL,
        creationDate: new Date().toISOString(),
      };
  
      const result = await window.electronAPI.addProduct(productData);
  
      if (result.success) {
        setMessage("Product was created successfully!");
        setMessageType("success");
        setProductName("");
        setCategory("");
        setPrice("");
        setQuantity("");
        setDescription("");
        setImageUrl("");
        setImageFile(null);
        (document.getElementById("image") as HTMLInputElement).value = "";
        
        // Clear message after 1 minute (60,000 milliseconds)
      const timer = setTimeout(() => {
        setMessage("");
        setMessageType("");
      }, 60000);

      // Cleanup timeout on component unmount
      return () => clearTimeout(timer);
      
      } else {
        if (result.error?.includes("UNIQUE constraint failed: products.productName")) {
          setMessage("This Product is already added in store.");
          setMessageType("error");
        } else {
          setMessage(result.error || "Unknown error");
          setMessageType("error");
        }
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : String(error));
      setMessageType("error");
    }
  };

  const handleInputChange = (field: keyof ProductData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    if (message) {
      setMessage("");
      setMessageType("");
    }
    switch (field) {
      case "productName":
        setProductName(e.target.value);
        break;
      case "category":
        setCategory(e.target.value);
        break;
      case "price":
        setPrice(e.target.value);
        break;
      case "quantity":
        setQuantity(e.target.value);
        break;
      case "description":
        setDescription(e.target.value);
        break;
    }
  };

  return (
    <DashboardLayout>
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="w-full max-w-md bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
            Add Product
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {message && (
              <p
                className={`text-center text-sm mb-4 ${
                  messageType === "error" ? "text-red-600" : "text-green-600"
                }`}
              >
                {message}
              </p>
            )}
            <div>
              <label
                htmlFor="productName"
                className="block text-sm font-medium text-gray-700"
              >
                Product Name
              </label>
              <input
                type="text"
                id="productName"
                value={productName}
                onChange={handleInputChange("productName")}
                required
                className="mt-1 block w-full px-4 py-2 border rounded-md"
              />
            </div>
            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-700"
              >
                Product Category
              </label>
              <select
                id="category"
                value={category}
                onChange={handleInputChange("category")}
                className="mt-1 block w-full px-4 py-2 border rounded-md"
              >
                <option value="">Select a category</option>
                <option value="Flowers">Flowers</option>
                <option value="Fruit Trees">Fruit Trees</option>
                <option value="Fruit Trees">Forest</option>
                <option value="Herbs">Herbs</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="price"
                className="block text-sm font-medium text-gray-700"
              >
                Price
              </label>
              <input
                type="number"
                id="price"
                value={price}
                onChange={handleInputChange("price")}
                required
                min="0"
                step="0.01"
                className="mt-1 block w-full px-4 py-2 border rounded-md"
              />
            </div>
            <div>
              <label
                htmlFor="quantity"
                className="block text-sm font-medium text-gray-700"
              >
                Quantity
              </label>
              <input
                type="number"
                id="quantity"
                value={quantity}
                onChange={handleInputChange("quantity")}
                required
                min="0"
                className="mt-1 block w-full px-4 py-2 border rounded-md"
              />
            </div>
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700"
              >
                Description
              </label>
              <input
                type="text"
                id="description"
                value={description}
                onChange={handleInputChange("description")}
                required
                className="mt-1 block w-full px-4 py-2 border rounded-md"
              />
            </div>
            <div>
              <label
                htmlFor="image"
                className="block text-sm font-medium text-gray-700"
              >
                Product Image
              </label>
              <input
                type="file"
                id="image"
                accept="image/*"
                onChange={handleImageChange}
                className="mt-1 block w-full px-4 py-2 border rounded-md"
              />
              {imageFile && (
                <p className="mt-2 text-sm text-gray-600">
                  Selected: {imageFile.name}
                </p>
              )}
            </div>
            <div>
              <button
                type="submit"
                className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md"
              >
                Add Product
              </button>
              <button
              type="button"
              onClick={() => window.history.back()}
              className="w-full mt-4 px-4 py-2 bg-blue-500 text-white rounded"> Back</button>
            </div>

          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AddProduct;