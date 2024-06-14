"use client";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";
import { Card, CardHeader, Avatar, Button } from "@nextui-org/react";
import { IoIosClose } from "react-icons/io";
import axiosInstance from "./axiosConfig";

const NotificationComponent = () => {
  const [notifications, setNotifications] = useState([]);
  const currentUser = useSelector((state) => state.user.currentUser);
  const socket = useRef(null);

  useEffect(() => {
    if (!currentUser) return;
    
    const fetchNotifications = async () => {
      try {
        const res = await axiosInstance.get(`/get-notifications?userId=${currentUser._id}`);
        setNotifications(res.data.notifications);
      } catch (error) {
        alert(error);
      }
    };

    fetchNotifications();
    
    socket.current = io(process.env.NEXT_PUBLIC_API_URL);

    socket.current.on("notification", (toUser, text, fromUser) => {
      if (currentUser?._id === toUser?._id && currentUser?._id !== fromUser?._id) {
        const newNotification = { text, fromUser };
        setNotifications((prevNotifications) => [...prevNotifications, newNotification]);
        postNotification(toUser?._id, text, fromUser?._id);
      }
    });

    return () => {
      if (socket.current) {
        socket.current.disconnect();
      }
    };
  }, [currentUser]);

  const postNotification = async (userId, text, user) => {
    try {
      await axiosInstance.post("/post-notification", {
        userId,
        text,
        user,
      });
    } catch (error) {
      alert(error);
    }
  };

  const handleClose = async (indexToRemove) => {
    const newArray = notifications.filter(
      (notification, index) => index !== indexToRemove
    );
    setNotifications(newArray);
    
    try {
      await axiosInstance.delete(`/remove-notification?index=${indexToRemove}&&userId=${currentUser._id}`);
    } catch (error) {
      alert(error);
    }
  };

  const handleClearAll = async () => {
    setNotifications([]);
    
    try {
      await axiosInstance.delete(`/remove-all-notifications?userId=${currentUser._id}`);
    } catch (error) {
      alert(error);
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center">
      <div className="w-full flex justify-center">
        <h2>Notifications</h2>
      </div>
      <div className="w-full flex justify-end m-1">
        <Button size="sm" onClick={handleClearAll}>
          <p>Clear all</p>
        </Button>
      </div>
      <div className="w-full items-center h-full py-5 gap-y-2 overflow-y-auto">
        {notifications.length > 0 &&
          notifications.map((notification, index) => (
            <Card className="w-full mb-2 bg-semiDark" key={index}>
              <CardHeader className="justify-between">
                <div className="flex gap-5">
                  <Avatar
                    isBordered
                    radius="full"
                    size="sm"
                    src={notification?.fromUser?.profileImg}
                  />
                  <div className="flex flex-col gap-1 items-start justify-center">
                    <h5 className="text-small tracking-tight text-neutral-300">
                      {notification?.text}
                    </h5>
                  </div>
                </div>
                <Button
                  radius="full"
                  size="sm"
                  isIconOnly
                  variant=""
                  onClick={() => handleClose(index)}
                >
                  <IoIosClose color="grey" size={30} />
                </Button>
              </CardHeader>
            </Card>
          ))}
      </div>
    </div>
  );
};

export default NotificationComponent;
