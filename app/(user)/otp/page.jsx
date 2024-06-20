'use client'

import React, { useEffect } from "react";
import OTPfrom from '../../../components/user/otpForm'
import {  useRouter } from "next/navigation";

const page = () => {
  const router = useRouter();
  useEffect(() => {
    const user = localStorage.getItem('token');
    if (user) {
      router.push('/home');
    }
  }, [router]);
  return (
    <div className=" purple-dark min-h-screen bg-background text-foreground flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8">
     <OTPfrom/>
    </div>
  );
};

export default page;
