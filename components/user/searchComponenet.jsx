"use client";
import React, { useState } from "react";
import ProtectedRoute from "../../components/user/ProtectedRoute";
import { Input, Button } from "@nextui-org/react";
import { FaSearch } from "react-icons/fa";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Avatar,
} from "@nextui-org/react";
import axios from "axios";
import axiosInstance from "./axiosConfig";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";

const SearchComponenet = () => {
    const router = useRouter()

    const [username,setUsername] = useState()
  const [users, setUsers] = useState([]);
  const [isFollowed, setIsFollowed] = React.useState(false);
    const hanldeSearch =async()=>{
        try {
            const res = await axiosInstance.post('http://localhost:4000/search-user',{username})
            if(res.status===200){
                setUsers(res.data.users);
                
            }
        } catch (error) {
            console.log(error)
            toast.error('Error in searching')
        }
        
    }
    const handleClick = (userId) => { // Modified to take userId
      router.push(`/userProfile?userId=${userId}`); // Pass the userId as a parameter
    };
  
  return (
    <ProtectedRoute>
         <ToastContainer
        toastStyle={{ backgroundColor: "#20222b", color: "#fff" }}
        position="bottom-right"
      />
      <div className="w-full h-full  flex flex-col items-center rounded-lg my-5 gap-y-5">
        <div className="flex w-2/5 gap-3">
          <Input
            radius="full"
            type="text"
            placeholder="Search user"
            className="w-full"
            variant="bordered"
            onChange={(e)=>setUsername(e.target.value)}
          />
          <Button  radius="full" className="btn" variant="bordered" onClick={hanldeSearch}>
            search
          </Button>
        </div>
        <div className="w-6/12  h-auto p-5 flex gap-y-4 items-center flex-col px-10 rounded-lg">
            {users.length === 0 ? <h2>No Users found</h2> : ''}
          { users.map(user =>(
            <div className="w-full"  key={user._id} onClick={() => handleClick(user._id)}>
               <Card className="w-full"   >
            <CardHeader className="justify-between">
              <div className="flex gap-5">
                <Avatar
                  isBordered
                  radius="full"
                  size="md"
                  src={user.profileImg}
                />
                <div className="flex flex-col gap-1 items-start justify-center">
                  <h4 className="text-small font-semibold leading-none text-default-600">
                    {user.fullname}
                  </h4>
                  <h5 className="text-small tracking-tight text-default-400">
                    @{user.username}
                  </h5>
                </div>
              </div>
              {/* <Button
                className={
                  isFollowed
                    ? "bg-transparent text-foreground border-default-200"
                    : ""
                }
                color="primary"
                radius="full"
                size="sm"
                variant={isFollowed ? "bordered" : "solid"}
                onPress={() => setIsFollowed(!isFollowed)}
              >
                {isFollowed ? "Unfollow" : "Follow"}
              </Button> */}
            </CardHeader>
            
            <CardFooter className="gap-3">
              <div className="flex gap-1">
                <p className="font-semibold text-default-400 text-small">{user.following.length}</p>
                <p className=" text-default-400 text-small">Following</p>
              </div>
              <div className="flex gap-1">
                <p className="font-semibold text-default-400 text-small">
                 { user.followers.length}
                </p>
                <p className="text-default-400 text-small">Followers</p>
              </div>
            </CardFooter>
          </Card>
            </div>
           
          )) }
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default SearchComponenet;
