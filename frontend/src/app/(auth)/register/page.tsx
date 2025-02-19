'use client';

import Link from "next/link";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { registerUser } from '@/redux/features/auth/authSlice';
import { toast } from "sonner";

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirm_password: string;
}

export default function Register() {
  const [formData, setFormData] = useState<RegisterFormData>({
    name: '',
    email: '',
    password: '',
    confirm_password: '',
  });

  const dispatch = useDispatch<AppDispatch>();
  const { user, loading, msg, status, error } = useSelector((state: RootState) => state.auth);

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.password || !formData.confirm_password) {
      toast.error("All fields are required.");
      return;
    }

    // if (formData.password !== formData.confirm_password) {
    //   toast.error("Passwords do not match.");
    //   return;
    // }

    dispatch(registerUser(formData));
  };

  // Show success/error messages
  useEffect(() => {
    if (status === 404 ) {
      toast.error(msg);
    } else if (status === 200) {
      toast.success(msg);
    }
    setFormData (
      {name: '',
      email: '',
      password: '',
      confirm_password: ''}
    )
  }, [status, msg]);

  return (
    <div className="flex justify-center items-center h-screen w-full">
      <div className="w-[550px] shadow-md rounded-xl py-5 px-10 bg-white">
        <h1 className="text-4xl text-center font-extrabold bg-gradient-to-r from-pink-400 to-purple-500 text-transparent bg-clip-text">
          Clash
        </h1>
        <h1 className="text-3xl font-bold">Register</h1>
        <p>Start clashing now</p>

        <form onSubmit={handleSubmit}>
          <div className="mt-4">
            <Label htmlFor="name">Name</Label>
            <Input
              placeholder="Type your name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              
            />
            {typeof error === 'object' && 'name' in error && error.name && (
              <span className="text-red-400">{error.name}</span>
            )}
          </div>

          <div className="mt-4">
            <Label htmlFor="email">Email</Label>
            <Input
              placeholder="Type your email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              
            />
            {typeof error === 'object' && 'email' in error && error.email && (
              <span className="text-red-400">{error.email}</span>
            )}
          </div>

          <div className="mt-4">
            <Label htmlFor="password">Password</Label>
            <Input
              type="password"
              placeholder="Type your password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              
            />
            {typeof error === 'object' && 'password' in error && error.password && (
              <span className="text-red-400">{error.password}</span>
            )}
          </div>

          <div className="mt-4">
            <Label htmlFor="confirm_password">Confirm Password</Label>
            <Input
              type="password"
              placeholder="Confirm your password"
              name="confirm_password"
              value={formData.confirm_password}
              onChange={handleChange}
              
            />
            {typeof error === 'object' && 'confirm_password' in error && error.confirm_password && (
              <span className="text-red-400">{error.confirm_password}</span>
            )}
          </div>

          <div className='mt-4'>
            <Button className='w-full' type="submit" disabled={loading}>
              {loading ? 'Registering...' : 'Register'}
            </Button>
          </div>
        </form>

        <p className="text-center mt-2">
          Already have an account?{" "}
          <strong>
            <Link href="/login">Login</Link>
          </strong>
        </p>
      </div>
    </div>
  );
}
