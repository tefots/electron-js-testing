"use client";

import { DashboardLayout } from "@/app/components/DashboardComponents/DashboardLayout";
import { useEffect, useState, useMemo } from "react";
import { FaSearch } from "react-icons/fa";

interface Transaction {
  id: number;
  items: string;
  subtotal: number;
  discount: number;
  total: number;
  gst: number;
  paymentMethod: "cash" | "card" | "digital";
  amountPaid: number;
  change: number;
  customerName: string;
  phoneNumber: string;
  cardNumber: string;
  transactionDate: string;
  loggedInUser: number;
}

interface User {
  id: number;
  username: string;
}

const TransactionsPage = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const transactionsPerPage = 5;

  // Fetch all users
  const fetchUsers = async () => {
    try {
      const result = await window.electronAPI.fetchUsers();
      if (!result.success) {
        throw new Error(result.error || "Failed to fetch users");
      }
      setUsers(result.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // Fetch transactions for selected user
  const fetchTransactions = async (userId: number | null) => {
    setLoading(true);
    try {
      const result = await window.electronAPI.getTransactions(userId);
      if (result.success) {
        setTransactions(result.data || []);
      } else {
        console.error("Error fetching transactions:", result.error);
        setTransactions([]);
      }
    } catch (error) {
      console.error("Error:", error);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch users and transactions initially
  useEffect(() => {
    fetchUsers();
    fetchTransactions(selectedUserId);
  }, []);

  // Refetch transactions when selectedUserId changes
  useEffect(() => {
    fetchTransactions(selectedUserId);
  }, [selectedUserId]);

  const filteredTransactions = useMemo(
    () =>
      transactions.filter(
        (transaction) =>
          transaction.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          transaction.paymentMethod.toLowerCase().includes(searchQuery.toLowerCase()) ||
          transaction.transactionDate.includes(searchQuery)
      ),
    [transactions, searchQuery]
  );

  const indexOfLastTransaction = currentPage * transactionsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
  const currentTransactions = filteredTransactions.slice(
    indexOfFirstTransaction,
    indexOfLastTransaction
  );

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleString("en-GB", options);
  };

  const getStatusBadge = (paymentMethod: string) => {
    if (paymentMethod === "cash" || paymentMethod === "card" || paymentMethod === "digital") {
      return (
        <span className="bg-green-200 text-green-800 text-xs font-semibold px-2 py-1 rounded-full">
          Successful
        </span>
      );
    } else {
      return (
        <span className="bg-red-200 text-red-800 text-xs font-semibold px-2 py-1 rounded-full">
          Unsuccessful
        </span>
      );
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Transactions List</h1>

        {/* Dropdown to select user */}
        <div className="flex items-center mb-6 gap-4">
          <select
            className="border p-2 rounded-lg"
            value={selectedUserId ?? undefined}
            onChange={(e) => {
              const value = e.target.value;
              setSelectedUserId(value ? parseInt(value) : null);
              setCurrentPage(1);
            }}
          >
            <option value="">All Users</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.username} (ID: {user.id})
              </option>
            ))}
          </select>

          {/* Search input */}
          <div className="flex items-center gap-2 w-full">
            <input
              type="text"
              placeholder="Search by customer name, payment method, date..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border p-2 rounded-lg w-full"
            />
            <button className="p-2 bg-purple-600 text-white rounded-lg">
              <FaSearch />
            </button>
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div>Loading transactions...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="p-3">Transaction ID</th>
                  <th className="p-3">Date/Time</th>
                  <th className="p-3">Customer Name</th>
                  <th className="p-3">Payment Method</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Bill Amount</th>
                  <th className="p-3">Discount</th>
                  <th className="p-3">Nett Amount</th>
                  <th className="p-3">Details</th>
                </tr>
              </thead>
              <tbody>
                {currentTransactions.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="p-3 text-center">
                      No transactions found
                    </td>
                  </tr>
                ) : (
                  currentTransactions.map((transaction) => (
                    <tr key={transaction.id} className="border-b">
                      <td className="p-3">{transaction.id}</td>
                      <td className="p-3">{formatDate(transaction.transactionDate)}</td>
                      <td className="p-3">{transaction.customerName || "Guest"}</td>
                      <td className="p-3 capitalize">{transaction.paymentMethod}</td>
                      <td className="p-3">{getStatusBadge(transaction.paymentMethod)}</td>
                      <td className="p-3">MYR {transaction.subtotal.toFixed(2)}</td>
                      <td className="p-3">{transaction.discount}%</td>
                      <td className="p-3">MYR {transaction.total.toFixed(2)}</td>
                      <td className="p-3">
                        <button className="bg-yellow-400 px-2 py-1 rounded-md text-white text-sm">
                          Details
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        <div className="flex justify-center mt-6">
          {Array.from(
            { length: Math.ceil(filteredTransactions.length / transactionsPerPage) },
            (_, index) => (
              <button
                key={index + 1}
                onClick={() => paginate(index + 1)}
                className={`mx-1 px-3 py-1 rounded-lg ${
                  currentPage === index + 1 ? "bg-purple-600 text-white" : "bg-gray-200"
                }`}
              >
                {index + 1}
              </button>
            )
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TransactionsPage;