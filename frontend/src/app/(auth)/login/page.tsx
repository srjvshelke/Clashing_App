
import Link from 'next/link';
import { getServerSession } from "next-auth";

import { signIn } from 'next-auth/react';
import React, {useEffect, useState } from 'react';
import Login from '@/components/auth/Login';
import { authOptions } from '@/app/api/(auth)/[...nextauth]/options';
// import { authOptions } from "@/app/api/auth/[...nextauth]/options";

import { redirect } from "next/navigation";


export default async function LoginPage() {
  const session = await getServerSession(authOptions);
  if (session !== null) {
    redirect("/Dashboard");
  }
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-[550px] shadow-md rounded-xl py-5 px-10 bg-white">
        <h1 className="text-4xl text-center font-extrabold bg-gradient-to-r from-pink-400 to-purple-500 text-transparent bg-clip-text">
          Clash
        </h1>
        <h1 className="text-3xl font-bold">Login</h1>
        <p>Welcome back</p>

        <Login />
      

        <p className="text-center mt-2">
          Don't have an account? <strong><Link href="/register">Register</Link></strong>
        </p>
      </div>
    </div>
  );
}
