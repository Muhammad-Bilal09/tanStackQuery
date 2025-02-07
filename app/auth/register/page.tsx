"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import Link from "next/link";

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: async (data: {
      name: string;
      email: string;
      password: string;
    }) => {
      return await axios.post("/api/register", data);
    },
    onSuccess: () => {
      router.push("/");
    },
    onError: (error: any) => {
      console.error(error);
    },
  });

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({ name, email, password });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 shadow-lg rounded-lg w-96">
        <h2 className="text-2xl font-semibold text-center mb-4">Register</h2>
        {mutation.isError && (
          <p className="text-red-500 text-center mb-4">Registration failed</p>
        )}
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Registering..." : "Register"}
          </button>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-gray-900"
              >
                Already have an account?
                <Link
                  href="/auth/login"
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Login now
                </Link>
              </label>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
