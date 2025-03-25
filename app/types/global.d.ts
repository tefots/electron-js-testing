// app/types/global.d.ts
import { LoginData, LoginResponse } from '../components/Auth/LoginForm';
import { UserData, SignupResponse } from '../components/Auth/SignupForm';

declare global {
  interface Window {
    electronAPI: {
      loginUser: (data: LoginData) => Promise<LoginResponse>;
      signupUser: (user: UserData) => Promise<SignupResponse>;
    };
  }
}

export {};