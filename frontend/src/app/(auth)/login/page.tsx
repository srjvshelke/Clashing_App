'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { loginUser } from '@/redux/features/auth/authSlice';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';  // Correct for Next.js 13+ App Router


interface LoginFormData {
  email: string;
  password: string;
}

export default function LoginPage() {
  const [formData, setFormData] = useState<LoginFormData>({ email: '', password: '' });
  const dispatch = useDispatch<AppDispatch>();
  const { user, loading, msg, status, error } = useSelector((state: RootState) => state.auth);
  const router = useRouter();  // Initialize Next.js router

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error('All fields are required.');
      return;
    }

    const reduxResponse = await dispatch(loginUser(formData));

  };

  const handleLogin = async () => {
    if (status === 500) {
      toast.error(msg);
    } else if (status === 200) {
      toast.success(msg);

      try {
        const response = await signIn('credentials', {
          email: formData.email,
          password: formData.password,
          redirect: true,  
          callbackUrl: "/Dashboard"
        });


        // if (response?.error) {
        //   toast.error('Invalid credentials. Please try again.');
        // } else {
        //   router.push('/Dashboard');  // Redirect after successful login
        // }

        setFormData({ email: '', password: '' });  // Reset form after login
      } catch (error) {
        console.error("Login failed:", error);
        toast.error("Something went wrong. Please try again later.");
      }
    }
  };

  useEffect(() => {
    if (status === 200 || status === 500) {
      handleLogin();
    }
  }, [status]); // Check based on status only to avoid unnecessary re-renders.
  // Dependencies array


  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-[550px] shadow-md rounded-xl py-5 px-10 bg-white">
        <h1 className="text-4xl text-center font-extrabold bg-gradient-to-r from-pink-400 to-purple-500 text-transparent bg-clip-text">
          Clash
        </h1>
        <h1 className="text-3xl font-bold">Login</h1>
        <p>Welcome back</p>

        <form onSubmit={handleSubmit}>
          <div className="mt-4">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="text"
              placeholder="Enter your email..."
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
            {error?.email && <span className="text-red-400">{error.email}</span>}
          </div>
          <div className="mt-4">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password..."
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
            {error?.password && <span className="text-red-400">{error.password}</span>}
            <div className="text-right font-bold">
              <Link href="/forgot-password">Forgot Password?</Link>
            </div>
          </div>
          <div className="mt-4">
            <Button className="w-full" type="submit" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </div>
        </form>

        <p className="text-center mt-2">
          Don't have an account? <strong><Link href="/register">Register</Link></strong>
        </p>
      </div>
    </div>
  );
}
