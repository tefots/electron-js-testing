"use client";

import { DashboardLayout } from "@/app/components/DashboardComponents/DashboardLayout";
import { useEffect, useState, useMemo, useCallback } from "react";
import { FaSearch } from "react-icons/fa";
import { debounce } from "lodash";
import { toast } from "react-toastify";
import Skeleton from "react-loading-skeleton";
import "react-toastify/dist/ReactToastify.css";

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
  firstName: string;
  lastName: string;
  username: string;
  status: string;
  userType: string;
  email: string;
  phoneNumber: string;
}

// Component: User Filter Dropdown
const UserFilter = ({
  users,
  isUsersLoading,
  selectedUserId,
  onUserChange,
}: {
  users: User[];
  isUsersLoading: boolean;
  selectedUserId: number | null;
  onUserChange: (userId: number | null) => void;
}) => (
  <select
    className="border p-2 rounded-lg"
    onChange={(e) => onUserChange(e.target.value ? parseInt(e.target.value) : null)}
    disabled={isUsersLoading}
    aria-label="Filter transactions by user"
  >
    <option value="">All Users</option>
    {isUsersLoading ? (
      <option disabled>Loading users...</option>
    ) : users.length > 0 ? (
      users.map((user) => (
        <option key={user.id} value={user.id}>
          {user.username} ({user.id})
        </option>
      ))
    ) : (
      <option disabled>No users available</option>
    )}
  </select>
);

// Component: Search Bar
const SearchBar = ({ onSearch }: { onSearch: (query: string) => void }) => {
  const handleSearchChange = debounce((value: string) => {
    onSearch(value);
  }, 300);

  return (
    <div className="flex items-center gap-2 w-full">
      <input
        type="text"
        placeholder="Search by customer name, payment method, date..."
        onChange={(e) => handleSearchChange(e.target.value)}
        className="border p-2 rounded-lg w-full"
        aria-label="Search transactions"
      />
      <button className="p-2 bg-purple-600 text-white rounded-lg" aria-label="Search">
        <FaSearch />
      </button>
    </div>
  );
};

