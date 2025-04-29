// global.d.ts (updated)
import { LoginData, LoginResponse } from "./components/AuthComponents/LoginForm";
import { UserData, SignupResponse } from "./components/AuthComponents/SignupForm";

interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}

interface User {
  id: number;
  username: string;
}

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

declare global {
  interface Window {
    electronAPI: {
      fetchUsers: () => Promise<ApiResponse<User[]>>;
      getTransactions: (userId: number | null) => Promise<ApiResponse<Transaction[]>>;
      insertTransaction: any;
      deleteProduct: any;
      updateProduct: any;
      getProducts: any;
      saveProductImage: any;
      addProduct: any;
      loginUser: (data: LoginData) => Promise<LoginResponse>;
      signupUser: (user: UserData) => Promise<SignupResponse>;
      getUsers: () => Promise<{
        success: boolean;
        users?: {
          id: number;
          firstName: string;
          lastName: string;
          username: string,
          status: string;
          userType: string;
          email: string;
          phoneNumber: string;
        }[];
        error?: string;
      }>;
      deleteAllUsers: () => Promise<{ success: boolean; error?: string }>;
      deleteUser: (data: { id: number }) => Promise<{ success: boolean; error?: string }>; // delete single user except admins

    };
  }
}

export {};