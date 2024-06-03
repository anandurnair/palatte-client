"use client";
import React, { useState } from "react";
import { Input, Button } from "@nextui-org/react";
import OTPInput, { ResendOTP } from "otp-input-react";
import { useRouter } from "next/navigation";
import "../style.css";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { updateUser, signupUser } from "@/redux/reducers/user";
import axios from 'axios'
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const OTPform = () => {
  const router = useRouter();

  const dispatch = useDispatch();
  const [OTP, setOTP] = useState("");
  const tempUser = useSelector(state=>state.user.tempUser);

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      
      const res = await axios.post("http://localhost:4000/otp", { OTP,tempUser })
      if (res.status) {
  
        toast.success("Verified successfully");
  
        localStorage.setItem('token',JSON.stringify(res.data.token))
        dispatch(updateUser(res.data.user));
        router.push('/createProfile')
      } else {
        toast.error("Verification failed: " + res.data.error);      // router.push("/signup");
      }
    } catch (error) {
      toast.error("OTP verification failed")
    }
  
  };

  const handleResend=async()=>{
    

    const res = await axios.post("http://localhost:4000/resendOTP",{tempUser })
    if (res.status ===200) {
      alert("resended successfully");
      // dispatch(updateUser(tempUser));
      // dispatch(updateUser(null));
      // dispatch();
      // router.push("/home");
    } else {
      alert("verification faild");
      // router.push("/signup");
      console.log("error");
    }
  }
  return (
    <div className=" w-full h-full flex  py-4 ">
       <ToastContainer
        toastStyle={{ backgroundColor: "#1d2028" }}
        position="bottom-center"
      />
      <div className=" w-1/2 h-full flex justify-center items-center pl-32">
        <div className="w-full flex flex-col items-center p-28  gap-y-5 ">
          <h1 className="text-3xl font-extrabold tracking-wide">
            Welcome to <span className="bg2">Palatte</span>{" "}
          </h1>
          <p className="text-center">
            Palatte is the ultimate online haven for artists and crafters alike,
            where creativity knows no bounds. Connect, create, and share your
            masterpieces with a vibrant community of like-minded individuals.
          </p>
        </div>
      </div>
      <div className="w-2/5 h-full bg rounded-md bg-semi shadow-lg flex flex-col justify-center items-center ml-32">
        <h2 className="text-2xl font-extrabold pb-10 tracking-wider">
          {" "}
          VERIFY OTP
        </h2>
        <div className="w-2/3 flex flex-col justify-center items-center gap-y-6">
          <OTPInput
            value={OTP}
            onChange={setOTP}
            autoFocus
            OTPLength={6}
            otpType="number"
            disabled={false}
            inputStyles={{
              width: "50px",
              height: "50px",
              backgroundColor: "#111",
            }}
          />
          <ResendOTP onResendClick={handleResend} maxTime={60} className='gap-20' />

          <Button
            color=""
            className="w-full h-12 lg btn"
            variant="bordered"
            onClick={handleSubmit}
          >
            SUBMIT
          </Button>
          <p>
            Already have an account ?{" "}
            <Link href="/" className="underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default OTPform;
