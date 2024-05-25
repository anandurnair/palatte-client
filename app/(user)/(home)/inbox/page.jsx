'use client'
import React, { useEffect, useState } from 'react'
import ChatListComponent from '@/components/user/chatList'
import ChatUI from '@/components/user/chatUI'
import { IoIosAdd } from "react-icons/io";
import { ChatList } from "react-chat-elements";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import axiosInstance from '@/components/user/axiosConfig';
const url = process.env.NEXT_PUBLIC_API_URL;
const PostDetailPage = () => {
  const currentUser = useSelector((state) => state.user.currentUser);
  const [conversation, setConversation] = useState([]);
  const [currentChat ,setCurrrentChat] = useState(null)
  const [messages,setMessages] = useState(null)
  useEffect(() => {
    
    const fetchConversations = async () => {
      try {
        const res = await axiosInstance.get(
          `${url}/conversation/${currentUser._id}`
        );
        console.log("c", res.data.conversation);
        setConversation(res.data.conversation);
      } catch (error) {
        alert(error);
      }
    };
    fetchConversations();
  }, [currentUser]);

  useEffect(()=>{
    const getMessages = async()=>{
      try {
          const res = await axiosInstance.get(`${url}/messages/${currentChat?._id}`);
          setMessages(res.data.messages)
      } catch (error) {
          alert(error)
      }
    }
    getMessages()
  },[currentChat])
  return (
    <div className='purple-dark h-full bg-background text-foreground  flex gap-x-4  overflow-y-scroll'>
       <div className=" h-full bg-semi w-2/6 shadow-lg rounded-lg p-4 overflow-y-auto">
        <div className="w-full h-auto p-3 flex justify-between border-b-1 mb-3 border-neutral-700">
          <h1>Chat list</h1>
          <IoIosAdd size={30} className="cursor-pointer" />
        </div>
        {conversation.map((c) => (
          <div onClick={()=>setCurrrentChat(c)}>

            <ChatListComponent conversation={c} currentUser ={currentUser} />
          </div>
        ))}
      </div>
      <div className="w-full rounded-md shadow-lg flex flex-col gap-y-1 justify-center items-center overflow-y-scroll mr-4 bg-semi">

        { currentChat ?<ChatUI messages = {messages} currentUser = {currentUser}  /> : <span className='text-lg text-neutral-500'> Open a conversation to start a chat</span>}
        </div>
    </div>
  )
}

export default PostDetailPage
