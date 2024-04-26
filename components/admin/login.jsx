'use client'
import React, { useState } from 'react'
import { Input, Button } from "@nextui-org/react";

const Login = () => {
  const [username,setUsername] = useState()
  const [password , setPassword] = useState()
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
            onChange={(e) => setUsername(e.target.value)}
          />
          <Button className='w-full h-14'>Login</Button>
      </div>
    </div>
  )
}

export default Login
