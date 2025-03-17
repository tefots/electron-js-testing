"use client";

import React, { useState } from 'react';
import SignupForm from '../../components/Auth/SignupForm';
import { saveUser } from '../../utils/auth';
// import Link from 'next/link';
const SignupPage: React.FC = () => {
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleSignup = (username: string, password: string) => {
    // Save the user in localStorage
    saveUser({ username, password });
    setErrorMessage('');
    alert('User registered successfully! You can now log in.');
  };

  return (
    <div>
      <h1>Sign Up</h1>
      <SignupForm />
      {errorMessage && <p>{errorMessage}</p>}
     
    </div>
  );
};

export default SignupPage;
