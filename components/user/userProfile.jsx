"use client";
import React, { useEffect, useState } from "react";
import ProtectedRoute from "../../components/user/ProtectedRoute";
import axiosInstance from "./axiosConfig";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Avatar, Divider, user } from "@nextui-org/react";
import { useDispatch, useSelector } from "react-redux";
import { Card, CardBody, CardFooter, Image } from "@nextui-org/react";
import { updateUser } from "@/redux/reducers/user";
import { IoMdMore } from "react-icons/io";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import FollowersModal from '@/components/user/followersModal'
import FollowingModal from '@/components/user/followingModal'
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";
const UserProfileComponent = ({ userId }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [showModal,setShowModal] = useState() 

  const [followers, setFollowers] = useState();
  const dispatch = useDispatch();
  const [posts, setPosts] = useState([]);
  const [isFollowed, setIsFollowed] = useState(false);
  const currentUser = useSelector((state) => state.user.currentUser);
  console.log("current user :", currentUser);
  const [userDetails, setUserDetails] = useState();
  useEffect(() => {
    try {
      const fetchUserData = async () => {
        const res = await axiosInstance.get(
          `http://localhost:4000/getUserById?userId=${userId}`
        );
        if (res.status === 200) {
          console.log("uuuser : ", res.data.user);
          const user = res.data.user;
          setIsFollowed(currentUser.following.includes(user._id));
          setFollowers(user.followers.length);
          setPosts(res.data.posts);
          setUserDetails(user);
        }
      };

      fetchUserData();
    } catch (error) {
      toast.error(error);
    }
  }, []);

  const hanldeFollow = async () => {
    try {
      console.log("user id ");
      const res = await axiosInstance.post(
        "http://localhost:4000/follow-user",
        { currentUserId: currentUser._id, userId }
      );
      if (res.status === 200) {
        if (res.data.message === "Followed") {
          setFollowers((prev) => prev + 1);
        } else {
          setFollowers((prev) => prev - 1);
        }
        dispatch(updateUser(res.data.user));
        toast.success(res.data.message);
      }
    } catch (err) {
      toast.error(err);
    }
    setIsFollowed((prev) => !prev);
  };

  return (
    <ProtectedRoute>
      <ToastContainer
        toastStyle={{ backgroundColor: "#1d2028" }}
        position="bottom-center"
      />
      <div className="w-full h-full mt-72 flex flex-col items-center rounded-lg my-5">
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
                    className="btn"
                    onClick={hanldeFollow}
                  >
                    {isFollowed ? "Unfollow" : "follow"}
                  </Button>
                  <Button variant="bordered" className="btn">
                    message
                  </Button>
                  <Dropdown>
                    <DropdownTrigger>
                      <Button isIconOnly className="" variant="">
                        <IoMdMore size={25} />
                      </Button>
                    </DropdownTrigger>
                    <DropdownMenu aria-label="Static Actions">
                      <DropdownItem key="new">Report user</DropdownItem>
                      {/* <DropdownItem key="edit">Unfollow</DropdownItem> */}
                      <DropdownItem
                        key="delete"
                        className="text-danger"
                        color="danger"
                      >
                        Cancel{" "}
                      </DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                </div>
              </div>
              <div className="w-full h-1/2 flex justify-between items-center font-semibold">
                <h2>
                  Posts<span> {posts.length}</span>
                </h2>
                <Button className="cursor-pointer" variant="" onClick={()=>setShowModal('followers')} onPress={onOpen}>
                  Followers <span>{followers}</span>
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
      <div className="w-full h-full flex flex-col items-center rounded-lg my-5">
        <div className="w-4/5 h-full bg-semi  flex flex-col mt-3 rounded-lg p-10  gap-y-3 z-10 shadow-2xl">
          <h1 className="text-1xl">
            {posts.length === 0 ? "No posts" : "Posts"}
          </h1>
          <div className="gap-2 grid grid-cols-2 sm:grid-cols-4">
            {posts.map((item, index) => (
              <Card
                shadow="sm"
                key={index}
                isPressable
                onPress={() => console.log("item pressed")}
              >
                <CardBody className="overflow-visible p-0">
                  <Image
                    shadow="sm"
                    radius="lg"
                    width="100%"
                    alt={item.caption}
                    className="w-full object-cover h-[140px]"
                    src={item.images}
                  />
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      </div>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        {(showModal === "followers") ? <FollowersModal userId={userId} /> : <FollowingModal userId={userId}/>}
      </Modal>
    </ProtectedRoute>
  );
};

export default UserProfileComponent;
