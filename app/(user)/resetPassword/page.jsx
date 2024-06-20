'use client'

import React, { useEffect } from 'react'
import ResetPasswordForm from '../../../components/user/resetPasswordForm'
import {  useRouter } from "next/navigation";

const ResetPasswordPage = () => {
  const router = useRouter();
  useEffect(() => {
    const user = localStorage.getItem('token');
    if (user) {
      router.push('/home');
    }
  }, [router]);
  return (
    <div className='purple-dark h-lvh bg-background text-foreground overflow-y-scroll flex justify-center'>
    <ResetPasswordForm/>
  </div>
  )
}

export default ResetPasswordPage
