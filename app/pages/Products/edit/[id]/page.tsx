"use client";

import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { DashboardLayout } from "@/app/components/DashboardComponents/DashboardLayout";

interface Product {
  id: number;
  productName: string;
  category: string;
  price: number;
  quantity: number;
  description: string;
  imageURL: string;
}

export default function EditProduct() {
  const router = useRouter();
  const { id } = router.query;
  const [product, setProduct] = useState<Product | null>(null);
  const [productName, setProductName] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [quantity, setQuantity] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [imageURL, setImageURL] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [message, setMessage] = useState<string>("");
  const [messageType, setMessageType] = useState<"success" | "error" | "">("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  // Fetch product on mount
  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const result = await window.electronAPI.getProducts();
        if (result.success) {
          const foundProduct = result.products.find((p: Product) => p.id === parseInt(id as string));
          if (foundProduct) {
            setProduct(foundProduct);
            setProductName(foundProduct.productName);
            setCategory(foundProduct.category);
            setPrice(foundProduct.price.toString());
            setQuantity(foundProduct.quantity.toString());
            setDescription(foundProduct.description);
            setImageURL(foundProduct.imageURL);
          } else {
            setError("Product not found");
          }
        } else {
          setError(result.error || "Failed to fetch product");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // Clear message after 1 minute
  useEffect(() => {
    if (messageType === "success" && message) {
      const timer = setTimeout(() => {
        setMessage("");
        setMessageType("");
      }, 60000);
      return () => clearTimeout(timer);
    }
  }, [messageType, message]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setMessage("Please select an image file.");
        setMessageType("error");
        e.target.value = "";
        return;
      }
      setImageFile(file);
      setImageURL(file.name);
      if (message) {
        setMessage("");
        setMessageType("");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      let savedImageURL = imageURL;
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

      const productData = {
        id: parseInt(id as string),
        productName,
        category,
        price: parseFloat(price),
        quantity: parseInt(quantity),
        description,
        imageURL: savedImageURL,
      };

      const result = await window.electronAPI.updateProduct(productData);

      if (result.success) {
        setMessage("Product updated successfully!");
        setMessageType("success");
        setImageFile(null);
        (document.getElementById("image") as HTMLInputElement).value = "";
      } else {
        if (result.error?.includes("UNIQUE constraint failed: products.productName")) {
          setMessage("This Product name is already in use.");
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

  const handleInputChange = (field: keyof Product) => (
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

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!product) return <p>Product not found</p>;

  return (
    <DashboardLayout>
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="w-full max-w-md bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
            Edit Product
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
              <label className="block text-sm font-medium text-gray-700">
                Product Name
              </label>
              <input
                type="text"
                id="productName"
                value={productName}
                onChange={handleInputChange("productName")}
                required
                className="mt-1 block w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Product Category
              </label>
              <select
                id="category"
                value={category}
                onChange={handleInputChange("category")}
                className="mt-1 block w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a category</option>
                <option value="Flowers">Flowers</option>
                <option value="Fruit Trees">Fruit Trees</option>
                <option value="Herbs">Herbs</option>
                <option value="Forest">Forest</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
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
                className="mt-1 block w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Quantity
              </label>
              <input
                type="number"
                id="quantity"
                value={quantity}
                onChange={handleInputChange("quantity")}
                required
                min="0"
                className="mt-1 block w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <input
                type="text"
                id="description"
                value={description}
                onChange={handleInputChange("description")}
                required
                className="mt-1 block w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Product Image
              </label>
              <input
                type="file"
                id="image"
                accept="image/*"
                onChange={handleImageChange}
                className="mt-1 block w-full px-4 py-2 border rounded-md"
              />
              {imageURL && (
                <p className="mt-2 text-sm text-gray-600">
                  Current Image: {imageURL}
                </p>
              )}
            </div>
            <div className="flex gap-4">
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              >
                Update Product
              </button>
              <button
                type="button"
                onClick={() => router.push("/pages/Products")}
                className="flex-1 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}