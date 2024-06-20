"use client";
import React, { useState, useMemo } from "react";
import { Input, Button, Link } from "@nextui-org/react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";
import axios from "axios";
import axiosInstance from "../user/axiosConfig";

import ProtectedRoute from "../../components/user/ProtectedRoute";
import { useSelector } from "react-redux";

const ChangePasswordForm = () => {
  const user = useSelector((state) => state.user.currentUser);
  const router = useRouter();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmErr, setConfirmErr] = useState(false);
  const [fillErr, setFillErr] = useState(false);

  const validatePassword = (value) => {
    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumber = /[0-9]/.test(value);
    const isLengthValid = value.length >= 8;
    return hasUpperCase && hasLowerCase && hasNumber && isLengthValid;
  };

  const isInvalid = useMemo(() => {
    if (newPassword === "") return false;
    return !validatePassword(newPassword);
  }, [newPassword]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.post(
        "http://localhost:4000/change-password",
        { email: user.email, oldPassword: currentPassword, newPassword }
      );
      if (res.status === 200) {
        toast.success(res.data.message);
        router.push("/profile");
      } else {
        toast.error(res.data.error);
      }
    } catch (error) {
      console.log(error);
      toast.error("Invalid password");
    }
  };

  const check = (e) => {
    setConfirmPassword(e.target.value);
    setConfirmErr(e.target.value !== newPassword);
  };

  const gototForgot = () => {
    router.push("/profile/forgotPassword");
  };

  const fill = useMemo(() => {
    return currentPassword === "" || currentPassword.length < 2;
  }, [currentPassword]);

  return (
    <ProtectedRoute>
      <ToastContainer
        toastStyle={{ backgroundColor: "#20222b", color: "#fff" }}
        position="bottom-right"
      />
      <div className="w-full h-full flex justify-center items-center p-5">
        <div className="w-2/5 h-auto rounded-md bg-semi shadow-lg flex flex-col justify-center items-center px-14 py-10 gap-4">
          <h2 className="text-1xl font-semibold">Change Password</h2>
          <Input
            type="password"
            label="Current Password"
            labelPlacement="inside"
            variant="underlined"
            size="lg"
            onChange={(e) => setCurrentPassword(e.target.value)}
            isInvalid={fill}
            errorMessage="Enter the current Password"
          />
          <Input
            type="password"
            label="New Password"
            labelPlacement="inside"
            variant="underlined"
            size="lg"
            isInvalid={isInvalid}
            errorMessage={isInvalid && "Weak password !"}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <Input
            type="password"
            label="Confirm Password"
            labelPlacement="inside"
            variant="underlined"
            size="lg"
            onChange={check}
            isInvalid={confirmErr}
            errorMessage="Please enter a valid password"
          />
          <Button
            color=""
            className="w-full h-12 lg btn"
            variant="bordered"
            onClick={handleSubmit}
            disabled={isInvalid || confirmErr || fill}
          >
            SUBMIT
          </Button>
          <h2 className="underline cursor-pointer" onClick={gototForgot}>
            Forgot password
          </h2>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default ChangePasswordForm;
