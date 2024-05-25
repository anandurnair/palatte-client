"use client";
import React, { useState, useEffect } from "react";
import ProtectedRoute from "../../components/user/ProtectedRoute";
import { Card, CardHeader, CardBody, Avatar, Input } from "@nextui-org/react";
import { IoMdMore } from "react-icons/io";
import {
  MinChatUiProvider,
  MainContainer,
  MessageInput,
  MessageContainer,
  MessageList,
  MessageHeader,
} from "@minchat/react-chat-ui";
import "react-chat-elements/dist/main.css";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@nextui-org/react";
import io from "socket.io-client";
import Message from "@/components/user/message";
const socket = io("http://localhost:4000"); // Adjust the URL as needed

const myColorSet = {
  // input
  "--input-background-color": "#171717",
  "--input-text-color": "#ffffff",
  "--input-element-color": "#3a3a3a",
  "--input-attach-color": "#b0b0b0",
  "--input-send-color": "#b0b0b0",
  "--input-placeholder-color": "#757575",

  // message header
  "--message-header-background-color": "#1f1f1f",
  "--message-header-text-color": "#ffffff",
  "--message-header-last-active-color": "#757575",
  "--message-header-back-color": "#3a3a3a",

  // chat list header
  "--chatlist-header-background-color": "#1f1f1f",
  "--chatlist-header-text-color": "#ffffff",
  "--chatlist-header-divider-color": "#3a3a3a",

  // chat list
  "--chatlist-background-color": "transparent",
  "--no-conversation-text-color": "#b0b0b0",

  // chat item
  "--chatitem-background-color": "#3a3a3a",
  "--chatitem-selected-background-color": "#4a4a4a",
  "--chatitem-title-text-color": "#ffffff",
  "--chatitem-content-text-color": "#d0d0d0",
  "--chatitem-hover-color": "#525252",

  // main container
  "--container-background-color": "#171717",

  // loader
  "--loader-color": "#757575",

  // message list
  "--messagelist-background-color": "#222222",
  "--no-message-text-color": "#b0b0b0",

  // incoming message
  "--incoming-message-text-color": "#ffffff",
  "--incoming-message-name-text-color": "#b0b0b0",
  "--incoming-message-background-color": "#3A3A3A",
  "--incoming-message-timestamp-color": "#757575",
  "--incoming-message-link-color": "#4a90e2",

  // outgoing message
  "--outgoing-message-text-color": "#ffffff",
  "--outgoing-message-background-color": "#3A3A3A",
  "--outgoing-message-timestamp-color": "#757575",
  "--outgoing-message-checkmark-color": "#4a90e2",
  "--outgoing-message-loader-color": "#4a90e2",
  "--outgoing-message-link-color": "#4a90e2",
};

const ChatUI = ({ messages, currentUser }) => {
  return (
    <ProtectedRoute>
      <div className="h-full w-full flex flex-col pb-4 rounded-lg">
        <MinChatUiProvider theme="#ABB8C3" colorSet={myColorSet}>
          <MainContainer style={{ height: "100vh", width: "100%" }}>
            <MessageContainer>
              <MessageHeader>
                <div className="w-full">
                  <Card className="w-full bg-semi shadow-none">
                    <CardHeader className="justify-between pt-5">
                      <div className="flex gap-5 cursor-pointer">
                        <Avatar
                          isBordered
                          radius="full"
                          size="md"
                          src="https://nextui.org/avatars/avatar-1.png"
                        />
                        <div className="flex flex-col gap-1 items-start justify-center">
                          <h4 className="text-small font-semibold leading-none text-default-600">
                            Zoey Lang
                          </h4>
                          <h5 className="text-small tracking-tight text-default-400">
                            @zoeylang
                          </h5>
                        </div>
                      </div>
                      <Dropdown>
                        <DropdownTrigger>
                          <Button variant="">
                            <IoMdMore
                              size={25}
                              className="cursor-pointer text-gray-400"
                            />
                          </Button>
                        </DropdownTrigger>
                        <DropdownMenu aria-label="Static Actions">
                          <DropdownItem key="delete">Delete chat</DropdownItem>
                          <DropdownItem key="block">Block</DropdownItem>
                          <DropdownItem key="close" color="danger">
                            Close
                          </DropdownItem>
                        </DropdownMenu>
                      </Dropdown>
                    </CardHeader>
                    <CardBody className="px-3 py-0 text-small text-default-400"></CardBody>
                  </Card>
                </div>
              </MessageHeader>
              <MessageList
            currentUserId='dan'
            messages={[{
              text: 'Hello',
              user: {
                id: 'mark',
                name: 'Markus',
              },
              

            }]}
              />
                <MessageList
              
            currentUserId='sdf'
            messages={[{
              text: 'Hello',
              user: {
                id: 'mark',
                name: 'Markus',
              },
            }]}
              />
              <div className="flex items-center gap-2 p-3">
                <Input
                  size="lg"
                  placeholder="Type message here"
                  value=""
                  // onChange={(e) => setMessage(e.target.value)}
                  // onKeyDown={(e) => {
                  //   if (e.key === "Enter") {
                  //     sendMessage();
                  //   }
                  // }}
                />
                <Button>Send</Button>
              </div>
            </MessageContainer>
          </MainContainer>
        </MinChatUiProvider>
      </div>
    </ProtectedRoute>
  );
};

export default ChatUI;
