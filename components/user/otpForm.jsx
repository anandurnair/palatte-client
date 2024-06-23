"use client";
import React, { useState } from "react";
import { Input, Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import "../style.css";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { updateUser, signupUser } from "@/redux/reducers/user";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import dynamic from 'next/dynamic';
const OTPInput = dynamic(() => import('otp-input-react').then(mod => mod.OTPInput), { ssr: false });
const ResendOTP = dynamic(() => import('otp-input-react').then(mod => mod.ResendOTP), { ssr: false });
const OTPform = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [OTP, setOTP] = useState("");
  const tempUser = useSelector((state) => state.user.tempUser);

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();

      const res = await axios.post("http://localhost:4000/otp", { OTP, tempUser });
      if (res.status) {
        toast.success("Verified successfully");

        localStorage.setItem("token", JSON.stringify(res.data.token));
        dispatch(updateUser(res.data.user));
        router.push("/createProfile");
      } else {
        toast.error("Verification failed: " + res.data.error);
      }
    } catch (error) {
      toast.error("OTP verification failed");
    }
  };

  const handleResend = async () => {
    const res = await axios.post("http://localhost:4000/resendOTP", { tempUser });
    if (res.status === 200) {
      toast.success("Resended successfully");
    } else {
      toast.error("Verification failed");
      console.log("error");
    }
  };

  return (
    <div className="w-full h-full flex flex-col lg:flex-row py-4">
      <ToastContainer toastStyle={{ backgroundColor: "#1d2028" }} position="bottom-center" />
      <div className="w-full lg:w-1/2 flex justify-center items-center px-4 lg:px-32 py-10 lg:py-0">
        <div className="w-full flex flex-col items-center gap-y-5 text-center">
          <h1 className="text-3xl font-extrabold tracking-wide">
            Welcome to <span className="text-teal-500">Palatte</span>
          </h1>
          <p>
            Palatte is the ultimate online haven for artists and crafters alike,
            where creativity knows no bounds. Connect, create, and share your
            masterpieces with a vibrant community of like-minded individuals.
          </p>
        </div>
      </div>
      <div className="w-full lg:w-1/3  flex flex-col justify-center items-center bg-neutral-900 shadow-large shadow-slate-400 rounded-lg p-10 lg:p-24 lg:m-24">
        <h2 className="text-2xl font-extrabold pb-10 tracking-wider text-teal-500">VERIFY OTP</h2>
        <div className="w-full flex flex-col justify-center items-center gap-y-5">
          <OTPInput
            value={OTP}
            onChange={setOTP}
            autoFocus
            OTPLength={4}
            otpType="number"
            disabled={false}
            inputStyles={{
             width: "3rem",
             height : "3rem",
              backgroundColor: "#111",
            }}
            className="otp-input"
          />
          <ResendOTP onResendClick={handleResend} maxTime={60} className="gap-20" />

          <Button
            color=""
            className="w-full h-12 lg:btn"
            variant="bordered"
            onClick={handleSubmit}
          >
            SUBMIT
          </Button>
          <p>
            Already have an account?{" "}
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
