
'use client'
import React, { useState } from "react";
import { Input, Button,Link } from "@nextui-org/react";

const changePasswordForm = () => {
    const [currentPassword,setCurrentPassword]= useState()
    const [newPassword, setNewPassword] = useState()
    const [confirmPassword, setConfirmPassword] = useState()
    const [confirmErr,setConfirmErr] = useState(false)
    const handleSubmit=async(e)=>{
        e.preventDefault()
        console.log(currentPassword,newPassword,confirmPassword)
    }
    const check = (e)=>{
        setConfirmPassword(e.target.value)
        if (e.target.value !== newPassword){
            setConfirmErr(true)
        }else{
            setConfirmErr(false)
        }
    }
  return (
    <div className="w-full h-full flex justify-center items-center p-5">
      <div className="w-2/5 h-auto bg rounded-md bg3 shadow-lg flex flex-col justify-center items-center p-10 gap-4">
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
          <Link href="#" color="foreground">Foreground</Link>

      </div>
    </div>
  );
};

export default changePasswordForm;
