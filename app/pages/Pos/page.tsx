"use client";

import { DashboardLayout } from "@/app/components/DashboardComponents/DashboardLayout";
import { useState } from "react";

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
}

interface CartItem extends Product {
  quantity: number;
  discount: number;
}

const POSPage = () => {
  const [products] = useState<Product[]>([
    { id: 1, name: "Schezwan Egg Noodles", price: 25, image: "/noodles.jpg" },
    { id: 2, name: "Stir Egg Fry Udon Noodles", price: 24, image: "/udon.jpg" },
    { id: 3, name: "Thai Style Fried Noodles", price: 24, image: "/thai.jpg" },
    { id: 4, name: "Chinese Prawn Spaghetti", price: 24, image: "/spaghetti.jpg" },
    { id: 5, name: "Japanese Soba Noodles", price: 24, image: "/soba.jpg" },
    { id: 6, name: "Chilli Garlic Thai Noodles", price: 24, image: "/chilli.jpg" },
  ]);

  const [cart, setCart] = useState<CartItem[]>([]);

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
    setCart(cart.filter((item) => item.id !== id));
  };

  const calculateSubtotal = () =>
    cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const calculateDiscount = () =>
    cart.reduce((acc, item) => acc + (item.price * item.discount) / 100, 0);

  const calculateTotal = () => calculateSubtotal() - calculateDiscount();

  return (
    <DashboardLayout>
      <div className="flex">
      {/* Product Grid */}
      <div className="w-2/3 p-4 grid grid-cols-3 gap-4">
        {products.map((product) => (
          <div
            key={product.id}
            className="border rounded-lg p-4 flex flex-col items-center"
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-32 object-cover rounded-md"
            />
            <h3 className="mt-2 text-lg font-semibold">{product.name}</h3>
            <p className="text-gray-500">${product.price.toFixed(2)}</p>
            <button
              onClick={() => addToCart(product)}
              className="mt-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>

      {/* Order Summary */}
      <div className="w-1/3 p-4 border-l">
        <h2 className="text-xl font-bold mb-4">Order Summary</h2>
        {cart.length > 0 ? (
          <div className="space-y-4">
            {cart.map((item) => (
              <div key={item.id} className="flex items-center space-x-4">
                <div className="flex-grow">
                  <h3 className="text-lg font-semibold">{item.name}</h3>
                  <p className="text-sm text-gray-500">
                    ${item.price.toFixed(2)}
                  </p>
                </div>
                <input
                  type="number"
                  value={item.quantity}
                  min={1}
                  onChange={(e) =>
                    updateQuantity(item.id, parseInt(e.target.value))
                  }
                  className="w-16 border rounded-md text-center"
                />
                <input
                  type="number"
                  value={item.discount}
                  min={0}
                  onChange={(e) =>
                    updateDiscount(item.id, parseInt(e.target.value))
                  }
                  className="w-16 border rounded-md text-center"
                  placeholder="Discount %"
                />
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-red-500"
                >
                  Remove
                </button>
              </div>
            ))}

            <div className="mt-4 border-t pt-4">
              <p>Subtotal: ${calculateSubtotal().toFixed(2)}</p>
              <p>Discount: ${calculateDiscount().toFixed(2)}</p>
              <p className="font-bold">Total: ${calculateTotal().toFixed(2)}</p>
            </div>
            <button className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600">
              Proceed
            </button>
          </div>
        ) : (
          <p>Your cart is empty.</p>
        )}
      </div>
    </div>
    </DashboardLayout>

  );
};

export default POSPage;
