'use client';
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Login from '../../components/user/loginForm';

export default function Home() {
  const router = useRouter();
  console.log("API :",process.env.NEXT_PUBLIC_API_URL)
  useEffect(() => {
    const user = localStorage.getItem('currentUser');
    if (user) {
      router.push('/home');
    }
  }, []);
  

  return (
    <div className=" purple-dark min-h-screen bg-background text-foreground flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8">
      <Login />
    </div>
  );
}
