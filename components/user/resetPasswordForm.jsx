'use client'
import React, { useState } from 'react'
import { Input, Button,Link } from "@nextui-org/react";
import axios from 'axios'
import { useRouter, useSearchParams } from 'next/navigation';
import axiosInstance from '../user/axiosConfig'
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";

const   ResetPasswordForm =  () => {

  const currentUser = useSelector(state => state.user.currentUser)

  const searchParams = useSearchParams();
  const paramEmail = searchParams.get("email"); 
  const router = useRouter()
  const user = useSelector(state => state.user.currentUser);

    const [newPassword,setPassword] =useState('')
    const [confirmPassword,setConfirmPassword]= useState('')

    const handleSubmit=async()=>{
      if(newPassword === '' || confirmPassword === ""){
        toast.error('Fill the form');
        return;
      }
      if(newPassword !== confirmPassword){
        toast.error("Passwords are not matching");
        return;
      }
      const validatePassword = (password) => {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
        return regex.test(password);
      };

      if (!validatePassword(newPassword)) {
        toast.error("Password must be at least 6 characters long and include at least one uppercase letter, one lowercase letter, and one number.");
        return;
      }
      let res;
      if(currentUser){

         res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/reset-password`,{email : user.email, newPassword })
      }else{
        res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/reset-password`,{email : paramEmail, newPassword })

      }
      
    if (res.status ===200) {
      // toast.success(res.data.message);
      toast.success(res.data.message)
      if(currentUser){

        router.push('/profile')
      }else{
        router.push('/')

      }
    } else {
      console.log('failed')
      // toast.error(res.data.error);
      toast.error(res.data.error)
    }
    }
  return (
  
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
             
  )
}

export default ResetPasswordForm
