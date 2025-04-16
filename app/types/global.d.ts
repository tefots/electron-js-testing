// global.d.ts (updated)
import { LoginData, LoginResponse } from "./components/AuthComponents/LoginForm";
import { UserData, SignupResponse } from "./components/AuthComponents/SignupForm";

declare global {
  interface Window {
    electronAPI: {
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