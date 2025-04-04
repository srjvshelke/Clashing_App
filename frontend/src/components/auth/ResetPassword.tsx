"use client";
import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "../SubmitBtn";
import { useFormState } from "react-dom";
import { resetPasswordAction } from "@/redux/features/auth/authSlice";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from '@/components/ui/button';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';


interface RegisterFormData {
  email: string;
  password: string;
  confirm_password: string;
  token: string
}
export default function ResetPassword() {

  const [formData, setFormData] = useState<RegisterFormData>({
    email: '',
    password: '',
    confirm_password: '',
    token: ''
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

    if (!formData.email || !formData.password || !formData.confirm_password) {
      toast.error("All fields are required.");
      return;
    }
    dispatch(resetPasswordAction(formData));
  };
  const sParams = useSearchParams();
  const router = useRouter();
  useEffect(() => {
    if (status === 500) {
      toast.error(msg);
    } else if (status === 200) {
      toast.success(msg);
      var timeOut = setTimeout(() => {
        router.replace("/login");
      }, 1500);
    }

    return () => {
      clearTimeout(timeOut);
    };
  }, [formData, status, msg]);

  return (
    <form onSubmit={handleSubmit}>
      <input type="hidden" name="token" value={sParams.get("token") ?? ""} />
      <div className="mt-4">
        <Label htmlFor="email">Email</Label>
        <Input
          placeholder="Type your email"
          name="email"
          readOnly
          onChange={handleChange}

          value={sParams.get("email") ?? ""}

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
          onChange={handleChange}
        />
        {typeof error === 'object' && 'password' in error && error.password && (
          <span className="text-red-400">{error.password}</span>
        )}
      </div>
      <div className="mt-4">
        <Label htmlFor="cpassword">Confirm Password</Label>
        <Input
          type="password"
          placeholder="Type your password"
          name="confirm_password"
          onChange={handleChange}
        />
        {typeof error === 'object' && 'confirm_password' in error && error.confirm_password && (
          <span className="text-red-400">{error.confirm_password}</span>
        )}
      </div>
      <div className="mt-4">
        <SubmitButton />
      </div>
    </form>
  );
}
