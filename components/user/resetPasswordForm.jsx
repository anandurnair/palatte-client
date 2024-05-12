'use client'
import React, { useState } from 'react'
import { Input, Button,Link } from "@nextui-org/react";
import axios from 'axios'
import { useRouter } from 'next/navigation';
import axiosInstance from '../user/axiosConfig'
import ProtectedRoute from "../../components/user/ProtectedRoute";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";

const ResetPasswordForm =  () => {
  const router = useRouter()
  const user = useSelector(state => state.user.currentUser);

    const [newPassword,setPassword] =useState()
    const [confirmPassword,setConfirmPassword]= useState()

    const handleSubmit=async()=>{
        const res = await axiosInstance.post("http://localhost:4000/reset-password",{email : user.email, newPassword })
      
    if (res.status ===200) {
      console.log('success')
      // toast.success(res.data.message);
      toast.success(res.data.message)
      router.push('/profile')
    } else {
      console.log('failed')
      // toast.error(res.data.error);
      toast.error(res.data.error)
    }
    }
  return (
    <ProtectedRoute>

    <>
    <ToastContainer
        toastStyle={{ backgroundColor: "#1d2028" }}
        position="bottom-center"
      />    <div className='w-full h-full flex justify-center items-center p-5'>

        <div className='w-2/5 h-auto  rounded-md bg-semi shadow-lg flex flex-col justify-center items-center px-14 py-10 gap-4'>
            <h2>Reset password</h2>
            <Input
            type="password"
            label="New Password"
            labelPlacement="inside"
            variant="underlined"
            size="lg"
            onChange={(e) => setPassword(e.target.value)}
            required
            />
          <Input
            type="password"
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
             
            </ProtectedRoute>
  )
}

export default ResetPasswordForm
