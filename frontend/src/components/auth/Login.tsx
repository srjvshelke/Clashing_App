'use client';
import React, {useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { loginUser } from '@/redux/features/auth/authSlice';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface LoginFormData {
  email: string;
  password: string;
}

export default function Login() {
  const [formData, setFormData] = useState<LoginFormData>({ email: '', password: '' });
  const dispatch = useDispatch<AppDispatch>();
  const { user, loading, msg, status, error } = useSelector((state: RootState) => state.auth);

  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error('All fields are required.');
      return;
    }

    const reduxResponse = await dispatch(loginUser(formData)).unwrap();

  };

  useEffect(() => {
    if (status === 500) {
      toast.error(msg);
    } else if (status === 200) {
      toast.success(msg);

      signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: true,  // Prevent auto-redirect
        callbackUrl: "/dashboard",

      })
      setFormData({ email: '', password: '' });  // Reset form after login
    }
  }, [user, status, msg]);


  return (
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
  );
}
