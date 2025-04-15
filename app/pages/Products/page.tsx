"use client";
import { useState, useEffect } from "react";
import { DashboardLayout } from "@/app/components/DashboardComponents/DashboardLayout";
import ProductsPage from "@/app/components/SidebarComponents/Products";
import ProductsCards from "@/app/components/SidebarComponents/productsCards";
import { Book, Flower, Flower2, Trees } from "lucide-react";
import Link from "next/link";

// Define product interface to match database schema
interface Product {
  id: number;
  productName: string;
  category: string;
  price: number;
  quantity: number;
  description: string;
  imageURL: string;
}

export default function Products() {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  // Fetch products from database
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const result = await window.electronAPI.getProducts();
        if (result.success) {
          setProducts(result.products);
        } else {
          setError(result.error || "Failed to fetch products");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Filter products based on active category
  const filteredProducts =
    activeCategory === "All"
      ? products
      : products.filter((product) => product.category === activeCategory);

  // Handle category click
  const handleCategoryClick = (category: string) => {
    setActiveCategory(category);
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between mx-2 sm:mx-4">
        <div className="flex flex-col justify-start">
          <h1 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-4">Products</h1>
          <p className="text-base sm:text-lg text-gray-700">Manage your product inventory here.</p>
        </div>
        {/* Add Product Button */}
        <div className="flex justify-start md:justify-end mt-2 md:mt-0">
          <Link
            className="bg-slate-500 text-white px-3 py-2 sm:px-4 sm:py-3 rounded-xl text-sm sm:text-base hover:bg-slate-600 transition-colors"
            href={"/pages/Products/add"}
            passHref>
            + Add Product
          </Link>
        </div>
      </div>
      {/* Categories header */}
      <div className="mx-2 sm:mx-4 mt-5">
        <h1 className="font-semibold text-xl">Categories</h1>
      </div>

      {/* Filters */}
      <div className="flex md:flex-row font-medium gap-4 mt-4 mx-2 sm:mx-4">
        <div
          className={`cursor-pointer p-3 rounded-lg ${
            activeCategory === "All" ? "bg-green-400 text-white" : "bg-gray-200"
          }`}
          onClick={() => handleCategoryClick("All")}
        >
          All
        </div>
        <ProductsPage
          icon={<Book size={20} className="text-green-400" />}
          title="Fruit Trees"
          onClick={() => handleCategoryClick("Fruit Trees")}
          isActive={activeCategory === "Fruit Trees"}
        />
        <ProductsPage
          icon={<Trees size={20} className="text-green-400" />}
          title="Forest"
          onClick={() => handleCategoryClick("Forest")}
          isActive={activeCategory === "Forest"}
        />
        <ProductsPage
          icon={<Flower size={20} className="text-green-400" />}
          title="Flowers"
          onClick={() => handleCategoryClick("Flowers")}
          isActive={activeCategory === "Flowers"}
        />
        <ProductsPage
          icon={<Flower2 size={20} className="text-green-400" />}
          title="Herbs"
          onClick={() => handleCategoryClick("Herbs")}
          isActive={activeCategory === "Herbs"}
        />
      </div>

      {/* Product Cards */}
      <div className="mt-4 mx-2 sm:mx-4">
        {loading && <p className="text-center text-gray-600">Loading products...</p>}
        {error && <p className="text-center text-red-600">{error}</p>}
        {!loading && !error && filteredProducts.length === 0 && (
          <p className="text-center text-gray-600">No products found.</p>
        )}
        <div className="grid md:grid-cols-4 lg:grid-cols-5 sm:grid-cols-2 max-w-5xl gap-4">
          {filteredProducts.map((product) => (
            <ProductsCards
              key={product.id}
              image={product.imageURL || "/placeholder.jpg"}
              title={product.productName}
              description={product.description}
              quantity={product.quantity}
              pricePerProduct={`M${product.price.toFixed(2)}`}
            />
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}