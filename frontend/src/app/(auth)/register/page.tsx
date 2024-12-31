
import Link from "next/link";
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import React from "react";


export default async function register() {
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
          <form>
            <div className="mt-4">
              <Label htmlFor="name">Name</Label>
              <Input placeholder="Type your name" name="name" />
              {/* <span className="text-red-400">{state.errors?.name}</span> */}
            </div>
            <div className="mt-4">
              <Label htmlFor="email">Email</Label>
              <Input placeholder="Type your email" name="email" />
              {/* <span className="text-red-400">{state.errors?.email}</span> */}
            </div>
            <div className="mt-4">
              <Label htmlFor="password">Password</Label>
              <Input
                type="password"
                placeholder="Type your password"
                name="password"
              />
              {/* <span className="text-red-400">{state.errors?.password}</span> */}
            </div>
            <div className="mt-4">
              <Label htmlFor="cpassword">Confirm Password</Label>
              <Input
                type="password"
                placeholder="Type your password"
                name="confirm_password"
              />
              {/* <span className="text-red-400">{state.errors?.confirm_password}</span> */}
            </div>
            <div className='mt-4'>
              <Button className='w-full'>Submit</Button>
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
