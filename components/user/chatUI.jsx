"use client";
import React, { useState, useEffect, useRef } from "react";
import ProtectedRoute from "../../components/user/ProtectedRoute";
import { Card, CardHeader, CardBody, Avatar, Input } from "@nextui-org/react";
import { format } from "timeago.js";
import axiosInstance from "./axiosConfig";
import { FaVideo, FaPhoneAlt } from "react-icons/fa";
import { BsThreeDotsVertical } from "react-icons/bs";
import { io } from "socket.io-client";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/react";
import { TiTick } from "react-icons/ti";
import dynamic from 'next/dynamic';
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@nextui-org/react";
import { FaCheckDouble } from "react-icons/fa6";

const VideoCallComponent = dynamic(() => import('@/components/user/videoCallComponent'), { ssr: false });
const ChatUI = ({
  setUpdate,
  messages,
  setMessages,
  currentUser,
  user,
  socket,
  currentChat,
  arrivalMessage,
  setArrivalMessage,
}) => {
  const [isVideoCall, setIsVideoCall] = useState(false);
  const scrollRef = useRef();
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    if (!socket.current) {
      socket.current = io(process.env.NEXT_PUBLIC_SOCKET_URI);
    }

    socket.current.on("msgSeen", (data) => {
      if (currentUser?._id === data?.senderId) {
        const updatedMessages = messages.map((m) => {
          if (m.sender === currentUser._id) {
            return { ...m, status: "seen" };
          }
          return m;
        });
        setMessages(updatedMessages);
      }
    });

    return () => {
      if (socket.current) {
        socket.current.off("msgSeen");
      }
    };
  }, [currentUser?._id, messages, setMessages, socket]);

  useEffect(() => {
    const updateData = async () => {
      if (!currentChat) return;
      try {
        const res = await axiosInstance.patch("/update-message-status", {
          conversationId: currentChat?._id,
          senderId: currentUser?._id,
        });
        console.log("MEssage seen by : ",currentUser?._id)
        socket.current.emit("seen", {
          receiverId: currentUser?._id,
          senderId: user?._id,
          conversationId: currentChat._id,
        });
        setUpdate((prev) => !prev);
      } catch (error) {
        console.error(error);
      }
    };
    updateData();
  }, [currentChat, currentUser?._id, setUpdate, user?._id, socket]);

  useEffect(() => {
    if (arrivalMessage && currentChat?.members.includes(arrivalMessage.sender)) {
      const messageExists = messages.find((msg) => msg._id === arrivalMessage._id);
      if (!messageExists) {
        setMessages((prev) => [...prev, arrivalMessage]);
      }
    }
  }, [arrivalMessage, currentChat, messages, setMessages]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    const message = {
      sender: currentUser?._id,
      text: newMessage,
      conversationId: currentChat._id,
    };

    const receiverId = currentChat.members.find(
      (member) => member !== currentUser?._id
    );
    socket.current.emit("sendMessage", {
      senderId: currentUser?._id,
      receiverId,
      text: newMessage,
      isGroup: false,
    });

    try {
      const res = await axiosInstance.post(
        `${process.env.NEXT_PUBLIC_API_URL}/messages`,
        message
      );
      setMessages([...messages, res.data.savedMessage]);
      setNewMessage("");
    } catch (error) {
      console.error(error);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSend(e);
    }
  };

  const handleVideoCall = async () => {
    const userId = user._id;
    socket.current.emit("call", currentUser, user);

    const members = [currentUser._id, userId];
    try {
      await axiosInstance.post("/saveCalls", members);
    } catch (error) {
      alert(error);
    }
  };

  return (
    <ProtectedRoute>
      <div className="h-full w-full flex flex-col pb-4 rounded-lg">
        <Card className="w-full h-1/6">
          <CardHeader className="justify-between px-5 py-5">
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
                  {user?.username}
                </h5>
              </div>
            </div>
            <div className="flex gap-4">
              {isVideoCall ? (
                <Button
                  variant=""
                  onClick={() => setIsVideoCall((prev) => !prev)}
                >
                  <p>Cut call</p>
                </Button>
              ) : (
                <Button
                  variant=""
                  isIconOnly
                  onClick={() => {
                    handleVideoCall();
                    setIsVideoCall((prev) => !prev);
                  }}
                >
                  <FaVideo size={20} />
                </Button>
              )}

              <Dropdown>
                <DropdownTrigger>
                  <Button variant="" isIconOnly>
                    <BsThreeDotsVertical size={20} />
                  </Button>
                </DropdownTrigger>
                <DropdownMenu aria-label="Static Actions">
                  <DropdownItem key="new">Delete chat</DropdownItem>
                  <DropdownItem
                    key="delete"
                    className="text-danger"
                    color="danger"
                  >
                    close
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
          </CardHeader>
        </Card>

        {isVideoCall ? (
          <VideoCallComponent
            currentUser={currentUser}
            receiverId={user._id}
          />
        ) : (
          <>
            <div className="w-full h-5/6 bg-lightDark p-4 overflow-y-auto">
              {messages.map((msg, index) => (
                <div ref={scrollRef} key={index}>
                  <Message
                    setUpdate={setUpdate}
                    messageId={msg._id}
                    message={msg.text}
                    avatar={user?.profileImg}
                    isCurrentUser={msg.sender === currentUser?._id}
                    time={format(msg.createdAt)}
                    status={msg.status}
                  />
                </div>
              ))}
            </div>
            <div className="w-full h-1/6 flex p-3 gap-2">
              <Input
                variant="bordered"
                type="text"
                value={newMessage}
                placeholder="Type message here"
                onChange={(e) => {
                  setNewMessage(e.target.value);
                }}
                onKeyDown={handleKeyDown}
              />
              <Button onClick={handleSend}>Send</Button>
            </div>
          </>
        )}
      </div>
    </ProtectedRoute>
  );
};

