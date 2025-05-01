"use client";
import { Card } from "@/components/ui/card";
import { useState } from "react";

interface POSProps {
  image: React.ReactNode;
  title: string;
  price: number;
  icon: React.ReactNode;
}

interface CartItem extends POSProps {
  quantity: number;
}

export default function POSSidebar({
  image,
  title,
  price,
  icon,
}: POSProps) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Add item to the cart
  const addToCart = () => {
    const existingItem = cartItems.find((item) => item.title === title);

    if (existingItem) {
      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.title === title
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCartItems((prevItems) => [
        ...prevItems,
        { image, title, price, icon, quantity: 1 },
      ]);
    }
  };

  // Update quantity
  const updateQuantity = (title: string, action: "add" | "subtract") => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.title === title
          ? {
              ...item,
              quantity: action === "add" ? item.quantity + 1 : Math.max(1, item.quantity - 1),
            }
          : item
      )
    );
  };

  // Remove item from cart
  const removeItem = (title: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.title !== title));
  };

  return (
    <div>
      <button
        onClick={addToCart}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
      >
        Add to Cart
      </button>

      {cartItems.length > 0 ? (
        <div className="space-y-4">
          {cartItems.map((item, index) => (
            <Card key={index} className="flex justify-between p-4">
              <div className="flex items-center space-x-4">
                {item.image}
                <div>
                  <h3 className="text-lg font-bold">{item.title}</h3>
                  <p className="text-sm text-gray-600">Price: ${item.price}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => updateQuantity(item.title, "subtract")}
                  className="bg-gray-200 px-2 py-1 rounded"
                >
                  -
                </button>
                <span>{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.title, "add")}
                  className="bg-gray-200 px-2 py-1 rounded"
                >
                  +
                </button>
                <button
                  onClick={() => removeItem(item.title)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Remove
                </button>
              </div>
            </Card>
          ))}
          <div className="mt-4 text-lg font-bold">
            Total: $
            {cartItems.reduce(
              (total, item) => total + item.price * item.quantity,
              0
            )}
          </div>
        </div>
      ) : (
        <p className="text-gray-600">No items in the cart.</p>
      )}
    </div>
  );
}
