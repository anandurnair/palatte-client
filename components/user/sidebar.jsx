"use client";
import React from "react";
import "../style.css";

import { FaHome } from "react-icons/fa";
import { MdGroups,MdExplore  } from "react-icons/md";
import { IoMdChatbubbles } from "react-icons/io";
import ProtectedRoute from "../../components/user/ProtectedRoute";

import { HiArrowSmRight, HiChartPie, HiInbox, HiShoppingBag, HiTable, HiUser, HiViewBoards } from "react-icons/hi";
import { Sidebar } from "flowbite-react";
import { BiBuoy } from "react-icons/bi";
import { PiPaintBrushFill } from "react-icons/pi";
import { useRouter } from "next/navigation";
import { Image } from "@nextui-org/react";

const HomeSidebar = () => {
  const router= useRouter()
  return (
    <ProtectedRoute>

    <div className="w-auto h-lvh   p-4 ">
      <div className="w-full h-full bg3 rounded-lg overflow-hidden">
       
      <Sidebar aria-label="Sidebar with content separator example" theme={ownTheme} className="overflow-hidden" >
      <Sidebar.Logo onClick={()=>router.push('/home')}  className="pl-10 ">
        <h2 className="text-2xl cursor-pointer  "><span className="bg2">P</span>ALATTE</h2>
      </Sidebar.Logo>
        <Sidebar.ItemGroup className="flex flex-col gap-y-3 pt-10 cursor-pointer">
          <Sidebar.Item   onClick={()=>router.push('/home')} icon={FaHome} className='bg-5 rounded-lg p-4 shadow-lg text-gray-200 bg-semiDark'>
            Home
          </Sidebar.Item>
          
          <Sidebar.Item  onClick={()=>router.push('/explore')} icon={MdExplore} className=' bg-5 rounded-lg p-4 shadow-lg text-gray-200 bg-semiDark'>
            Explore
          </Sidebar.Item>
          <Sidebar.Item  onClick={()=>router.push('/inbox')}    icon={IoMdChatbubbles} className='bg-5 rounded-lg p-4 shadow-lg text-gray-200 bg-semiDark'>
            Inbox
          </Sidebar.Item>
          <Sidebar.Item  icon={MdGroups} onClick={()=>router.push('/community')} className='bg-5 rounded-lg p-4 shadow-lg text-gray-200 bg-semiDark'>
            Community
          </Sidebar.Item>
          <Sidebar.Item  onClick={()=>router.push('/profile/#myPosts')}  icon={PiPaintBrushFill} className='bg-5 rounded-lg p-4 shadow-lg text-gray-200 bg-semiDark'>
           My Works
          </Sidebar.Item>
          
        </Sidebar.ItemGroup>
        {/* <Sidebar.CTA className="bg-transparent overflow-hidden ">
        <Image
      width={300}
      alt="NextUI hero Image"
      src="https://cdn3d.iconscout.com/3d/premium/thumb/sharing-ideas-10787235-8662360.png"
    />       
     </Sidebar.CTA> */}
       
    </Sidebar>
      </div>
    </div>
    </ProtectedRoute>
  );
};

export default HomeSidebar;



const ownTheme  ={
  "root": {
      "base": "h-full",
      "collapsed": {
          "on": "w-16",
          "off": "w-64"
      },
      "inner": "h-full overflow-y-auto overflow-x-hidden rounded bg-gray-50 py-4 px-7 dark:bg-neutral-900"
  },
  "collapse": {
      "button": "group flex w-full items-center rounded-lg p-2 text-base font-normal text-gray-900 transition duration-75 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700",
      "icon": {
          "base": "h-6 w-6 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white",
          "open": {
              "off": "",
              "on": "text-gray-900"
          }
      },
      "label": {
          "base": "ml-3 flex-1 whitespace-nowrap text-left",
          "icon": {
              "base": "h-6 w-6 transition ease-in-out delay-0",
              "open": {
                  "on": "rotate-180",
                  "off": ""
              }
          }
      },
      "list": "space-y-2 py-2"
  },
  "cta": {
      "base": "mt-6 rounded-lg p-4 bg-gray-100 dark:bg3",
      "color": {
          "blue": "bg-cyan-50 dark:bg-cyan-900",
          "dark": "bg-dark-50 dark:bg-dark-900",
          "failure": "bg-red-50 dark:bg-red-900",
          "gray": "bg-alternative-50 dark:bg-alternative-900",
          "green": "bg-green-50 dark:bg-green-900",
          "light": "bg-light-50 dark:bg-light-900",
          "red": "bg-red-50 dark:bg-red-900",
          "purple": "bg-purple-50 dark:bg-purple-900",
          "success": "bg-green-50 dark:bg-green-900",
          "yellow": "bg-yellow-50 dark:bg-yellow-900",
          "warning": "bg-yellow-50 dark:bg-yellow-900"
      }
  },
  "item": {
      "base": "flex items-center justify-center rounded-lg p-2 text-base font-normal text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700",
      "active": "bg-gray-100 dark:bg-gray-700",
      "collapsed": {
          "insideCollapse": "group w-full pl-8 transition duration-75",
          "noIcon": "font-bold"
      },
      "content": {
          "base": "px-3 flex-1 whitespace-nowrap"
      },
      "icon": {
          "base": "h-6 w-6 flex-shrink-0 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white",
          "active": "text-gray-700 dark:text-gray-100"
      },
      "label": "",
      "listItem": ""
  },
  "items": {
      "base": ""
  },
  "itemGroup": {
      "base": "mt-4 space-y-2 border-t border-gray-200 pt-4 first:mt-0 first:border-t-0 first:pt-0 dark:border-gray-700"
  },
  "logo": {
      "base": "mb-5 flex items-center pl-2.5",
      "collapsed": {
          "on": "hidden",
          "off": "self-center whitespace-nowrap text-xl font-semibold dark:text-white"
      },
      "img": "mr-3 h-6 sm:h-7"
  }
};