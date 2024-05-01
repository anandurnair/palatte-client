"use client";
import React from "react";
import "../style.css";
import { FaHome } from "react-icons/fa";
import { MdGroups,MdExplore  } from "react-icons/md";
import { IoMdChatbubbles } from "react-icons/io";

import { HiArrowSmRight, HiChartPie, HiInbox, HiShoppingBag, HiTable, HiUser, HiViewBoards } from "react-icons/hi";
import { Sidebar } from "flowbite-react";
import { BiBuoy } from "react-icons/bi";
import { PiPaintBrushFill } from "react-icons/pi";
import { useRouter } from "next/navigation";

const HomeSidebar = () => {
  const router= useRouter()
  return (
    <div className="w-auto h-lvh main-bg p-4">
      <div className="w-full h-full bg3 rounded-lg px-2 ">
       
      <Sidebar aria-label="Sidebar with content separator example" className="">
      <Sidebar.Logo href="#"  className="pl-16 text- ">
        <h2 className="text-2xl"><span className="bg2">P</span>ALATTE</h2>
      </Sidebar.Logo>
      <Sidebar.Items className="pt-5">
        <Sidebar.ItemGroup className="flex flex-col gap-y-4">
          <Sidebar.Item  href='/home' icon={FaHome} className=' border-b-1 border-gray-600 rounded-none'>
            Home
          </Sidebar.Item>
          
          <Sidebar.Item href="#" icon={MdExplore} className=' border-b-1 border-gray-600 rounded-none'>
            Explore
          </Sidebar.Item>
          <Sidebar.Item href="#" icon={IoMdChatbubbles} className=' border-b-1 border-gray-600 rounded-none'>
            Inbox
          </Sidebar.Item>
          <Sidebar.Item href="#" icon={MdGroups} className=' border-b-1 border-gray-600 rounded-none'>
            Community
          </Sidebar.Item>
          <Sidebar.Item href="#" icon={PiPaintBrushFill} className=' border-b-1 border-gray-600 rounded-none'>
           My Works
          </Sidebar.Item>
         
        </Sidebar.ItemGroup>
       
      </Sidebar.Items>
    </Sidebar>
      </div>
    </div>
  );
};

export default HomeSidebar;