// Component: Transaction Table
const TransactionTable = ({
  transactions,
  formatDate,
  getStatusBadge,
  onDetailsClick,
  sortConfig,
  handleSort,
}: {
  transactions: Transaction[];
  formatDate: (date: string) => string;
  getStatusBadge: (method: string) => JSX.Element;
  onDetailsClick: (transaction: Transaction) => void;
  sortConfig: { key: keyof Transaction; direction: "asc" | "desc" } | null;
  handleSort: (key: keyof Transaction) => void;
}) => {
  // Map internal sort direction to ARIA-compliant values
  const getAriaSort = (key: keyof Transaction): "none" | "ascending" | "descending" => {
    if (!sortConfig || sortConfig.key !== key) return "none";
    return sortConfig.direction === "asc" ? "ascending" : "descending";
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full table-auto border-collapse">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th
              className="p-3 cursor-pointer"
              onClick={() => handleSort("id")}
              aria-sort={getAriaSort("id")}
            >
              Transaction ID {sortConfig?.key === "id" && (sortConfig.direction === "asc" ? "↑" : "↓")}
            </th>
            <th
              className="p-3 cursor-pointer"
              onClick={() => handleSort("transactionDate")}
              aria-sort={getAriaSort("transactionDate")}
            >
              Date/Time{" "}
              {sortConfig?.key === "transactionDate" && (sortConfig.direction === "asc" ? "↑" : "↓")}
            </th>
            <th
              className="p-3 cursor-pointer"
              onClick={() => handleSort("customerName")}
              aria-sort={getAriaSort("customerName")}
            >
              Customer Name{" "}
              {sortConfig?.key === "customerName" && (sortConfig.direction === "asc" ? "↑" : "↓")}
            </th>
            <th
              className="p-3 cursor-pointer"
              onClick={() => handleSort("paymentMethod")}
              aria-sort={getAriaSort("paymentMethod")}
            >
              Payment Method{" "}
              {sortConfig?.key === "paymentMethod" && (sortConfig.direction === "asc" ? "↑" : "↓")}
            </th>
            <th className="p-3">Status</th>
            <th
              className="p-3 cursor-pointer"
              onClick={() => handleSort("subtotal")}
              aria-sort={getAriaSort("subtotal")}
            >
              Bill Amount {sortConfig?.key === "subtotal" && (sortConfig.direction === "asc" ? "↑" : "↓")}
            </th>
            <th
              className="p-3 cursor-pointer"
              onClick={() => handleSort("discount")}
              aria-sort={getAriaSort("discount")}
            >
              Discount {sortConfig?.key === "discount" && (sortConfig.direction === "asc" ? "↑" : "↓")}
            </th>
            <th
              className="p-3 cursor-pointer"
              onClick={() => handleSort("total")}
              aria-sort={getAriaSort("total")}
            >
              Nett Amount {sortConfig?.key === "total" && (sortConfig.direction === "asc" ? "↑" : "↓")}
            </th>
            <th className="p-3">Details</th>
          </tr>
        </thead>
        <tbody>
          {transactions.length === 0 ? (
            <tr>
              <td colSpan={9} className="p-3 text-center">
                No transactions found
              </td>
            </tr>
          ) : (
            transactions.map((transaction) => (
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
                  <button
                    onClick={() => onDetailsClick(transaction)}
                    className="bg-yellow-400 px-2 py-1 rounded-md text-white text-sm"
                    aria-label={`View details for transaction ${transaction.id}`}
                  >
                    Details
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

// Component: Skeleton Table
const SkeletonTable = () => (
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
        {Array(5)
          .fill(0)
          .map((_, index) => (
            <tr key={index} className="border-b">
              <td className="p-3">
                <Skeleton width={50} />
              </td>
              <td className="p-3">
                <Skeleton width={150} />
              </td>
              <td className="p-3">
                <Skeleton width={100} />
              </td>
              <td className="p-3">
                <Skeleton width={80} />
              </td>
              <td className="p-3">
                <Skeleton width={100} />
              </td>
              <td className="p-3">
                <Skeleton width={80} />
              </td>
              <td className="p-3">
                <Skeleton width={60} />
              </td>
              <td className="p-3">
                <Skeleton width={80} />
              </td>
              <td className="p-3">
                <Skeleton width={60} />
              </td>
            </tr>
          ))}
      </tbody>
    </table>
  </div>
);

// Component: Pagination
const Pagination = ({
  totalItems,
  itemsPerPage,
  currentPage,
  paginate,
}: {
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
  paginate: (page: number) => void;
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return (
    <div className="flex justify-center mt-6 gap-2">
      <button
        onClick={() => paginate(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-1 rounded-lg bg-gray-200 disabled:opacity-50"
        aria-label="Previous page"
      >
        Previous
      </button>
      {Array.from({ length: totalPages }, (_, index) => (
        <button
          key={index + 1}
          onClick={() => paginate(index + 1)}
          className={`mx-1 px-3 py-1 rounded-lg ${
            currentPage === index + 1 ? "bg-purple-600 text-white" : "bg-gray-200"
          }`}
          aria-label={`Page ${index + 1}`}
          aria-current={currentPage === index + 1 ? "page" : undefined}
        >
          {index + 1}
        </button>
      ))}
      <button
        onClick={() => paginate(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-1 rounded-lg bg-gray-200 disabled:opacity-50"
        aria-label="Next page"
      >
        Next
      </button>
    </div>
  );
};

// Component: Transaction Details Modal
const TransactionDetailsModal = ({
  transaction,
  onClose,
}: {
  transaction: Transaction;
  onClose: () => void;
}) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
    <div className="bg-white p-6 rounded-lg max-w-md w-full">
      <h2 className="text-xl font-bold mb-4">Transaction Details</h2>
      <p>
        <strong>ID:</strong> {transaction.id}
      </p>
      <p>
        <strong>Customer:</strong> {transaction.customerName || "Guest"}
      </p>
      <p>
        <strong>Date:</strong> {new Date(transaction.transactionDate).toLocaleString("en-GB")}
      </p>
      <p>
        <strong>Payment Method:</strong> {transaction.paymentMethod}
      </p>
      <p>
        <strong>Subtotal:</strong> MYR {transaction.subtotal.toFixed(2)}
      </p>
      <p>
        <strong>Discount:</strong> {transaction.discount}%
      </p>
      <p>
        <strong>Total:</strong> MYR {transaction.total.toFixed(2)}
      </p>
      <p>
        <strong>GST:</strong> MYR {transaction.gst.toFixed(2)}
      </p>
      <p>
        <strong>Amount Paid:</strong> MYR {transaction.amountPaid.toFixed(2)}
      </p>
      <p>
        <strong>Change:</strong> MYR {transaction.change.toFixed(2)}
      </p>
      <p>
        <strong>Items:</strong> {transaction.items}
      </p>
      <button
        onClick={onClose}
        className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg w-full"
        aria-label="Close transaction details"
      >
        Close
      </button>
    </div>
  </div>
);

// Main Component
const TransactionsPage = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [isUsersLoading, setIsUsersLoading] = useState(true);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Transaction;
    direction: "asc" | "desc";
  } | null>(null);
  const transactionsPerPage = 5;

  // Format date
  const formatDate = useCallback((dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleString("en-GB", options);
  }, []);

  // Status badge
  const getStatusBadge = useCallback((paymentMethod: string) => {
    if (["cash", "card", "digital"].includes(paymentMethod)) {
      return (
        <span className="bg-green-200 text-green-800 text-xs font-semibold px-2 py-1 rounded-full">
          Successful
        </span>
      );
    }
    return (
      <span className="bg-red-200 text-red-800 text-xs font-semibold px-2 py-1 rounded-full">
        Unsuccessful
      </span>
    );
  }, []);

  // Search handler
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  }, []);

  // Sorting handler
  const handleSort = useCallback((key: keyof Transaction) => {
    setSortConfig((prev) => ({
      key,
      direction: prev?.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  }, []);

  // Filtered transactions
  const filteredTransactions = useMemo(
    () =>
      Array.isArray(transactions)
        ? transactions.filter(
            (transaction) =>
              (transaction.customerName || "")
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
              transaction.paymentMethod
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
              formatDate(transaction.transactionDate)
                .toLowerCase()
                .includes(searchQuery.toLowerCase())
          )
        : [],
    [transactions, searchQuery, formatDate]
  );

  // Sorted transactions
  const sortedTransactions = useMemo(() => {
    if (!sortConfig) return filteredTransactions;
    const sorted = [...filteredTransactions].sort((a, b) => {
      const aValue = a[sortConfig.key] ?? "";
      const bValue = b[sortConfig.key] ?? "";
      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [filteredTransactions, sortConfig]);

  // Fetch all users
  const fetchUsers = async () => {
    if (!window.electronAPI) {
      toast.error("Electron API is not available.");
      setUsers([]);
      setIsUsersLoading(false);
      return;
    }
    setIsUsersLoading(true);
    try {
      const result = await window.electronAPI.getUsers();
      if (result.success) {
        setUsers(result.users || []);
      } else {
        toast.error(`Failed to fetch users: ${result.error}`);
        setUsers([]);
      }
    } catch (error) {
      toast.error("An error occurred while fetching users.");
      setUsers([]);
    } finally {
      setIsUsersLoading(false);
    }
  };

  // Fetch transactions for selected user
  const fetchTransactions = async (userId: number | null) => {
    if (!window.electronAPI) {
      toast.error("Electron API is not available.");
      setTransactions([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const result = await window.electronAPI.getTransactions(userId);
      if (result.success) {
        if (Array.isArray(result.data)) {
          setTransactions(result.data);
        } else {
          toast.error("Invalid transaction data received.");
          setTransactions([]);
        }
      } else {
        toast.error(`Error fetching transactions: ${result.error}`);
        setTransactions([]);
      }
    } catch (error) {
      toast.error("An error occurred while fetching transactions.");
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchUsers();
    fetchTransactions(selectedUserId);
  }, []);

  // Refetch transactions when selectedUserId changes
  useEffect(() => {
    fetchTransactions(selectedUserId);
    setCurrentPage(1);
  }, [selectedUserId]);

  // Reset page when filtered transactions change
  useEffect(() => {
    const maxPage = Math.ceil(filteredTransactions.length / transactionsPerPage);
    if (currentPage > maxPage && maxPage > 0) {
      setCurrentPage(maxPage);
    } else if (filteredTransactions.length === 0) {
      setCurrentPage(1);
    }
  }, [filteredTransactions, currentPage, transactionsPerPage]);

  const indexOfLastTransaction = currentPage * transactionsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
  const currentTransactions = sortedTransactions.slice(
    indexOfFirstTransaction,
    indexOfLastTransaction
  );

  return (
    <DashboardLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Transactions List</h1>

        {/* Filters */}
        <div className="flex items-center mb-6 gap-4">
          <UserFilter
            users={users}
            isUsersLoading={isUsersLoading}
            selectedUserId={selectedUserId}
            onUserChange={setSelectedUserId}
          />
          <SearchBar onSearch={handleSearch} />
        </div>

        {/* Table */}
        {loading ? (
          <SkeletonTable />
        ) : (
          <TransactionTable
            transactions={currentTransactions}
            formatDate={formatDate}
            getStatusBadge={getStatusBadge}
            onDetailsClick={setSelectedTransaction}
            sortConfig={sortConfig}
            handleSort={handleSort}
          />
        )}

        {/* Pagination */}
        <Pagination
          totalItems={sortedTransactions.length}
          itemsPerPage={transactionsPerPage}
          currentPage={currentPage}
          paginate={setCurrentPage}
        />

        {/* Details Modal */}
        {selectedTransaction && (
          <TransactionDetailsModal
            transaction={selectedTransaction}
            onClose={() => setSelectedTransaction(null)}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default TransactionsPage;