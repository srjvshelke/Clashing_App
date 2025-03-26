'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { toast } from 'sonner'; // Toast notifications
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { loginUser } from '@/redux/features/auth/authSlice'; // Redux login action

interface LoginFormData {
  email: string;
  password: string;
}

export default function LoginPage() {
  const [formData, setFormData] = useState<LoginFormData>({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const { user, status, msg, error } = useSelector((state: RootState) => state.auth);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error('All fields are required.');
      return;
    }

    setLoading(true);

    try {
      // Step 1: Perform Redux login operation first
      const reduxResponse = await dispatch(loginUser(formData)).unwrap();

      if (reduxResponse.status === 200) {
        toast.success(reduxResponse.message);

        // Step 2: If Redux login succeeds, sign in with NextAuth
        const nextAuthResponse = await signIn('credentials', {
          email: formData.email,
          password: formData.password,
          redirect: false,
        });

        if (nextAuthResponse?.error) {
          toast.error('NextAuth login failed. Please check your credentials.');
        } else {
          toast.success(msg);
          router.push('/Dashboard'); // Redirect to Dashboard after successful login
        }
      } else {
        toast.error(msg);
      }
    } catch (err) {
      console.error('Error during login:', err);
      toast.error(msg);
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  // Handle any Redux-based global notifications (optional)
  useEffect(() => {
    if (status === 500) toast.error(msg);
  }, [status, msg]);

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-[500px] p-8 shadow-md rounded-xl bg-white">
        <h1 className="text-4xl text-center font-extrabold bg-gradient-to-r from-pink-400 to-purple-500 text-transparent bg-clip-text">
          Clash
        </h1>
        <h2 className="text-3xl font-bold">Login</h2>
        <p className="text-gray-500 mb-4">Welcome back! Please login to your account.</p>

        <form onSubmit={handleSubmit}>
          <div className="mt-4">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="text"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email..."
              required
            />
          </div>

          <div className="mt-4">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password..."
              required
            />
            <div className="text-right mt-2">
              <Link href="/forgot-password" className="text-sm font-bold text-blue-600 hover:underline">
                Forgot Password?
              </Link>
            </div>
          </div>

          <Button className="w-full mt-6" type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </form>

        <p className="text-center mt-4">
          Don’t have an account?{' '}
          <Link href="/register" className="font-bold text-blue-600 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
