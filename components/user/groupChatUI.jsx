"use client";
import React, { useState, useEffect, useRef } from "react";
import ProtectedRoute from "../../components/user/ProtectedRoute";
import { Card, CardHeader, CardBody, Avatar, Input } from "@nextui-org/react";
import { FaVideo, FaPhoneAlt } from "react-icons/fa";
import { BsThreeDotsVertical } from "react-icons/bs";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";
import GroupVideoCall from '@/components/user/GroupVideoCall'
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";

import { format } from "timeago.js";
import axiosInstance from "./axiosConfig";
const url = process.env.NEXT_PUBLIC_API_URL;

const ChatUI = ({
  messages,
  setMessages,
  currentUser,
  user,
  socket,
  currentChat,
  arrivalMessage,
  setArrivalMessage,
  setUpdate,
}) => {

  const scrollRef = useRef();
  const [newMessage, setNewMessage] = useState("");
  const [users, setUsers] = useState([]);
  const [isVideoCall, setIsVideoCall] = useState(false);
  const fetchedUsers = useRef(new Set());
  useEffect(() => {
    const fetchUser = async (userId) => {
      try {
        const res = await axiosInstance.get(
          `${url}/getUserById?userId=${userId}`
        );

        setUsers((prevUsers) => [...prevUsers, res.data.user]);

        setMessages((prevMessages) =>
          prevMessages.map((message) =>
            message.sender === res.data.user._id
              ? {
                  ...message,
                  username: res.data.user.username,
                  profileImg: res.data.user.profileImg,
                }
              : message
          )
        );
      } catch (error) {
        alert(error);
      }
    };

    const uniqueSenderIds = [
      ...new Set(messages.map((message) => message.sender)),
    ];
    const fetchAllUsers = async () => {
      for (const senderId of uniqueSenderIds) {
        if (!fetchedUsers.current.has(senderId)) {
          await fetchUser(senderId);
          fetchedUsers.current.add(senderId);
        }
      }
    };

    fetchAllUsers();
  }, [messages]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (
      arrivalMessage &&
      currentChat?.members.includes(arrivalMessage.sender)
    ) {
      const messageExists = messages.find(
        (msg) => msg._id === arrivalMessage._id
      );
      if (!messageExists) {
        setMessages((prev) => [...prev, arrivalMessage]);
      }
    }
  }, [arrivalMessage, currentChat]);

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

  return (
    <ProtectedRoute>
      <div className="h-full w-full flex flex-col pb-4 rounded-lg">
        <Card className="w-full h-1/6 pt-3 pl-3">
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
                  {currentChat?.groupName}
                </h4>
                {/* <h5 className="text-small tracking-tight text-default-400">
                  {currentChat?.username}
                </h5> */}
              </div>
            </div>
            <div className="flex gap-4">
              <Button variant="" isIconOnly>
                <FaPhoneAlt size={20} />
              </Button>
              <Button variant="" isIconOnly>
                <FaVideo size={20} onClick={()=>setIsVideoCall(prev =>!prev)} />
              </Button>

              <Dropdown>
                <DropdownTrigger>
                  <Button variant="" isIconOnly>
                    <BsThreeDotsVertical size={20} />
                  </Button>
                </DropdownTrigger>
                <DropdownMenu aria-label="Static Actions">
                  <DropdownItem key="new">Delete chat</DropdownItem>
                  <DropdownItem key="copy">Report User</DropdownItem>
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
         <GroupVideoCall members={currentChat.members} currentUser={currentUser}/>
        ) : (
          <>
            <div className="w-full h-5/6 bg-lightDark p-4 overflow-y-auto">
              {messages.map((msg, index) => (
                <div ref={scrollRef} key={index}>
                  <Message
                    messageId={msg._id}
                    username={msg.username}
                    message={msg.text}
                    avatar={msg?.profileImg}
                    isCurrentUser={msg.sender === currentUser?._id}
                    time={format(msg.createdAt)}
                    setUpdate={setUpdate}
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
  messageId,
  message,
  username,
  isCurrentUser,
  avatar,
  time,
  setUpdate,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const handleDeleteMessage = async () => {
    try {
      const res = await axiosInstance.delete(
        `http://localhost:4000/delete-message?messageId=${messageId}`
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
          {!isCurrentUser ? (
            <p className="text-neutral-200 font-bold mb-2">{username}</p>
          ) : (
            ""
          )}
          <p className="font-mono">{message}</p>
          <p className="text-[10px] font-thin text-neutral-300">{time}</p>
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
                onClick={handleDeleteMessage}
                onPress={() => {
                  /* Add delete logic here */ onClose();
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

// const DeletModal =()=>{
//   const {isOpen, onOpen, onOpenChange} = useDisclosure();

//   return (
//       <>

//       </>
//   )
// }
