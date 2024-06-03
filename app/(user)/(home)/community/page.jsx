'use client';
import React, { useEffect, useRef, useState } from 'react';
import GroupChatListComponent from '@/components/user/groupChatListComponent ';
import GroupChatUI from '@/components/user/groupChatUI';
import { IoIosAdd } from 'react-icons/io';
import { useSelector } from 'react-redux';
import axiosInstance from '@/components/user/axiosConfig';
import { io } from 'socket.io-client';
import { Modal, Button, useDisclosure } from "@nextui-org/react";
import AddGroupChatModal from '../../../../components/user/userModals/addGroupChatModal';
import { Card, CardHeader, CardBody, Avatar, Badge } from "@nextui-org/react";

const GroupInboxPage = () => {
  const { isOpen, onOpen, onClose,onOpenChange } = useDisclosure();
  const currentUser = useSelector((state) => state.user.currentUser);
  const socket = useRef(null);
  const [newGroupConversation, setNewGroupConversation] = useState(null);
  const [groupConversations, setGroupConversations] = useState([]);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [currentChat, setCurrentChat] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [messages,setMessages] =useState([])
  const [update,setUpdate] = useState(false)
// Fetch group conversations
useEffect(() => {
  const fetchGroupConversations = async () => {
    try {
      const res = await axiosInstance.get(`/conversation/group/${currentUser._id}`);
      setGroupConversations(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  fetchGroupConversations();
}, [currentUser, newGroupConversation]);

useEffect(() => {
  const getMessages = async () => {
    try {
      const res = await axiosInstance.get(`${process.env.NEXT_PUBLIC_API_URL}/messages/${currentChat?._id}`);
      setMessages(res.data.messages);
    } catch (error) {
      console.error(error);
    }
  };
  if (currentChat) {
    getMessages();
  }
}, [currentChat,update]);

  // Set up socket connection
  useEffect(() => {
    socket.current = io(process.env.NEXT_PUBLIC_API_URL);

    socket.current.emit('addUser', currentUser?._id);
    socket.current.on('getMessage', (data) => {
      if (data.isGroup && data.groupId === currentChat?._id) {
        setArrivalMessage({
          senderId: data.senderId,
          text: data.text,
          createdAt: Date.now(),
          groupId: data.groupId,
        });
      }
    });

    socket.current.on('getUsers', (users) => {
      setOnlineUsers(users);
    });

    return () => {
      socket.current.disconnect();
    };
  }, [currentUser, currentChat]);

  useEffect(() => {
    if (arrivalMessage) {
      setGroupConversations((prev) => {
        const updatedGroupConversations = prev.map((group) => {
          if (group._id === arrivalMessage.groupId) {
            return { ...group, messages: [...group.messages, arrivalMessage] };
          }
          return group;
        });
        return updatedGroupConversations;
      });
    }
  }, [arrivalMessage]);
  useEffect(() => {
    const getMessages = async () => {
      try {
        const res = await axiosInstance.get(`${process.env.NEXT_PUBLIC_API_URL}/messages/${currentChat?._id}`);
        setMessages(res.data.messages);
      } catch (error) {
        console.error(error);
      }
    };
    if (currentChat) {
      getMessages();
    }
  }, [currentChat]);
  const handleSendMessage = async (text) => {
    const message = {
      senderId: currentUser?._id,
      text,
      groupId: currentChat?._id,
    };

    socket.current.emit('sendMessage', {
      ...message,
      receiverId: null,
    });

    try {
      await axiosInstance.post('/message/group', message);
    } catch (err) {
      console.log(err);
    }
  };

  
  return (
    <>
      <div className='purple-dark h-full bg-background text-foreground flex gap-x-4 overflow-y-scroll'>
        <div className='h-full bg-semi w-2/6 shadow-lg rounded-lg p-4 overflow-y-auto'>
          <div className='w-full h-auto p-3 flex justify-between border-b-1 mb-3 border-neutral-700'>
            <h1>Groups</h1>
            <Button onPress={onOpen} isIconOnly variant='default'>
              <IoIosAdd size={30} className='cursor-pointer' />
            </Button>
          </div>
          {groupConversations.map((group) => (
        <div key={group._id} onClick={() => setCurrentChat(group)}>
          <Card className="w-full mb-3 cursor-pointer">
            <CardHeader className="justify-between">
              <div className="flex gap-5">
               
                  <Avatar
                    isBordered
                    radius="full"
                    size="md"
                    src="https://www.shutterstock.com/image-vector/icon-people-gray-color-on-260nw-1032346549.jpg" // Update the src if you have a source URL
                  />
                

                <div className="flex flex-col gap-1 items-start justify-center">
                  <h4 className="text-small font-semibold leading-none text-default-600">
                    {group.groupName}
                  </h4>
                </div>
              </div>

              <p className="text-xs font-thin">click to chat</p>
            </CardHeader>
            <CardBody className="px-3 py-0 text-small text-default-400"></CardBody>
          </Card>
        </div>
      ))}
        </div>
        <div className='w-full rounded-md shadow-lg flex flex-col gap-y-1 justify-center items-center overflow-y-scroll mr-4 bg-semi'>
          {currentChat ? (
            <GroupChatUI
            
            arrivalMessage={arrivalMessage}
              setArrivalMessage={setArrivalMessage}
              messages={messages}
              socket={socket}
              setMessages={setMessages}
              currentUser={currentUser}
              currentChat={currentChat}
              setUpdate={setUpdate}
            />
          ) : (
            <span className='text-lg text-neutral-500'>
              Open a conversation to start a chat
            </span>
          )}
        </div>
      </div>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <AddGroupChatModal isOpen={isOpen} onClose={onClose} setNewGroupConversation={setNewGroupConversation} currentUser={currentUser}  />
      </Modal>
    </>
  );
};

export default GroupInboxPage;
