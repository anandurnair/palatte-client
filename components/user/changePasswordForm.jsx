
'use client'
import React, { useState } from "react";
import { Input, Button,Link } from "@nextui-org/react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from "next/navigation";
import axios from 'axios'
const changePasswordForm = () => {
    const storedUser = localStorage.getItem('currentUser')
    const user = JSON.parse(storedUser);
    const router = useRouter() 
  
    console.log('User : ',user)
    const [currentPassword,setCurrentPassword]= useState()
    const [newPassword, setNewPassword] = useState()
    const [confirmPassword, setConfirmPassword] = useState()
    const [confirmErr,setConfirmErr] = useState(false)
    const handleSubmit=async(e)=>{
        e.preventDefault()
        console.log(currentPassword,newPassword,user.email)

        const res = await axios.post("http://localhost:4000/change-password", { email:user.email, oldPassword:currentPassword ,newPassword })
        
        if (res.status === 200) {
          toast.success(res.data.message)
        } else {
          toast.error(res.data.error)
        }
    }
    const check = (e)=>{
        setConfirmPassword(e.target.value)
        if (e.target.value !== newPassword){
            setConfirmErr(true)
        }else{
            setConfirmErr(false)
        }
    }
    const gototForgot = ()=>{
      router.push('/profile/forgotPassword')
    }
  return (
    <div className="w-full h-full flex justify-center items-center p-5">
      <div className="w-2/5 h-auto bg rounded-md bg3 shadow-lg flex flex-col justify-center items-center px-14 py-10 gap-4">
      <ToastContainer toastStyle={{backgroundColor:'#20222b',color:'#fff'}} position="bottom-right" />

        <h2 className="text-1xl font-semibold">Change Password</h2>
        <Input
            type="text"
            label="Current Password"
            labelPlacement="inside"
            variant="underlined"
            size="lg"
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
          <Input
            type="text"
            label="New Password"
            labelPlacement="inside"
            variant="underlined"
            size="lg"
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        <Input
            type="text"
            label="Confirm Password"
            labelPlacement="inside"
            variant="underlined"
            size="lg"
            onChange={(e) => check(e)}
            isInvalid={confirmErr}
      errorMessage="Please enter a valid password"
          />
         

          <Button
            color=""
            className="w-full h-12 lg btn"
            variant="bordered"
            onClick={handleSubmit}
          >
            SUBMIT
          </Button>
            <h2 className="underline" onClick={gototForgot}>Forgot password</h2>         

      </div>
    </div>
  );
};

export default changePasswordForm;
