"use client";
import axiosInstance from "../user/axiosConfig";
import React, { useEffect, useState } from "react";
import { Avatar, Divider, Button, Image } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "../../components/user/ProtectedRoute";
import { Chip } from "@nextui-org/react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/react";
import FollowersModal from '@/components/user/followersModal'
import FollowingModal from '@/components/user/followingModal'
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { logout, updateUser } from "@/redux/reducers/user";
const ProfileComponent = () => {
  const [services, setServices] = useState([]);
  const dispatch = useDispatch();
  const [userDetails, setUserDetails] = useState();
  const user = useSelector((state) => state.user.currentUser);
  const [showModal,setShowModal] = useState() 
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const router = useRouter();
  useEffect(() => {
    fetchUserDetails();
  }, []);

  const fetchUserDetails = async () => {
    try {
      const res = await axiosInstance.get(
        `http://localhost:4000/user-details?email=${user.email}`
      );
      if (res.status === 200) {
        setUserDetails(res.data.user);
        const allServices = res.data.user.services;
        setServices(allServices);
        dispatch(updateUser(res.data.user));
      } else {
        console.log("Eror in verififcation");
        alert(res.data.error);
      }
    } catch (error) {
      dispatch(logout());
      localStorage.removeItem("token");
      router.push("/");
    }
  };

  console.log("user:", userDetails);
  return (
    <ProtectedRoute>
      <div className="w-full h-auto mt-96 flex flex-col items-center rounded-lg my-5">
        {/* <div className="w-full h-72 bg-slate-500 rounded-lg overflow-hidden">
          <Image
            className="w-screen"
            alt="NextUI hero Image"
            src="https://img.freepik.com/premium-photo/colorful-psychedelic-abstract-wallpaper_168892-2466.jpg?size=626&ext=jpg&ga=GA1.1.2008272138.1712793600&semt=ais"
          />
        </div> */}
        <div className="w-4/5 h-full bg-semi mt-3 rounded-lg p-20 z-10 shadow-2xl">
          <div className="flex">
            <div className="flex gap-4 items-center">
              <Avatar
                src={userDetails?.profileImg}
                className="rounded-full w-28 h-28"
              />
            </div>
            <div className="w-full ml-14">
              <div className="flex w-full h-1/2 items-center justify-between">
                <h2 className="text-2xl font-semibold">
                  {userDetails?.username}
                </h2>
                <div className="flex gap-4">
                  <Button
                    variant="bordered"
                    onClick={() => router.push("/profile/editProfile")}
                  >
                    Edit Profile
                  </Button>
                  <Button
                    variant="bordered"
                    onClick={() => router.push("/profile/changePassword")}
                  >
                    Change Password
                  </Button>
                </div>
              </div>
              <div className="w-full h-1/2 flex justify-between items-center font-semibold">
                <h2>
                  Posts <span>2</span>
                </h2>
                <Button className="cursor-pointer" variant="" onClick={()=>setShowModal('followers')} onPress={onOpen}>
                  Followers <span>{userDetails?.followers?.length}</span>
                </Button>

                <Button variant="" className="cursor-pointer" onClick={()=>setShowModal('following')} onPress={onOpen}>
                  Following <span>{userDetails?.following.length}</span>
                </Button>
              </div>
            </div>
          </div>
          <div className="w-full  mt-10">
            <h2 className="text-2xl font-semibold">About</h2>
            <Divider className="my-4" />

            <div className="flex flex-col gap-7">
              <h2>{userDetails?.fullname}</h2>
              <p>{userDetails?.bio}</p>
              <div className="flex gap-x-3">
                <p className="font-bold">Services :</p>
                {services.map((service) => (
                  <Chip size="lg">{service.serviceName}</Chip>
                ))}
              </div>
              {/* <p className="font-semibold">Contact :</p> */}
              <p className="flex gap-2">
                <span className="font-bold">Email</span>
                <span className="text-gray-400">{userDetails?.email}</span>
              </p>
              <p className="flex gap-2">
                <span className="font-bold">Phone</span>
                <span className="text-gray-400">{userDetails?.phone}</span>
              </p>
              <p className="flex gap-2">
                <span className="font-bold">Place</span>
                <span className="text-gray-400">{userDetails?.country}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        {(showModal === "followers") ? <FollowersModal userId={userDetails?._id} /> : <FollowingModal userId={userDetails?._id}/>}
      </Modal>
    </ProtectedRoute>
  );
};

export default ProfileComponent;
