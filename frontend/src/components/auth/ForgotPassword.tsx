"use client";
import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "../SubmitBtn";
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';

import { useFormState } from "react-dom";
// import { forgotPasswordAction } from "@/app/actions/authActions";
import { toast } from "sonner";
import Link from "next/link";
import { forgotPasswordAction } from "@/redux/features/auth/authSlice";
interface LoginFormData {
  email: string;
}
export default function ForgotPassword() {

  const [formData, setFormData] = useState<LoginFormData>({ email: '' });
  const dispatch = useDispatch<AppDispatch>();

  const { user, loading, msg, status, error } = useSelector((state: RootState) => state.auth);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email) {
      toast.error('All fields are required.');
      return;
    }

    await dispatch(forgotPasswordAction(formData.email));
  };


  useEffect(() => {
    if (status === 500) {
      toast.error(msg);
    } else if (status === 200) {
      toast.success(msg);
    }
  }, [formData, msg, user]);

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
          onChange={handleChange} />
        {error?.email && <span className="text-red-400">{error.email}</span>}
      </div>

      <div className="mt-4">
        <SubmitButton />
      </div>
    </form>
  );
}
