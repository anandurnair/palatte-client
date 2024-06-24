"use client";
import React, { useEffect, useRef, useState } from "react";
import ChatListComponent from "@/components/user/chatList";
import ChatUI from "@/components/user/chatUI";
import { IoIosAdd } from "react-icons/io";
import { useSelector } from "react-redux";
import axiosInstance from "@/components/user/axiosConfig";
import { io } from "socket.io-client";
import { Modal, useDisclosure } from "@nextui-org/react";
import AddChatModal from "../../../../components/user/userModals/addChatMModal";
import {Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button} from "@nextui-org/react";
import { IoMdMore } from "react-icons/io";
import { useRouter } from "next/navigation";

const InboxPage = () => {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const router = useRouter()
  const currentUser = useSelector((state) => state.user.currentUser);
  const socket = useRef(null);
  const [newConversation, setNewConversation] = useState(null);
  const [conversation, setConversation] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [user, setUser] = useState(null);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState();
  const [update, setUpdate] = useState(false);
  useEffect(() => {
    if (!socket.current) {
      socket.current = io(process.env.NEXT_PUBLIC_SOCKET_URI);
      socket.current.emit("addUser", currentUser?._id);
      socket.current.on("getMessage", (data) => {
        setArrivalMessage({
          sender: data.senderId,
          text: data.text,
          createdAt: Date.now(),
        });
      });
      socket.current.on("getUsers", (users) => {
        const usersId = users.map((u) => u.userId);
        console.log("Online users :", usersId);
        setOnlineUsers(usersId);
      });
    }

    return () => {
      if (socket.current) {
        socket.current.disconnect();
        socket.current = null;
      }
    };
  }, [currentUser, update]);

  useEffect(() => {
    if (
      arrivalMessage &&
      currentChat?.members.includes(arrivalMessage.sender)
    ) {
      setMessages((prev) => [...prev, arrivalMessage]);
    }
  }, [arrivalMessage, currentChat]);

  useEffect(() => {
    if (newConversation) {
      startConversation();
    }
  }, [newConversation, update]);

  const startConversation = async () => {
    try {
      const res = await axiosInstance.post(
        `${process.env.NEXT_PUBLIC_API_URL}/conversation`,
        { senderId: currentUser._id, receiverId: newConversation }
      );
      const savedConversation = res.data.conversation;
      setConversation((prev) => [...prev, savedConversation]);
      setCurrentChat(savedConversation);
      onClose();
    } catch (error) {
      console.error(error);
      onClose();
    }
  };

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await axiosInstance.get(
          `${process.env.NEXT_PUBLIC_API_URL}/conversation/${currentUser?._id}`
        );
        setConversation(res.data.conversations);
        console.log("conversations : ", res.data.conversations);
      } catch (error) {
        console.error(error);
      }
    };
    fetchConversations();
  }, [currentUser, update]);

  useEffect(() => {
    const getMessages = async () => {
      try {
        const res = await axiosInstance.get(
          `${process.env.NEXT_PUBLIC_API_URL}/messages/${currentChat?._id}`
        );
        setMessages(res.data.messages);
      } catch (error) {
        console.error(error);
      }
    };
    if (currentChat) {
      getMessages();
    }
  }, [currentChat, update]);

  return (
    <>
      <div className="purple-dark h-full bg-background text-foreground flex gap-x-4 overflow-y-scroll">
        <div className="h-full bg-semi w-2/6 shadow-lg rounded-lg p-4 overflow-y-auto">
          <div className="w-full h-auto p-3 flex justify-between border-b-1 mb-3 border-neutral-700">
            <h1>Chat list</h1>
            <div className="flex">
            <Button onPress={onOpen} isIconOnly variant="default">
              <IoIosAdd size={30} className="cursor-pointer" />
            </Button>
            <Dropdown>
      <DropdownTrigger>
        <Button 
          isIconOnly variant="default"
        >
         <IoMdMore size={30} className="cursor-pointer" />

        </Button>
      </DropdownTrigger>
      <DropdownMenu aria-label="Static Actions">
        <DropdownItem key="new" onClick={()=>router.push('/inbox/callHistory')}>Call history</DropdownItem>
        
      </DropdownMenu>
    </Dropdown>
            </div>
          
          </div>
          {conversation.map((c) => (
            <ChatListComponent
              key={c._id}
              conversation={c}
              currentUser={currentUser}
              user={user}
              setUser={setUser}
              setCurrentChat={setCurrentChat}
              onlineUsers={onlineUsers}
            />
          ))}
        </div>
        <div className="w-full rounded-md shadow-lg flex flex-col gap-y-1 justify-center items-center overflow-y-scroll mr-4 bg-semi">
          {currentChat ? (
            <ChatUI
              setUpdate={setUpdate}
              arrivalMessage={arrivalMessage}
              setArrivalMessage={setArrivalMessage}
              messages={messages}
              socket={socket}
              setMessages={setMessages}
              currentUser={currentUser}
              user={user}
              currentChat={currentChat}
            />
          ) : (
            <span className="text-lg text-neutral-500">
              Open a conversation to start a chat
            </span>
          )}
        </div>
      </div>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <AddChatModal
          setNewConversation={setNewConversation}
          setUser={setUser}
          currentUser={currentUser}
        />
      </Modal>
    </>
  );
};

export default InboxPage;
