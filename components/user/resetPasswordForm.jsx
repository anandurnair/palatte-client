'use client'
import React, { useState } from 'react'
import { Input, Button,Link } from "@nextui-org/react";
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios'
import { useRouter } from 'next/navigation';
const ResetPasswordForm =  () => {
  const router = useRouter()
    const storedUser  = localStorage.getItem('currentUser')
    const user = JSON.parse(storedUser)
    const [newPassword,setPassword] =useState()
    const [confirmPassword,setConfirmPassword]= useState()

    const handleSubmit=async()=>{
        const res = await axios.post("http://localhost:4000/reset-password",{email : user.email, newPassword })
      
    if (res.status ===200) {
      console.log('success')
      // toast.success(res.data.message);
      alert(res.data.message)
      router.push('/profile')
    } else {
      console.log('failed')
      // toast.error(res.data.error);
      alert(res.data.error)
    }
    }
  return (
    <>
     <ToastContainer  toastStyle={{ backgroundColor: "#1d2028" }}/>
    <div className='w-full h-full flex justify-center items-center p-5'>

        <div className='w-2/5 h-auto bg rounded-md bg3 shadow-lg flex flex-col justify-center items-center px-14 py-10 gap-4'>
            <h2>Reset password</h2>
            <Input
            type="text"
            label="New Password"
            labelPlacement="inside"
            variant="underlined"
            size="lg"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Input
            type="text"
            label="Confirm Password"
            labelPlacement="inside"
            variant="underlined"
            size="lg"
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
             <Button
            color=""
            className="w-full h-12 lg btn"
            variant="bordered"
            onClick={handleSubmit}
          >Reset</Button>
        </div>
    </div>
    </>
             
  )
}

export default ResetPasswordForm
