import React, { useEffect, useState } from "react";
import ProtectedRoute from "../../components/user/ProtectedRoute";
import { Card, CardHeader, CardBody, Avatar, Badge,Chip } from "@nextui-org/react";
import axiosInstance from "./axiosConfig";
import { useSelector } from "react-redux";
const url = process.env.NEXT_PUBLIC_API_URL;

const ChatListComponent = ({
  conversation,
  currentUser,
  user,
  setUser,
  setCurrentChat,
  onlineUsers = [], // Default to an empty array
}) => {
  const [receiver, setReceiver] = useState(null);
  const current = useSelector((state) => state.user.currentUser);

  useEffect(() => {
    const friendId = conversation.members.find((m) => m !== currentUser?._id);
    const getUser = async () => {
      try {
        if (current) {
          const res = await axiosInstance.get(
            `${url}/getUserById?userId=${friendId}`
          );
          setReceiver(res.data.user);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getUser();
  }, [currentUser]);

  const handleClick = () => {
    setCurrentChat(conversation);
    setUser(receiver);
  };

  return (
    <div onClick={handleClick}>
      <Card className="w-full mb-3 cursor-pointer">
        <CardHeader className="justify-between">
          <div className="flex gap-5">
            {onlineUsers.includes(receiver?._id) ? ( // Use receiver?._id here
              <Badge
                content=""
                color="success"
                shape="circle"
                placement="bottom-right"
              >
                <Avatar
                  isBordered
                  radius="full"
                  size="md"
                  src={receiver?.profileImg}
                />
              </Badge>
            ) : (
              <Avatar
                isBordered
                radius="full"
                size="md"
                src={receiver?.profileImg}
              />
            )}

            <div className="flex flex-col gap-1 items-start justify-center">
              <h4 className="text-small font-semibold leading-none text-default-600">
                {receiver?.fullname}
              </h4>
              <h5 className="text-small tracking-tight text-default-400">
                @{receiver?.username}
              </h5>
            </div>
          </div>

          {conversation?.unreadCount === 0 ? (
  <p className="text-xs font-thin">click to chat</p>
) : currentUser._id !== conversation.lastSenderId ? (
  <Chip size="sm" color="success"><p className="font-bold">{conversation.unreadCount}</p></Chip>
) : (
  <p className="text-xs font-thin">click to chat</p>
)}
        </CardHeader>
        <CardBody className="px-3 py-0 text-small text-default-400"></CardBody>
      </Card>
    </div>
  );
};

export default ChatListComponent;
