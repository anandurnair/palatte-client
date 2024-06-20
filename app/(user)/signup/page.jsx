'use client'

import React, { useEffect } from 'react'
import SignupForm from '../../../components/user/signupForm'
import {  useRouter } from "next/navigation";

const Signup = () => {
  const router = useRouter();
  useEffect(() => {
    const user = localStorage.getItem('token');
    if (user) {
      router.push('/home');
    }
  }, [router]);

  return (
    <div className=" purple-dark min-h-screen bg-background text-foreground flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8">
      <SignupForm />
    </div>
  )
}

export default Signup
