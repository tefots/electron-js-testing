'use client';

import { DashboardLayout } from "@/app/components/DashboardComponents/DashboardLayout";
import Image from "next/image";
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

interface TransactionData {
  items: { productName: string; quantity: number }[]; // Updated to store only productName and quantity
  subtotal: number;
  discount: number;
  total: number;
  gst: number;
  paymentMethod: string;
  amountPaid: number;
  change: number;
  customerName?: string;
  phoneNumber?: string;
  cardNumber?: string;
  transactionDate: string;
  loggedInUser: number; // Stores userId
}

const POSPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]); // Initialize with empty array
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "card" | "digital" | "">("");
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [amountPaid, setAmountPaid] = useState<number | "">("");
  const [customerName, setCustomerName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [receiptData, setReceiptData] = useState<TransactionData | null>(null);
  const [loggedInUser, setLoggedInUser] = useState<number | null>(null);
  // Load cart from localStorage on client side
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedCart = localStorage.getItem("cart");
      if (savedCart) {
        try {
          setCart(JSON.parse(savedCart));
        } catch (error) {
          console.error("Error parsing cart from localStorage:", error);
          setCart([]);
        }
      }
    }
  }, []);

  // Load logged-in user ID from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem("loggedInUser");
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          console.log("POSPage parsed user:", parsedUser);
          if (parsedUser.id) {
            setLoggedInUser(Number(parsedUser.id));
          } else {
            console.error("User ID not found in localStorage");
            setLoggedInUser(null);
          }
        } catch (error) {
          console.error("Error parsing loggedInUser:", error);
          setLoggedInUser(null);
        }
      } else {
        console.error("No loggedInUser found in localStorage");
        setLoggedInUser(null);
      }
    }
  }, []);

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

  // Save transaction to database
  const saveTransactionToDatabase = async (transaction: TransactionData) => {
    try {
      const result = await window.electronAPI.insertTransaction({
        items: JSON.stringify(transaction.items), // JSON string of [{ productName, quantity }]
        subtotal: transaction.subtotal,
        discount: transaction.discount,
        total: transaction.total,
        gst: transaction.gst,
        paymentMethod: transaction.paymentMethod,
        amountPaid: transaction.amountPaid,
        change: transaction.change,
        customerName: transaction.customerName || null,
        phoneNumber: transaction.phoneNumber || null,
        cardNumber: transaction.cardNumber || null,
        transactionDate: transaction.transactionDate,
        loggedInUser: transaction.loggedInUser,
      });
      if (!result.success) {
        throw new Error(result.error || "Failed to save transaction");
      }
      toast.success("Transaction saved to database!");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred while saving transaction";
      toast.error(errorMessage);
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

  const calculateGST = () => (calculateTotal() * 0.07).toFixed(2);

  const totalWithGST = () => (calculateTotal() + parseFloat(calculateGST())).toFixed(2);

  const handleCheckout = () => {
    if (cart.length === 0) {
      toast.error("Cart is empty!");
      return;
    }
    if (!loggedInUser) {
      toast.error("No logged-in user found. Please log in again.");
      return;
    }
    setShowPaymentModal(true);
  };

  const handlePayment = async () => {
    if (!paymentMethod) {
      toast.error("Please select a payment method");
      return;
    }
    if (!loggedInUser) {
      toast.error("No logged-in user found. Please log in again.");
      return;
    }

    const totalDue = parseFloat(totalWithGST());
    if ((paymentMethod === "cash" || paymentMethod === "digital") && (!amountPaid || amountPaid < totalDue)) {
      toast.error(`Amount paid (M${amountPaid}) must be at least M${totalDue}`);
      return;
    }

    if (paymentMethod === "digital" && (!customerName || !phoneNumber)) {
      toast.error("Please provide customer name and phone number for digital payments");
      return;
    }

    if (paymentMethod === "card" && !cardNumber) {
      toast.error("Please provide a card number for card payments");
      return;
    }

    setPaymentProcessing(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Payment successful!");

      const change = paymentMethod === "card" ? 0 : (amountPaid as number) - totalDue;

      const transactionData: TransactionData = {
        items: cart.map((item) => ({
          productName: item.productName,
          quantity: item.quantity,
        })),
        subtotal: calculateSubtotal(),
        discount: calculateDiscount(),
        total: calculateTotal(),
        gst: parseFloat(calculateGST()),
        paymentMethod: paymentMethod,
        amountPaid: paymentMethod === "card" ? totalDue : (amountPaid as number),
        change: change,
        transactionDate: new Date().toISOString(),
        loggedInUser: loggedInUser, 
        ...(paymentMethod === "digital" && {
          customerName: customerName,
          phoneNumber: phoneNumber,
        }),
        ...(paymentMethod === "card" && {
          cardNumber: cardNumber,
        }),
      };


      // Save receipt data for display
      setReceiptData(transactionData);

      // Save transaction to database
      await saveTransactionToDatabase(transactionData);

      // Clear cart and reset state
      setCart([]);
      localStorage.removeItem("cart");
      setShowPaymentModal(false);
      setShowReceiptModal(true);
      setPaymentMethod("");
      setAmountPaid("");
      setCustomerName("");
      setPhoneNumber("");
      setCardNumber("");
    } catch (error) {
      toast.error("Payment failed. Please try again.");
      console.log(error);

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
                    <div className="relative w-full aspect-square">
                            <Image
                                src={product.imageURL}
                                alt={product.productName}
                                layout="fill"
                                objectFit="cover"
                              />
                            </div>

                    {/* <Image
                      src={product.imageURL}
                      alt={product.productName}
                      className="w-full h-32 object-cover rounded-md"
                      layout="fill"
                    /> */}
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
              <p className="mb-4">Total Amount: M{totalWithGST()}</p>
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
                  <option value="digital">M-pesa</option>
                  <option value="digital">Eco-Cash</option>
                </select>
              </div>
              {paymentMethod === "card" && (
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Card Number</label>
                  <input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              )}
              {(paymentMethod === "cash" || paymentMethod === "digital") && (
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Amount Paid</label>
                  <input
                    type="number"
                    placeholder="Enter amount"
                    value={amountPaid}
                    onChange={(e) => setAmountPaid(e.target.value ? parseFloat(e.target.value) : "")}
                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              )}
              {paymentMethod === "digital" && (
                <>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Customer Name</label>
                    <input
                      type="text"
                      placeholder="Enter customer name"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Phone Number</label>
                    <input
                      type="text"
                      placeholder="Enter phone number"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </>
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

        {/* Receipt Modal */}
        {showReceiptModal && receiptData && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg max-w-md w-full font-mono text-sm">
              <div className="text-center">
                <h1 className="font-bold">Lesotho Nursery Shop</h1>
                <p>Refund no: SB1005 Date: {new Date().toLocaleDateString()}</p>
                <p>Processed by: {receiptData.loggedInUser}</p>
              </div>

              <div className="mt-4">
                <div className="flex justify-between font-bold border-b border-t py-1">
                  <span>Qty</span>
                  <span>Description</span>
                  <span>Amount</span>
                </div>
                {receiptData.items.map((item, index) => (
                  <div key={index} className="flex justify-between py-1">
                    <span>{item.quantity}</span>
                    <span>
                      {item.productName}
                      <br />
                      @{products.find((p) => p.productName === item.productName)?.price.toFixed(2) || "0.00"} each
                    </span>
                    <span>
                      {(
                        (products.find((p) => p.productName === item.productName)?.price || 0) * item.quantity
                      ).toFixed(2)}
                    </span>
                  </div>
                ))}
                {receiptData.discount > 0 && (
                  <div className="flex justify-between py-1">
                    <span></span>
                    <span>Less {((receiptData.discount / receiptData.subtotal) * 100).toFixed(0)}% Discount</span>
                    <span>-{receiptData.discount.toFixed(2)}</span>
                  </div>
                )}
              </div>

              <div className="mt-4 border-t pt-2">
                <div className="flex justify-between">
                  <span>TOTAL (inclusive of GST):</span>
                  <span>{(receiptData.total + receiptData.gst).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>GST @ 7%:</span>
                  <span>{receiptData.gst.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Paid by:</span>
                  <span>
                    {receiptData.paymentMethod === "card"
                      ? "Credit Card"
                      : receiptData.paymentMethod === "cash"
                      ? "Cash"
                      : "Digital"}
                  </span>
                </div>
                {receiptData.paymentMethod === "digital" && (
                  <>
                    <div className="flex justify-between">
                      <span>Customer Name:</span>
                      <span>{receiptData.customerName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Phone Number:</span>
                      <span>{receiptData.phoneNumber}</span>
                    </div>
                  </>
                )}
                {receiptData.paymentMethod === "card" && (
                  <div className="flex justify-between">
                    <span>Card Number:</span>
                    <span>{receiptData.cardNumber}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Amount Paid:</span>
                  <span>{receiptData.amountPaid.toFixed(2)}</span>
                </div>
                {receiptData.change > 0 && (
                  <div className="flex justify-between">
                    <span>Change:</span>
                    <span>{receiptData.change.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold">
                  <span></span>
                  <span>{(receiptData.total + receiptData.gst).toFixed(2)}</span>
                </div>
              </div>

              <div className="text-center mt-4">
                <p>Thank you!</p>
              </div>

              <div className="flex justify-end mt-4">
                <button
                  onClick={() => setShowReceiptModal(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
                >
                  Close
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