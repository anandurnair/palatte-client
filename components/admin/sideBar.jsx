'use client'
import React from 'react'
import '../style.css'
import { Sidebar } from "flowbite-react";
import { HiArrowSmRight, HiChartPie, HiInbox, HiShoppingBag, HiTable, HiUser, HiViewBoards,HiBriefcase  } from "react-icons/hi";
import { Link } from '@nextui-org/react';

const AdminSidebar = () => {
  return (
    <div className='w-64 h-lvh main-bg px-4'>
        <div className='w-full h-full bg3 rounded-lg ' >
        <Sidebar aria-label="Sidebar with logo branding example">
      
      <Sidebar.Items className='pt-5'>
        <Sidebar.ItemGroup className=''>
          <Sidebar.Item href="/admin/dashboard" icon={HiChartPie}>
            Dashboard
          </Sidebar.Item>
          
          
          <Sidebar.Item href="/admin/userManagement" icon={HiUser}>
            
            User Management
          </Sidebar.Item>
          <Sidebar.Item href="#" icon={HiBriefcase }>
            Services
          </Sidebar.Item>
          
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
        </div>
    </div>
  )
}

export default AdminSidebar
