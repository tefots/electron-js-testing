"use client";

import { DashboardLayout } from "@/app/components/DashboardComponents/DashboardLayout";
import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export interface ProductData {
  productName: string;
  category: string;
  price: string;
  quantity: string;
  description: string;
  imageURL: string;
  creationDate: string;
}

interface Product {
  id: number;
  productName: string;
  category: string;
  price: number;
  imageURL: string;
  description: string;
}

interface CartItem extends Product {
  quantity: number;
  discount: number;
}

const POSPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "card" | "digital" | "">("");
  const [paymentProcessing, setPaymentProcessing] = useState(false);

  // Fetch products from database
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const result = await window.electronAPI.getProducts();
      if (result.success) {
        const transformedProducts = result.products.map((item: ProductData, index: number) => ({
          id: index + 1,
          productName: item.productName,
          category: item.category,
          price: parseFloat(item.price),
          imageURL: item.imageURL,
          description: item.description,
        }));
        setProducts(transformedProducts);
      } else {
        setError(result.error || "Failed to fetch products");
        toast.error(result.error || "Failed to fetch products");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const categories = ["All", ...new Set(products.map((p) => p.category))];

  const filteredProducts = products.filter(
    (product) =>
      product.productName.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (activeCategory === "All" || product.category === activeCategory)
  );

  const addToCart = (product: Product) => {
    const existingItem = cart.find((item) => item.id === product.id);
    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([...cart, { ...product, quantity: 1, discount: 0 }]);
    }
    toast.success(`${product.productName} added to cart!`);
  };

  const updateQuantity = (id: number, quantity: number) => {
    setCart(
      cart.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(quantity, 1) } : item
      )
    );
  };

  const updateDiscount = (id: number, discount: number) => {
    setCart(
      cart.map((item) =>
        item.id === id ? { ...item, discount: Math.max(discount, 0) } : item
      )
    );
  };

  const removeFromCart = (id: number) => {
    const item = cart.find((item) => item.id === id);
    setCart(cart.filter((item) => item.id !== id));
    toast.info(`${item?.productName} removed from cart`);
  };

  const calculateItemSubtotal = (item: CartItem) =>
    item.price * item.quantity * (1 - item.discount / 100);

  const calculateSubtotal = () =>
    cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const calculateDiscount = () =>
    cart.reduce((acc, item) => acc + (item.price * item.quantity * item.discount) / 100, 0);

  const calculateTotal = () => calculateSubtotal() - calculateDiscount();

  const handleCheckout = () => {
    if (cart.length === 0) {
      toast.error("Cart is empty!");
      return;
    }
    setShowPaymentModal(true);
  };

  const handlePayment = async () => {
    if (!paymentMethod) {
      toast.error("Please select a payment method");
      return;
    }

    setPaymentProcessing(true);
    try {
      // Replace this with your actual payment API call via Electron
      // Example: const result = await window.electronAPI.processPayment({ cart, paymentMethod, total: calculateTotal() });
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Mock payment processing
      toast.success("Payment successful!");
      setCart([]);
      localStorage.removeItem("cart");
      setShowPaymentModal(false);
      setPaymentMethod("");
    } catch (err) {
      toast.error("Payment failed. Please try again.");
    } finally {
      setPaymentProcessing(false);
    }
  };

  return (
    <DashboardLayout>
      <ToastContainer position="top-right" autoClose={2000} />
      <div className="flex flex-col h-full">
        {/* Search and Filter */}
        <div className="p-4 bg-gray-50 border-b">
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <select
              value={activeCategory}
              onChange={(e) => setActiveCategory(e.target.value)}
              className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 w-full sm:w-auto"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
          {/* Product Grid */}
          <div className="w-full md:w-2/3 p-4 overflow-y-auto">
            {loading ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Loading products...</p>
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <p className="text-red-500">{error}</p>
                <button
                  onClick={fetchProducts}
                  className="mt-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                >
                  Retry
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="border rounded-lg p-4 flex flex-col items-center bg-white shadow-sm hover:shadow-md transition-shadow"
                  >
                    <img
                      src={product.imageURL}
                      alt={product.productName}
                      className="w-full h-32 object-cover rounded-md"
                    />
                    <h3 className="mt-2 text-lg font-semibold">{product.productName}</h3>
                    <p className="text-gray-500">M{product.price.toFixed(2)}</p>
                    <p className="text-sm text-gray-400">{product.category}</p>
                    <p className="text-sm text-gray-500 truncate w-full text-center">
                      {product.description}
                    </p>
                    <button
                      onClick={() => addToCart(product)}
                      className="mt-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                    >
                      Add to Cart
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="w-full md:w-1/3 p-4 border-l bg-gray-50 flex flex-col">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            {cart.length > 0 ? (
              <div className="flex flex-col flex-1">
                <div className="space-y-4 overflow-y-auto flex-1 max-h-[50vh] pr-2">
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4 bg-white p-3 rounded-md">
                      <div className="flex-grow">
                        <h3 className="text-lg font-semibold">{item.productName}</h3>
                        <p className="text-sm text-gray-500">
                          M{item.price.toFixed(2)} x {item.quantity} = M
                          {(item.price * item.quantity).toFixed(2)}
                        </p>
                        <p className="text-sm text-green-600">
                          Discount: {item.discount}% = M
                          {((item.price * item.quantity * item.discount) / 100).toFixed(2)}
                        </p>
                        <p className="font-semibold">
                          Subtotal: M{calculateItemSubtotal(item).toFixed(2)}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                        >
                          -
                        </button>
                        <input
                          type="number"
                          value={item.quantity}
                          min={1}
                          onChange={(e) =>
                            updateQuantity(item.id, parseInt(e.target.value))
                          }
                          className="w-16 border rounded-md text-center"
                        />
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                        >
                          +
                        </button>
                      </div>
                      <input
                        type="number"
                        value={item.discount}
                        min={0}
                        max={100}
                        onChange={(e) =>
                          updateDiscount(item.id, parseInt(e.target.value))
                        }
                        className="w-16 border rounded-md text-center"
                        placeholder="%"
                      />
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
                <div className="mt-4 border-t pt-4 bg-gray-50 sticky bottom-0">
                  <p>Subtotal: M{calculateSubtotal().toFixed(2)}</p>
                  <p>Discount: M{calculateDiscount().toFixed(2)}</p>
                  <p className="font-bold text-lg">
                    Total: M{calculateTotal().toFixed(2)}
                  </p>
                  <button
                    onClick={handleCheckout}
                    className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-colors mt-4"
                  >
                    Proceed to Checkout
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-gray-500">Your cart is empty.</p>
            )}
          </div>
        </div>

        {/* Payment Modal */}
        {showPaymentModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg max-w-md w-full">
              <h2 className="text-xl font-bold mb-4">Complete Payment</h2>
              <p className="mb-4">Total Amount: ${calculateTotal().toFixed(2)}</p>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Payment Method</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as "cash" | "card" | "digital")}
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Select Payment Method</option>
                  <option value="cash">Cash</option>
                  <option value="card">Credit/Debit Card</option>
                  <option value="digital">Digital Payment (UPI, etc.)</option>
                </select>
              </div>
              {paymentMethod === "card" && (
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Card Number</label>
                  <input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              )}
              {paymentMethod === "cash" && (
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Cash Received</label>
                  <input
                    type="number"
                    placeholder="Enter amount"
                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              )}
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
                  disabled={paymentProcessing}
                >
                  Cancel
                </button>
                <button
                  onClick={handlePayment}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-green-300"
                  disabled={paymentProcessing}
                >
                  {paymentProcessing ? "Processing..." : "Confirm Payment"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default POSPage;