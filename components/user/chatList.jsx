import React, { useEffect, useState } from "react";
import ProtectedRoute from "../../components/user/ProtectedRoute";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Avatar,
  Button,
} from "@nextui-org/react";
import axiosInstance from "./axiosConfig";
const url = process.env.NEXT_PUBLIC_API_URL;


const ChatListComponent = ({conversation,currentUser}) => {
 const [user,setUser] = useState(null);
 useEffect(()=>{
  const friendId = conversation.members.find((m)=> m!==currentUser._id)
  const getUser = async()=>{
    try {
      const res = await axiosInstance.get(`${url}/getUserById?userId=${friendId}`);
      setUser(res.data.user)
      console.log("Conversations :",res.data.user);
    } catch (error) {
      alert(error)
    }
    
  }
  getUser()
 },[conversation,currentUser])
  return (
    <>
     <Card className="w-full mb-3 cursor-pointer">
            <CardHeader className="justify-between">
              <div className="flex gap-5">
                <Avatar
                  isBordered
                  radius="full"
                  size="md"
                  src={user?.profileImg}
                />
                <div className="flex flex-col gap-1 items-start justify-center">
                  <h4 className="text-small font-semibold leading-none text-default-600">
                    {user?.fullname}
                  </h4>
                  <h5 className="text-small tracking-tight text-default-400">
                    @{user?.username}
                  </h5>
                </div>
              </div>

              <p className="text-xs font-thin">click to chat</p>
            </CardHeader>
            <CardBody className="px-3 py-0 text-small text-default-400"></CardBody>
          </Card>
    </>
   
  );
};

export default ChatListComponent;
