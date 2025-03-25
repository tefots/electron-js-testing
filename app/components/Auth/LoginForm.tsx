"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export interface LoginResponse {
  success: boolean;
  user?: {
    name: string;
    email: string;
    role: string;
  };
  error?: string;
}

export interface LoginData {
  username: string;
  password: string;
}

export default function LoginForm() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [messageType, setMessageType] = useState<"success" | "error" | "">("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const result: LoginResponse = await window.electronAPI.loginUser({
        username,
        password,
      });

      if (result.success && result.user) {
        setMessage("Login successful!");
        setMessageType("success");
        // Store user data in localStorage
        localStorage.setItem("loggedInUser", JSON.stringify(result.user));
        setUsername("");
        setPassword("");
        setTimeout(() => {
          router.push("/pages/Dashboard");
          setMessage("");
          setMessageType("");
        }, 800);
      } else {
        setMessage(result.error || "Invalid username or password");
        setMessageType("error");
        setUsername("");
        setPassword("");
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : String(error));
      setMessageType("error");
    }
  };

  const handleInputChange =
    (field: "username" | "password") =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (message) {
        setMessage("");
        setMessageType("");
      }
      if (field === "username") {
        setUsername(e.target.value);
      } else {
        setPassword(e.target.value);
      }
    };

  return (
    <div className="min-h-screen bg-gray-300 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Login
        </h2>
        <form onSubmit={handleSubmit}>
          {message && (
            <p
              className={`text-center text-sm mb-4 ${
                messageType === "error" ? "text-red-600" : "text-green-600"
              }`}
            >
              {message}
            </p>
          )}
          <div className="mb-4">
            <label
              htmlFor="username"
              className="block text-md font-medium text-gray-600 mb-2"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={handleInputChange("username")}
              className="w-full text-start p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-start text-md font-medium text-gray-600 mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={handleInputChange("password")}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white font-semibold rounded-2xl shadow-xl hover:bg-blue-700 transition-all"
          >
            Login
          </button>
          <div className="mt-6 text-center">
            Don&apos;t have an account?
            <Link
              href="/pages/Auth/Signup"
              className="text-center ms-4 text-blue-700 text-lg"
            >
              Sign up here
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}