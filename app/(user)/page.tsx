'use client'
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Login from '../../components/user/loginForm';

export default function Home() {
  const router  = useRouter();
  useEffect(()=>{
    const user = localStorage.getItem('currentUser');
    if(user){
      router.push('/home');
    }
  }, []);
  
  return (
    <div className="h-screen purple-dark bg-background text-foreground flex flex-col gap-6 justify-center items-center"> 
      <Login/>
    </div>
  );
}
