'use client'
import React, { useEffect, useState } from 'react'
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    useDisclosure,
  } from "@nextui-org/react"
import axiosInstance from './axiosConfig';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {Card, CardHeader, CardBody, CardFooter, Avatar} from "@nextui-org/react";


const FollowersModal = ({userId}) => {
  const  [isFollowed,setIsFollowed] = useState()
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [followers,setFollowers] = useState([])
    useEffect(()=>{
        const fetchFollowersData=async()=>{
            try {
                const res = await axiosInstance.get(`http://localhost:4000/get-followers?userId=${userId}`)
                if(res.status === 200){
                    console.log(res.data.followers)
                    setFollowers(res.data.followers)
                }
            } catch (error) {
                toast.error(error)
            }

        }
        fetchFollowersData()
    },[])
  return (
    <>
    <ToastContainer
        toastStyle={{ backgroundColor: "#1d2028" }}
        position="bottom-center"
      />
     <ModalContent>
      
      {(onClose) => (
        <>
          <ModalHeader className="flex flex-col gap-1">Followers</ModalHeader>
          <ModalBody>
          {followers.map((user)=>(
        <Card className="w-full" key={user._id}>
        <CardHeader className="justify-between">
          <div className="flex gap-5">
            <Avatar isBordered radius="full" size="md" src={user.profileImg} />
            <div className="flex flex-col gap-1 items-start justify-center">
              <h4 className="text-small font-semibold leading-none text-default-600">{user.fullname}</h4>
              <h5 className="text-small tracking-tight text-default-400">@{user.username}</h5>
            </div>
          </div>
          {/* <Button
            className={isFollowed ? "bg-transparent text-foreground border-default-200" : ""}
            radius="full"
            size="sm"
            variant={isFollowed ? "bordered" : "solid"}
            onPress={() => setIsFollowed(!isFollowed)}
          >
            {isFollowed ? "Unfollow" : "Remove"}
          </Button> */}
        </CardHeader>
        
        <CardFooter className="gap-3">
          <div className="flex gap-1">
            <p className="font-semibold text-default-400 text-small">{user.following.length}</p>
            <p className=" text-default-400 text-small">Following</p>
          </div>
          <div className="flex gap-1">
            <p className="font-semibold text-default-400 text-small">{user.followers.length}</p>
            <p className="text-default-400 text-small">Followers</p>
          </div>
        </CardFooter>
      </Card>
      ))  }
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={onClose}>
              Close
            </Button>
            
          </ModalFooter>
        </>
      )}
    </ModalContent>
    </>
   
  )
}

export default FollowersModal
