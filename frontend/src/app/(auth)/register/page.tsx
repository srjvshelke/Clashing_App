
'use client';
import Link from "next/link";
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { registerUser } from '@/redux/features/auth/authSlice';

export default  function register() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirm_password: '' });
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.auth);
// 
  let name, value;

  const handleChange =  (e: React.ChangeEvent<HTMLInputElement>) => {
    name = e.target.name;
    value = e.target.value;
  
    setFormData({ ...formData, [name]: value});
  };


  const handleSubmit =  (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(registerUser(formData));
    // console.log(formData);
    
  };

  return (
    <div className="flex justify-center items-center h-screen w-full">
      <div className="w-[550px] shadow-md rounded-xl py-5  px-10 bg-white">
        <div>
          <h1 className="text-4xl text-center font-extrabold bg-gradient-to-r from-pink-400 to-purple-500 text-transparent bg-clip-text">
            Clash

            {/*  */}

          </h1>
          <h1 className="text-3xl font-bold">Register</h1>
          <p>Start clashing now</p>
          <form onSubmit={handleSubmit}>
            <div className="mt-4">
              <Label htmlFor="name">Name</Label>
              <Input placeholder="Type your name" name="name" value={formData.name} onChange={handleChange}  />
              {/* <span className="text-red-400">{state.errors?.name}</span> */}
            </div>
            <div className="mt-4">
              <Label htmlFor="email">Email</Label>
              <Input placeholder="Type your email" name="email" value={formData.email} onChange={handleChange} required />
              {/* <span className="text-red-400">{state.errors?.email}</span> */}
            </div>
            <div className="mt-4">
              <Label htmlFor="password">Password</Label>
              <Input
                type="password"
                placeholder="Type your password"
                value={formData.password}
                name="password" onChange={handleChange}
                required
              />
              {/* <span className="text-red-400">{state.errors?.password}</span> */}
            </div>
            <div className="mt-4">
              <Label htmlFor="cpassword">Confirm Password</Label>
              <Input
                type="password"
                placeholder="Type your password"
                value={formData.confirm_password}
                name="confirm_password" onChange={handleChange} required
              />
              {/* <span className="text-red-400">{state.errors?.confirm_password}</span> */}
            </div>
            <div className='mt-4'>
              <Button className='w-full' type="submit" disabled={loading}>
                {loading ? 'Registering...' : 'Register'}
              </Button>
              {/* <Button className='w-full'></Button> */}
              {/* {error && <p>{error}</p>} */}
            </div>
          </form>
        </div>

        <p className="text-center mt-2">
          Already have an account ?{" "}
          <strong>
            <Link href="/login">Login</Link>
          </strong>
        </p>
      </div>
    </div>
  );
}
