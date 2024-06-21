'use client';

import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import axiosInstance from '../user/axiosConfig';
import 'react-toastify/dist/ReactToastify.css';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Input,
} from '@nextui-org/react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import axios from 'axios';

const OTPInput = dynamic(() => import('otp-input-react').then(mod => mod.default), { ssr: false });
const ResendOTP = dynamic(() => import('otp-input-react').then(mod => mod.ResendOTP), { ssr: false });

const ForgotPasswordForm = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [OTP, setOTP] = useState('');
  const [email, setEmail] = useState('');
  const router = useRouter();
  const [emailErr, setEmailErr] = useState(false);
  const currentUser = useSelector(state => state.user.currentUser);

  const handleSubmit = async () => {
    if (email.length === '') {
      setEmailErr(true);
      return;
    }
    try {
      const res = await axiosInstance.post('http://localhost:4000/forgot-password', { email });
      if (res.status === 200) {
        toast.success(res.data.message);
        onOpen();
      } else {
        toast.error(res.data.error);
      }
    } catch (error) {
      console.error(error);
      toast.error('An error occurred. Please try again later.');
    }
  };

  const handleVerifyOTP = async () => {
    console.log('OTP : ', OTP);
    if (OTP.length !== 4) {
      toast.error('Fill the form');
      return;
    }
    try {
      const res = await axiosInstance.post('http://localhost:4000/verify-password-otp', { email, OTP });
      if (res.status === 200) {
        toast.success(res.data.message);
        if (currentUser) {
          router.push('/profile/resetPassword');
        } else {
          router.push(`/resetPassword?email=${email}`);
        }
      } else {
        toast.error(res.data.error);
      }
    } catch (error) {
      console.error(error);
      toast.error('An error occurred. Please try again later.');
    }
  };

  const handleEmail = (e) => {
    const emailValue = e.target.value;
    setEmail(emailValue);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setEmailErr(!emailRegex.test(emailValue));
  };

  const handleResend = async () => {
    const tempUser = { email };
    const res = await axios.post('http://localhost:4000/resendOTP', { tempUser });
    if (res.status === 200) {
      toast.success('Resended successfully');
    } else {
      toast.error('Verification failed');
      console.log('error');
    }
    console.log('Resend OTP clicked');
  };

  return (
    <>
      <ToastContainer />
      <div className='w-full h-full flex justify-center items-center p-5'>
        <div className='w-2/5 h-auto bg rounded-md bg-semi shadow-lg flex flex-col justify-center items-center p-10 gap-y-6'>
          <h2>Forgot Password</h2>
          <Input
            type='email'
            label='Enter your email address'
            labelPlacement='inside'
            variant='underlined'
            size='lg'
            onChange={handleEmail}
            isInvalid={emailErr}
            errorMessage='Please enter valid email'
          />
          <Button
            color=''
            className='w-full h-12 lg btn'
            variant='bordered'
            onClick={handleSubmit}
            disabled={emailErr}
          >
            Reset Password
          </Button>
        </div>
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement='top-center'>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className='flex flex-col gap-1'>Verify OTP</ModalHeader>
                <ModalBody>
                  <OTPInput
                    value={OTP}
                    onChange={setOTP}
                    autoFocus
                    OTPLength={4}
                    otpType='number'
                    disabled={false}
                    inputStyles={{
                      width: '50px',
                      height: '50px',
                      backgroundColor: '#111',
                    }}
                  />
                  <ResendOTP onResendClick={handleResend} maxTime={60} />
                </ModalBody>
                <ModalFooter>
                  <Button color='danger' variant='flat' onPress={onClose}>
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
      </div>
    </>
  );
};

export default ForgotPasswordForm;
