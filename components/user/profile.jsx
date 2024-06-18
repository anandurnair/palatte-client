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
  const dispatch = useDispatch();
  const [userDetails, setUserDetails] = useState();
  const user = useSelector((state) => state.user.currentUser);
  const [showModal, setShowModal] = useState();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const router = useRouter();
  useEffect(() => {
    fetchUserDetails();
  }, []);

  const fetchUserDetails = async () => {
    if (user.email) {
      try {
        const res = await axiosInstance.get(
          `http://localhost:4000/user-details?email=${user.email}`
        );
        if (res.status === 200) {
          setUserDetails(res.data.user);
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
    }
  };

  return (
    <ProtectedRoute>
      <div className="w-full h-auto flex flex-col items-center rounded-lg  my-5 mt-96 px-4 md:px-0">
        <div className="w-full md:w-4/5 h-full bg-semi mt-3 rounded-lg p-10 bg3  md:p-20 z-10 shadow-2xl">
          <div className="flex flex-col md:flex-row items-center">
            <div className="flex gap-4 items-center mb-4 md:mb-0">
              <Avatar
                src={userDetails?.profileImg}
                className="rounded-full w-28 h-28"
              />
            </div>
            <div className="w-full md:ml-14">
              <div className="flex flex-col md:flex-row w-full h-1/2 items-center md:items-start justify-between">
                <h2 className="text-2xl font-semibold mb-4 md:mb-0">
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
              <div className="w-full h-1/2 flex flex-col md:flex-row justify-between items-center font-semibold mt-4 md:mt-0">
                <h2 className="mb-2 md:mb-0">
                  Posts <span>2</span>
                </h2>
                <Button className="cursor-pointer" variant="" onClick={() => setShowModal('followers')} onPress={onOpen}>
                  Followers <span>{userDetails?.followers?.length}</span>
                </Button>
                <Button variant="" className="cursor-pointer" onClick={() => setShowModal('following')} onPress={onOpen}>
                  Following <span>{userDetails?.following.length}</span>
                </Button>
              </div>
            </div>
          </div>
          <div className="w-full mt-10">
            <h2 className="text-2xl font-semibold">About</h2>
            <Divider className="my-4" />
            <div className="flex flex-col gap-7">
              <h2>{userDetails?.fullname}</h2>
              <p>{userDetails?.bio}</p>
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
        {showModal === "followers" ? <FollowersModal userId={userDetails?._id} /> : <FollowingModal userId={userDetails?._id} />}
      </Modal>
    </ProtectedRoute>
  );
};

export default ProfileComponent;
