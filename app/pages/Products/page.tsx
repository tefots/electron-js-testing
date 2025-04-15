"use client";
import { useState } from "react";
import { DashboardLayout } from "@/app/components/DashboardComponents/DashboardLayout";
import ProductsPage from "@/app/components/SidebarComponents/Products";
import ProductsCards from "@/app/components/SidebarComponents/productsCards";
import { Book, Flower, Flower2, Trees } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Products() {
  const [activeCategory, setActiveCategory] = useState<string>("All");

  // Define product data
  const products = [
    {
      image: "/n1.jpg",
      title: "Peach Trees",
      description: "Delicious fruit-bearing tree",
      category: "Fruit Trees",
      quantity: 2,
      pricePerProduct: "M99",
    },
    {
      image: "/n1.jpg",
      title: "Maple Tree",
      description: "Beautiful forest tree",
      category: "Forest",
      quantity: 23,
      pricePerProduct: "M80",
    },
    {
      image: "/n3.jpeg",
      title: "Roses",
      description: "Elegant flowers",
      category: "Flowers",
      quantity: 232,
      pricePerProduct: "M70",
    },
    {
      image: "/n1.jpg",
      title: "Lavender",
      description: "Fragrant herb",
      category: "Herbs",
      quantity: 40,
      pricePerProduct: "M75",
    },
  ];

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
    <>
      <DashboardLayout>
        <div className="flex md:flex-row sm:flex-col justify-between">
        <div className="mx-2 flex flex-col justify-start">
          <h1 className="text-2xl font-bold mb-4">Products</h1>
          <p className="text-lg">Manage your product inventory here.</p>
        </div>
        {/* Add Product Button */}
        <div className="flex sm:justify-start justify-end mt-4 ">
            <Link
                className="mx-2  bg-slate-500 text-white p-3 rounded-xl"
                href={"/pages/Products/add"}
                passHref
            >
                + Add Product
            </Link>
        
        </div>
        </div>
        {/* categories header*/}
        <div className="mx-2 mt-5">
            <h1 className="font-semibold text-xl">Categories</h1>
        </div>

        {/* filters */}
        <div className="flex md:flex-row font-medium gap-4 mt-4">
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
        <div className="grid md:grid-cols-4 lg:grid-cols-5 sm:grid-cols-2 mt-4 max-w-5xl gap-4">
          {filteredProducts.map((product, index) => (
            <ProductsCards
              key={index}
              image={
                <Image
                  src={product.image}
                  width={200}
                  height={200}
                  alt={`Image of ${product.title}`}
                />
              }
              title={product.title}
              description={product.description}
              quantity={product.quantity}
              pricePerProduct={product.pricePerProduct}
            />
          ))}
        </div>
      </DashboardLayout>
    </>
  );
}
