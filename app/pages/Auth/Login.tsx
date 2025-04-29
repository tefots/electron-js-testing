"use client";

import React, { useState } from 'react';
import LoginForm from '../../components/Auth/LoginForm';
import { checkCredentials, getUser, clearUser } from '../../utils/auth';

const LoginPage: React.FC = () => {
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [user, setUser] = useState<string | null>(null);

  const handleLogin = (username: string, password: string) => {
    if (checkCredentials(username, password)) {
      setUser(username);
      setErrorMessage('');
    } else {
      setErrorMessage('Invalid credentials');
    }
  };

  const handleLogout = () => {
    clearUser();
    setUser(null);
  };

  const storedUser = getUser();

  if (storedUser && !user) {
    // Automatically log in the user if data exists in localStorage
    setUser(storedUser.username);
  }

  return (
    <div>
      {user ? (
        <div>
          <h1>Welcome, {user}!</h1>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <div className="">
          {/* <h1 className="text-xl text-center font-semibold ">Login Page</h1> */}
          <LoginForm onLogin={handleLogin} />
          {errorMessage && <p>{errorMessage}</p>}
           </div>
      )}
    </div>
  );
};

export default LoginPage;
