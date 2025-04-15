"use client";
import { useState, useEffect } from "react";
import { DashboardLayout } from "@/app/components/DashboardComponents/DashboardLayout";
import ProductsPage from "@/app/components/SidebarComponents/Products";
import ProductsCards from "@/app/components/SidebarComponents/productsCards";
import { Book, Flower, Flower2, Trees, Undo2 } from "lucide-react";
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

interface DeletedProduct {
  product: Product;
  imagePath: string;
}

export default function Products() {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [deletedProducts, setDeletedProducts] = useState<DeletedProduct[]>([]);
  const [showUndo, setShowUndo] = useState<boolean>(false);

  // Fetch products from database
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

  useEffect(() => {
    fetchProducts();
  }, []);

  // Handle product deletion
  const handleDelete = async (id: number) => {
    try {
      const productToDelete = products.find((p) => p.id === id);
      if (!productToDelete) {
        setError("Product not found");
        return;
      }

      const result = await window.electronAPI.deleteProduct(id);
      if (result.success) {
        setDeletedProducts((prev) => [
          ...prev,
          { product: productToDelete, imagePath: productToDelete.imageURL },
        ]);
        setShowUndo(true);
        setTimeout(() => setShowUndo(false), 5000);

        await fetchProducts();
        setSelectedProducts((prev) => prev.filter((pid) => pid !== id));
      } else {
        setError(result.error || "Failed to delete product");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  // Handle bulk deletion
  const handleBulkDelete = async () => {
    if (selectedProducts.length === 0) return;
    if (!confirm(`Are you sure you want to delete ${selectedProducts.length} product(s)?`)) return;

    try {
      const deleted: DeletedProduct[] = [];
      for (const id of selectedProducts) {
        const productToDelete = products.find((p) => p.id === id);
        if (productToDelete) {
          const result = await window.electronAPI.deleteProduct(id);
          if (result.success) {
            deleted.push({ product: productToDelete, imagePath: productToDelete.imageURL });
          }
        }
      }
      setDeletedProducts((prev) => [...prev, ...deleted]);
      setShowUndo(true);
      setTimeout(() => setShowUndo(false), 5000);
      await fetchProducts();
      setSelectedProducts([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  // Handle undo deletion
  const handleUndo = async () => {
    if (deletedProducts.length === 0) return;

    try {
      for (const { product } of deletedProducts) {
        const productData = {
          productName: product.productName,
          category: product.category,
          price: product.price,
          quantity: product.quantity,
          description: product.description,
          imageURL: product.imageURL,
          creationDate: new Date().toISOString(),
        };
        await window.electronAPI.addProduct(productData);
      }
      setDeletedProducts([]);
      setShowUndo(false);
      await fetchProducts();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  // Toggle product selection
  const toggleProductSelection = (id: number) => {
    setSelectedProducts((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
    );
  };

  // Filter products based on active category
  const filteredProducts =
    activeCategory === "All"
      ? products
      : products.filter((product) => product.category === activeCategory);

  // Handle category click
  const handleCategoryClick = (category: string) => {
    setActiveCategory(category);
    setSelectedProducts([]);
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between mx-2 sm:mx-4">
        <div className="flex flex-col justify-start">
          <h1 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-4">Products</h1>
          <p className="text-base sm:text-lg text-gray-700">Manage your product inventory here.</p>
        </div>
        <div className="flex flex-col sm:flex-row justify-start md:justify-end mt-2 md:mt-0 gap-2">
          {selectedProducts.length > 0 && (
            <button
              onClick={handleBulkDelete}
              className="bg-red-500 text-white px-3 py-2 rounded-xl text-sm sm:text-base hover:bg-red-600 transition-colors"
            >
              Delete Selected ({selectedProducts.length})
            </button>
          )}
          <Link
            className="bg-slate-500 text-white px-3 py-2 rounded-xl text-sm sm:text-base hover:bg-slate-600 transition-colors"
            href={"/pages/Products/add"}
            passHref
          >
            + Add Product
          </Link>
        </div>
      </div>
      {/* Categories header */}
      <div className="mx-2 sm:mx-4 mt-5">
        <h1 className="font-semibold text-xl">Categories</h1>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap font-medium gap-4 mt-4 mx-2 sm:mx-4">
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

      {/* Undo Notification */}
      {showUndo && (
        <div className="fixed bottom-4 right-4 sm:right-6 bg-gray-800 text-white p-3 sm:p-4 rounded-lg shadow-lg flex items-center gap-2 max-w-xs sm:max-w-sm">
          <span className="text-sm sm:text-base">Product(s) deleted</span>
          <button
            onClick={handleUndo}
            className="flex items-center gap-1 bg-blue-500 text-white px-2 py-1 sm:px-3 sm:py-1 rounded hover:bg-blue-600 transition-colors"
          >
            <Undo2 size={14} className="sm:size-16" />
            <span className="text-sm sm:text-base">Undo</span>
          </button>
        </div>
      )}

      {/* Product Cards */}
      <div className="mt-4 mx-2 sm:mx-4">
        {loading && <p className="text-center text-gray-600">Loading products...</p>}
        {error && <p className="text-center text-red-600">{error}</p>}
        {!loading && !error && filteredProducts.length === 0 && (
          <p className="text-center text-gray-600">No products found.</p>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-7xl mx-auto">
          {filteredProducts.map((product) => (
            <div key={product.id} className="relative">
              <input
                type="checkbox"
                checked={selectedProducts.includes(product.id)}
                onChange={() => toggleProductSelection(product.id)}
                className="absolute top-3 left-3 sm:top-4 sm:left-4 h-4 w-4 sm:h-5 sm:w-5 accent-blue-500"
              />
              <ProductsCards
                id={product.id}
                image={product.imageURL || "/placeholder.jpg"}
                title={product.productName}
                description={product.description}
                pricePerProduct={product.price.toFixed(1)}
                onDelete={handleDelete}
              />
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}