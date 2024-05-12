'use client'
import Image from "next/image";
import { Button } from "@nextui-org/react";
import Login from '../../components/user/loginForm'
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
export default function Home() {
  const router  = useRouter()
  useEffect(()=>{
    const user = localStorage.getItem('currentUser')
    if(user){
      router.push('/home')
    }
  },[])
  return (
<div className="purple-dark h-lvh bg-background text-foreground flex flex-col gap-11 items-center"> 
      <Login/>
    </div>
  );
}