export default ChatUI;

const Message = ({
  setUpdate,
  messageId,
  message,
  isCurrentUser,
  avatar,
  time,
  status,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleDeleteMessage = async () => {
    try {
      await axiosInstance.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/delete-message?messageId=${messageId}`
      );
      setUpdate((prev) => !prev);
    } catch (error) {
      alert(error);
    }
  };

  return (
    <div
      className={`flex ${isCurrentUser ? "justify-end" : "justify-start"} mb-2`}
    >
      {!isCurrentUser && (
        <Avatar
          isBordered
          radius="full"
          size="sm"
          src={avatar}
          className="mr-2"
        />
      )}
      <Card
        className={`max-w-xs ${
          isCurrentUser ? "bg-blue-500 text-white" : "bg-gray-700 text-gray-200"
        }`}
      >
        <CardBody>
          <p>{message}</p>
          <div className="flex gap-3">
            <p className="text-xs">{time}</p>
            {isCurrentUser &&
              (status === "seen" ? (
                <FaCheckDouble size={15} />
              ) : (
                status === "delivered" && <TiTick size={15} />
              ))}
          </div>
        </CardBody>
      </Card>
      {isCurrentUser ? (
        <div className="flex gap-4">
          <Dropdown>
            <DropdownTrigger>
              <Button variant="" isIconOnly>
                <BsThreeDotsVertical size={20} />
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Static Actions">
              <DropdownItem key="deleteMessage" onPress={onOpen}>
                Delete message
              </DropdownItem>
              <DropdownItem key="close" className="text-danger" color="danger">
                Close
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      ) : (
        ""
      )}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          <>
            <ModalHeader className="flex flex-col gap-1">
              Confirm Delete
            </ModalHeader>
            <ModalBody>
              <p>Are you sure you want to delete this message?</p>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Cancel
              </Button>
              <Button
                color="primary"
                onClick={() => {
                  handleDeleteMessage();
                  onClose();
                }}
              >
                Delete
              </Button>
            </ModalFooter>
          </>
        </ModalContent>
      </Modal>
    </div>
  );
};
