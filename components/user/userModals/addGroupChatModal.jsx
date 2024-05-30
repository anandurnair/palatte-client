import React, { useEffect, useState } from "react";
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
import { Checkbox, Link, User, Chip, cn } from "@nextui-org/react";
import { CheckboxGroup } from "@nextui-org/react";
const url =process.env.NEXT_PUBLIC_API_URL
const AddGroupChatModal = ({
  setNewGroupConversation,
  currentUser,
  isOpen,
  onClose,
}) => {
  const [groupName, setGroupName] = useState("");
  const [members, setMembers] = useState([]);
  const [username, setUsername] = useState("");
  const [users, setUsers] = useState([]);
  const [groupSelected, setGroupSelected] = useState([]);

  useEffect(() => {
    // Ensure members are unique and update when groupSelected changes
    setMembers((prevMembers) => {
      const selectedIds = new Set(groupSelected.map(user => user._id));
      return [...new Map([...prevMembers, ...groupSelected].map(user => [user._id, user])).values()];
    });
  }, [groupSelected]);

  const handleSearch = async () => {
    try {
      const res = await axiosInstance.post('/search-user', { username });
      if (res.status === 200) {
        const newUsers = res.data.users.filter(
          (user) => user._id !== currentUser._id
        );
        setUsers(newUsers);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleCreateGroup = async () => {
    try {
      const res = await axiosInstance.post("/conversation/group", {
        groupName,
        members: members.map((member) => member._id),
        admin: currentUser._id,
      });
      if (res.status === 200) {
        setNewGroupConversation(res.data);
        onClose();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleRemoveMember = (id) => {
    setMembers(members.filter((member) => member._id !== id));
    setGroupSelected(groupSelected.filter((user) => user._id !== id));
  };

  const handleSelect = (selectedValues) => {
    const selectedUsers = users.filter((user) =>
      selectedValues.includes(user._id)
    );
    setGroupSelected(selectedUsers);
  };

  return (
    <>
      <ToastContainer
        toastStyle={{ backgroundColor: "#20222b", color: "#fff" }}
        position="bottom-right"
      />
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Create Group Chat
            </ModalHeader>
            <ModalBody>
              <div className="w-full flex flex-col gap-y-4">
                <Input
                  radius="full"
                  type="text"
                  placeholder="Group Name"
                  className="w-full"
                  variant="bordered"
                  onChange={(e) => setGroupName(e.target.value)}
                />
                <div className="flex gap-x-2">
                <Input
                  radius="full"
                  type="text"
                  placeholder="Search user"
                  className="w-full"
                  variant="bordered"
                  onChange={(e) => setUsername(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
                <Button
                  radius="full"
                  className="btn"
                  variant="bordered"
                  onClick={handleSearch}
                >
                  Search
                </Button>
                </div>
               
              </div>
              <div className="flex flex-col gap-y-3 h-auto max-h-52 overflow-y-auto">
                <div className="flex flex-col gap-1 w-full">
                  <CheckboxGroup
                  color="primary"
                    value={groupSelected.map(user => user._id)}
                    onChange={handleSelect}
                    classNames={{
                      base: "w-full",
                    }}
                  >
                    {users.length === 0 ? <h2>No users selected</h2> : ""}
                    {users.map((user) => (
                      <CustomCheckbox
                        key={user._id}
                        value={user._id}
                        user={{
                          name: user.fullname,
                          avatar: user.profileImg,
                          username: user.username,
                          userId:user._id
                          
                        }}
                        statusColor=""
                      />
                    ))}
                  </CheckboxGroup>
                </div>
              </div>
                {members.length === 0 ? "" : "Members"}
              <div className="flex flex-col gap-y-3  h-auto max-h-52  overflow-y-auto">
                {members.map((user) => (
                  <div
                    className="w-full"
                    key={user._id}
                  >
                    <Card className="w-full cursor-pointer">
                      <CardHeader className="justify-between">
                        <div className="flex gap-5">
                          <Avatar
                            isBordered
                            radius="full"
                            size="md"
                            src={user.profileImg}
                          />
                          <div className="flex flex-col gap-1 items-start justify-center">
                            <h4 className="text-small font-semibold leading-none text-default-600">
                              {user.fullname}
                            </h4>
                            <h5 className="text-small tracking-tight text-default-400">
                              @{user.username}
                            </h5>
                          </div>
                        </div>
                        <Button variant="bordered" onPress={() => handleRemoveMember(user._id)}>Remove</Button>
                      </CardHeader>
                      <CardBody className="px-3 py-0 text-small text-default-400">
                        
                      </CardBody>
                    </Card>
                  </div>
                ))}
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Close
              </Button>
              <Button className="btn" variant="bordered" onPress={handleCreateGroup}>
                Create Group
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </>
  );
};

const CustomCheckbox = ({ user, statusColor, value }) => {
  return (
    <Checkbox
      aria-label={user.name}
      classNames={{
        base: cn(
          "inline-flex max-w-md w-full bg-content1 m-0",
          "hover:bg-content2 items-center justify-start",
          "cursor-pointer rounded-lg gap-2 p-4 border-2 border-transparent",
          "data-[selected=true]:border-primary"
        ),
        label: "w-full",
      }}
      value={value}
    >
      <div className="w-full flex justify-between gap-2">
        <User
          avatarProps={{ size: "md", src: user.avatar }}
          description={
            <Link isExternal href={`http://localhost:3000/userProfile?userId=${user.userId}`}>
              @{user.username}
            </Link>
          }
          name={user.name}
        />
        
      </div>
    </Checkbox>
  );
};

export default AddGroupChatModal;
