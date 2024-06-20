'use client';
import { useEffect } from "react";
import {  useRouter } from "next/navigation";
import Login from '../../components/user/loginForm';

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    const user = localStorage.getItem('token');
    if (user) {
      router.push('/home');
    }
  }, [router]);

  return (
    <div className=" purple-dark min-h-screen bg-background text-foreground flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8">
      <Login />
    </div>
  );
}
