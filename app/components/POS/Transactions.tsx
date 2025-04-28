'use client';

import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '../DashboardComponents/DashboardLayout';

interface Transaction {
  id: number;
  items: string; // JSON string of [{ productName, quantity }]
  subtotal: number;
  discount: number;
  total: number;
  gst: number;
  paymentMethod: 'cash' | 'card' | 'digital';
  amountPaid: number;
  change: number;
  customerName?: string;
  phoneNumber?: string;
  cardNumber?: string;
  transactionDate: string;
  loggedInUser: number;
}

const TransactionsPage: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        // Fetch transactions using Electron API
        const result = await window.electronAPI.getTransactions();
        if (!result.success) {
          throw new Error(result.error || "Failed to fetch transactions");
        }
        setTransactions(result.data);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      }
    };

    fetchTransactions();
  }, []);

  return (
    <DashboardLayout>
    <div className="container mx-auto p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Transactions List</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-4">
        <select className="border rounded p-2">
          <option>Transaction ID</option>
        </select>
        <select className="border rounded p-2">
          <option>Cashier Code</option>
        </select>
        <select className="border rounded p-2">
          <option>QR Code Name</option>
        </select>
        <select className="border rounded p-2">
          <option>Terminal Name</option>
        </select>
        <select className="border rounded p-2">
          <option>Status</option>
          <option>Successful</option>
          <option>Unsuccessful</option>
        </select>
        <select className="border rounded p-2">
          <option>Last 7 Days</option>
        </select>
        <button className="bg-purple-600 text-white p-2 rounded">🔍</button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded-lg shadow">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-3 text-left">Transaction ID</th>
              <th className="p-3 text-left">Date/Time</th>
              <th className="p-3 text-left">QR Code Name</th>
              <th className="p-3 text-left">Cashier Code</th>
              <th className="p-3 text-left">Transaction Type</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Bill Amount</th>
              <th className="p-3 text-left">Discount Amount (0.5% Transaction Charge)</th>
              <th className="p-3 text-left">Nett Amount</th>
              <th className="p-3 text-left">Settlement Amount</th>
              <th className="p-3 text-left">Details</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => {
              // Calculate discount (0.5% of subtotal)
              const discount = transaction.subtotal * 0.005;
              const nettAmount = transaction.total - discount;

              // Determine transaction type based on payment method
              let transactionType = '';
              if (transaction.paymentMethod === 'digital') {
                transactionType = 'QR Code';
              } else if (transaction.paymentMethod === 'card') {
                transactionType = 'POS Terminal';
              } else {
                transactionType = 'Cash';
              }

              // Mock status for demo (you can adjust logic based on your backend)
              const status = Math.random() > 0.5 ? 'Successful' : 'Unsuccessful';
              const statusColor = status === 'Successful' ? 'bg-green-500' : 'bg-red-500';

              return (
                <tr key={transaction.id} className="border-b">
                  <td className="p-3">{transaction.id}</td>
                  <td className="p-3">{new Date(transaction.transactionDate).toLocaleString()}</td>
                  <td className="p-3">{transaction.paymentMethod === 'digital' ? `QR Code ${transaction.id % 10}` : '-'}</td>
                  <td className="p-3">{transaction.loggedInUser}</td>
                  <td className="p-3">{transactionType}</td>
                  <td className="p-3">
                    <span className={`${statusColor} text-white px-2 py-1 rounded`}>{status}</span>
                  </td>
                  <td className="p-3">MYR {transaction.subtotal.toFixed(2)}</td>
                  <td className="p-3">{((discount / transaction.subtotal) * 100).toFixed(1)}% MYR {discount.toFixed(2)}</td>
                  <td className="p-3">MYR {nettAmount.toFixed(2)}</td>
                  <td className="p-3">MYR {(transaction.total - transaction.gst).toFixed(2)}</td>
                  <td className="p-3">
                    <button className="text-blue-500">📄</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-4">
        <div className="flex gap-2">
          <button className="p-2 border rounded">❮</button>
          <button className="p-2 border rounded bg-blue-500 text-white">1</button>
          <button className="p-2 border rounded">2</button>
          <button className="p-2 border rounded">3</button>
          <button className="p-2 border rounded">4</button>
          <button className="p-2 border rounded">5</button>
          <button className="p-2 border rounded">❯</button>
        </div>
      </div>
    </div>
    </DashboardLayout>
  );
};

export default TransactionsPage;