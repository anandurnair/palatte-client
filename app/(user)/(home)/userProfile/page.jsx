'use client'
import React from "react";
import { useSearchParams } from "next/navigation";
import UserProfileComponent from '@/components/user/userProfile'
const UserProfilePage = () => {
  const searchParams = useSearchParams();
const userId = searchParams.get('userId'); 

  return (
    <div className=" purple-dark h-full bg-background text-foreground  flex flex-col justify-center overflow-scroll">
        <UserProfileComponent userId={userId}/>
    </div>
  );
};

export default UserProfilePage;
