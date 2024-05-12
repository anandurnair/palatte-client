"use client";
import axiosInstance from "../user/axiosConfig";
import React, { useEffect, useState } from "react";
import { Avatar, Divider, Button, Image } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "../../components/user/ProtectedRoute";


import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { logout, updateUser } from "@/redux/reducers/user";
const ProfileComponent = () => {
  const dispatch = useDispatch()
  const [userDetails, setUserDetails] = useState();
  const user = useSelector(state => state.user.currentUser);
  
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
        dispatch(updateUser(res.data.user))
      } else {
        console.log("Eror in verififcation");
        alert(res.data.error);
      }
    } catch (error) {
      dispatch(logout())
      localStorage.removeItem('token')
      router.push('/')
    }
  };

  console.log("user:", userDetails);
  return (
    <ProtectedRoute>
      

      <div className="w-full h-full mt-64 flex flex-col items-center rounded-lg my-5">
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
                  Posts <span>20</span>
                </h2>
                <h2>
                  Followers <span>30</span>
                </h2>

                <h2>
                  Following <span>40</span>
                </h2>
              </div>
            </div>
          </div>
          <div className="w-full  mt-10">
            <h2 className="text-2xl font-semibold">About</h2>
            <Divider className="my-4" />

            <div className="flex flex-col gap-7">
              <h2>{userDetails?.fullname}</h2>
              <p>{userDetails?.bio}</p>
              <p>{userDetails?.country}</p>
              <p className="font-semibold">Contact :</p>
              <p>
                Email - <span>{userDetails?.email}</span>
              </p>
              <p>
                Phone - <span>{userDetails?.phone}</span>{" "}
              </p>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default ProfileComponent;
