'use client';

import React, { useEffect } from 'react';
import ForgotPasswordForm from '@/components/user/forgotPasswordForm';
import { useRouter } from 'next/navigation';

const ForgotPasswordPage = () => {
  const router = useRouter();
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem('token');
      if (user) {
        router.push('/home');
      }
    }
  }, [router]);
  return (
    <div className='purple-dark h-lvh bg-background text-foreground overflow-y-scroll flex justify-center'>
      <ForgotPasswordForm />
    </div>
  );
};

export default ForgotPasswordPage;
  