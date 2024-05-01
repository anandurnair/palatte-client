"use client";
import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Checkbox,
  Input,
  Link,
} from "@nextui-org/react";
import OTPInput, { ResendOTP } from "otp-input-react";
import axios from "axios";
import { useRouter } from "next/navigation";

const ForgotPasswordForm = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [OTP, setOTP] = useState("");
  const [email, setEmail] = useState("");
  const router = useRouter();

  const handleSubmit = async () => {
    console.log("working");
    try {
      const res = await axios.post("http://localhost:4000/forgot-password", {
        email,
      });

      if (res.status === 200) {
        toast.success(res.data.message);
        onOpen(); // Open the modal after successful request
      } else {
        toast.error(res.data.error);
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred. Please try again later.");
    }
  };

  const handleVerifyOTP = async () => {
    try {
      const res = await axios.post("http://localhost:4000/verify-password-otp", {
        email,
        OTP,
      });
      if (res.status === 200) {
        toast.success(res.data.message);
        router.push("/profile/resetPassword");
      } else {
        toast.error(res.data.error);
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred. Please try again later.");
    }
  };

  const handleResend = () => {
    // Implement resend OTP logic (optional)
    console.log("Resend OTP clicked");
  };

  return (
    <div className="w-full h-full flex justify-center items-center p-5">
      <div className="w-2/5 h-auto bg rounded-md bg3 shadow-lg flex flex-col justify-center items-center p-10 gap-y-6">
        <h2>Forgot Password</h2>
        <Input
          type="email"
          label="Enter your email address"
          labelPlacement="inside"
          variant="underlined"
          size="lg"
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Button
          color="" // Use default color
          className="w-full h-12 lg btn"
          variant="bordered"
          onClick={handleSubmit}
        >
          Reset Password
        </Button>
      </div>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="top-center">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Verify OTP
              </ModalHeader>
              <ModalBody>
                <OTPInput value={OTP} onChange={setOTP} autoFocus OTPLength={6} otpType="number" disabled={false} inputStyles={{ width: "50px", height: "50px", backgroundColor: "#111" }} />
                <ResendOTP onResendClick={handleResend} maxTime={60} />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="flat" onPress={onClose}>
                  Close
                </Button>
                <Button onPress={onClose} onClick={handleVerifyOTP}>
                  Verify
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <ToastContainer />
    </div>
  );
};

export default ForgotPasswordForm;
