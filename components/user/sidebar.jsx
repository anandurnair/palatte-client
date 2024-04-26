'use client'
import React from 'react'
import '../style.css'
import { Sidebar } from "flowbite-react";
import { HiArrowSmRight, HiChartPie, HiInbox, HiShoppingBag, HiTable, HiUser, HiViewBoards } from "react-icons/hi";


const HomeSidebar = () => {
  return (
    <div className='w-64 h-lvh main-bg p-4'>
        <div className='w-full h-full bg3 rounded-lg ' >
        <Sidebar aria-label="Sidebar with logo branding example">
      <Sidebar.Logo href="#"  className='flex ml-14'>
        <h1 className=' bg2'><span className=''>P</span>ALATTE</h1>
      </Sidebar.Logo>
      <Sidebar.Items>
        <Sidebar.ItemGroup className=''>
          <Sidebar.Item href="#" icon={HiChartPie}>
            Dashboard
          </Sidebar.Item>
          <Sidebar.Item href="#" icon={HiViewBoards}>
            Kanban
          </Sidebar.Item>
          <Sidebar.Item href="#" icon={HiInbox}>
            Inbox
          </Sidebar.Item>
          <Sidebar.Item href="#" icon={HiUser}>
            Users
          </Sidebar.Item>
          <Sidebar.Item href="#" icon={HiShoppingBag}>
            Products
          </Sidebar.Item>
          <Sidebar.Item href="#" icon={HiArrowSmRight}>
            Sign In
          </Sidebar.Item>
          <Sidebar.Item href="#" icon={HiTable}>
            Sign Up
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
        </div>
    </div>
  )
}

export default HomeSidebar
