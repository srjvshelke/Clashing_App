import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import React from 'react'

export default function page() {
    return (
        <div className="flex justify-center items-center h-screen ">
            <div className="w-[550px] shadow-md rounded-xl py-5 px-10 bg-white">
                <h1 className="text-4xl text-center font-extrabold bg-gradient-to-r from-pink-400 to-purple-500 text-transparent bg-clip-text">
                    Clash
                </h1>
                <h1 className="text-3xl font-bold">Login</h1>
                <p>Welcome back</p>

                <form>
                    <div className="mt-4">
                        <Label htmlFor="email">Email</Label>
                        <Input id='email' type='email' placeholder="Enter your email..." name="email" />
                        {/* <span className="text-red-400">{state.errors?.email}</span> */}
                    </div>
                    <div className="mt-4">
                        <Label htmlFor="password">Password</Label>
                        <Input id="password" type='password' placeholder="Enter your password..." name="password" />
                        {/* <span className="text-red-400">{state.errors?.email}</span> */}
                        <div className="text-right font-bold">
                            <Link href="/forgot-password">Forgot Password?</Link>
                        </div>
                    </div>
                    <div className='mt-4'>
                        <Button className='w-full'>Submit</Button>
                    </div>
                </form>

                <p className="text-center mt-2">
                    Don't have an account ?{" "}
                    <strong>
                        <Link href="/register">Register</Link>
                    </strong>
                </p>



            </div>

        </div>

    )
}
