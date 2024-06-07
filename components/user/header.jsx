"use client";
import React, { useEffect, useState } from "react";
import { usePathname } from 'next/navigation'

import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  DropdownItem,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  User,
  Avatar,
  Button,
  DropdownSection,
} from "@nextui-org/react";
import { Breadcrumbs, BreadcrumbItem } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "../../components/user/ProtectedRoute";
import { useDispatch, useSelector } from "react-redux";
import { logout ,signupUser} from "@/redux/reducers/user";
const Header = () => {
  const dispatch = useDispatch()
  const [user,setUser] = useState()
  const [profileImg,setProfileImg] = useState()
  const pathname = usePathname()
  
  const currentUser = useSelector(state => state.user.currentUser);
  useEffect(()=>{
    setUser(currentUser)
    setProfileImg(currentUser?.profileImg)
    
  },[currentUser])
 
  let words = pathname.split("/").filter(word => word !== "").map(word => word.charAt(0).toUpperCase() + word.slice(1));

  let result = words.join(" / ") +" /";
  
  result = result.replace(/([a-z])([A-Z])/g, '$1 $2');
  
  const router = useRouter()
 
  const [currentPage, setCurrentPage] = React.useState(pathname);
  const gotoProfile = () => {
    router.push("/profile");
  };
  const handleLogout = ()=>{
    localStorage.removeItem('token')
    dispatch(logout())
    dispatch(signupUser(null))
    router.push('/')
  }
  return (
    <ProtectedRoute>

    <div className="w-full  h-auto  py-4 pr-4">
      <Navbar className="bg-semi rounded-lg p-0 justify-noraml">
        <NavbarContent justify="start" className=" sm:flex ">
          <Breadcrumbs
            size="lg"
            underline="active"
            onAction={(key) => setCurrentPage(key)}
            >
            <BreadcrumbItem key="home" isCurrent={currentPage === "/home"}>
              {result}
            </BreadcrumbItem>
            
          </Breadcrumbs>
        </NavbarContent>

        <NavbarContent
          as="div"
          justify="end"
          className=""
          onClick={gotoProfile}
          >
          <Dropdown placement="bottom-start">
            <DropdownTrigger>
              <User
                as="button"
                avatarProps={{
                  isBordered: true,
                  src:`${profileImg}`
                }}
                className="transition-transform"
                description={`@${user?.username}`}
                name={user?.fullname}
                />
            </DropdownTrigger>
            <DropdownMenu aria-label="User Actions" variant="flat">
              <DropdownItem key="profile" className="h-14 gap-2">
                <p className="font-bold">Signed in as</p>
                <p className="font-bold">{user?.username}</p>
              </DropdownItem>
              <DropdownItem key="settings" onClick={()=>router.push('/profile')}>My Profile</DropdownItem>
              <DropdownItem key="serviceList" onClick={()=>router.push('/serviceList')}>Freelance</DropdownItem>
              <DropdownItem key="wallet" onClick={()=>router.push('/wallet')}>Wallet</DropdownItem>


              {/* <DropdownItem key="team_settings">Team Settings</DropdownItem>
              <DropdownItem key="analytics">Analytics</DropdownItem>
              <DropdownItem key="system">System</DropdownItem>
              <DropdownItem key="configurations">Configurations</DropdownItem>
              <DropdownItem key="help_and_feedback">
              Help & Feedback
              </DropdownItem> */}
              <DropdownItem key="logout" color="danger" onClick={handleLogout}>
                Log Out
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </NavbarContent>
      </Navbar>
    </div>
  </ProtectedRoute>
  );
};

export default Header;
const PlusIcon = (props) => (
  <svg
    aria-hidden="true"
    fill="none"
    focusable="false"
    height="1em"
    role="presentation"
    viewBox="0 0 24 24"
    width="1em"
    {...props}
  >
    <g
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
    >
      <path d="M6 12h12" />
      <path d="M12 18V6" />
    </g>
  </svg>
);
