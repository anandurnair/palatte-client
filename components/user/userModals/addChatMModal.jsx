'use client'
import React, { useState } from "react";
import {
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  useDisclosure,
} from "@nextui-org/react";
import axiosInstance from "../axiosConfig";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Card, CardHeader, CardBody, Avatar } from "@nextui-org/react";

const AddChatModal = ({ setNewConversation, currentUser, setUser }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [username, setUsername] = useState('');
  const [users, setUsers] = useState([]);

  const handleSearch = async () => {
    try {
      const res = await axiosInstance.post(`${process.env.NEXT_PUBLIC_API_URL}/search-user`, { username });
      if (res.status === 200) {
        const newUsers = res.data.users.filter(user => user._id !== currentUser._id);
        setUsers(newUsers);
      }
    } catch (error) {
      console.log(error);
      toast.error("Error in searching");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleClick = (userId) => {
    const receiver = users.find(user => userId === user._id);
    setUser(receiver);
    setNewConversation(userId);
  };

  return (
    <>
      <ToastContainer toastStyle={{ backgroundColor: "#20222b", color: "#fff" }} position="bottom-right" />
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">Add Chat</ModalHeader>
            <ModalBody>
              <div className="w-full flex gap-x-2">
                <Input
                  radius="full"
                  type="text"
                  placeholder="Search user"
                  className="w-full"
                  variant="bordered"
                  onChange={(e) => setUsername(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <Button radius="full" className="btn" variant="bordered" onClick={handleSearch}>
                  Search
                </Button>
              </div>
              <div className="flex flex-col gap-y-3 h-60 overflow-y-auto">
                {users.length === 0 ? <h2>No Users found</h2> : ""}
                {users.map((user) => (
                  <div className="w-full" key={user._id} onClick={() => handleClick(user._id)}>
                    <Card className="w-full cursor-pointer">
                      <CardHeader className="justify-between">
                        <div className="flex gap-5">
                          <Avatar isBordered radius="full" size="md" src={user.profileImg} />
                          <div className="flex flex-col gap-1 items-start justify-center">
                            <h4 className="text-small font-semibold leading-none text-default-600">
                              {user.fullname}
                            </h4>
                            <h5 className="text-small tracking-tight text-default-400">
                              @{user.username}
                            </h5>
                          </div>
                        </div>
                      </CardHeader>
                      <CardBody className="px-3 py-0 text-small text-default-400"></CardBody>
                    </Card>
                  </div>
                ))}
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Close
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </>
  );
};

export default AddChatModal;
