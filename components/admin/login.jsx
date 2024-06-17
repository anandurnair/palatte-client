'use client'
import React, { useEffect, useState } from 'react'
import { Input, Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";
const Login = () => {
  const router = useRouter()
  useEffect(()=>{
         const isLogin = JSON.parse(localStorage.getItem("admin"));
         if(isLogin){
          router.push('/admin/dashboard')
         }

  },[])
  const [username,setUsername] = useState()
  const [password , setPassword] = useState()
  const handleSubmit=async()=>{
  
    const res = await fetch("http://localhost:4000/admin-login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
      headers: {
        "Content-Type": "application/json", 
      },
    });
    const data = await res.json();
    if (res.ok) {
     
      localStorage.setItem('admin',JSON.stringify({username}))
      router.push('/admin/dashboard')
    } else {
      alert( data.error);  
    }
  }
  
  
  return (
    <div className='w-1/3 rounded-lg flex flex-col items-center justify-center px-16 py-20 bg3'>
      <div className='w-full h-full  flex flex-col items-center justify-center gap-y-5'>
          <h2 className='text-2xl font-semibold tracking-wide'>Admin Login</h2>
          <Input
            type="text"
            label="Username"
            labelPlacement="inside"
            variant="underlined"
            size="lg"
            onChange={(e) => setUsername(e.target.value)}
          />
          <Input
            type="password"
            label="Password "
            labelPlacement="inside"
            variant="underlined"
            size="lg"
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button className='w-full h-14' onClick={handleSubmit}>Login</Button>
      </div>
    </div>
  )
}

export default Login
