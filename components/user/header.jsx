"use client";
import React from "react";
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

const Header = () => {
  const [currentPage, setCurrentPage] = React.useState("song");

  return (
    <div className="w-full h-auto main-bg py-4 pr-4">
      <Navbar className="bg3 rounded-lg p-0 justify-noraml">
          
        <NavbarContent justify="start" className=" sm:flex ">
        <Breadcrumbs size="lg"
              underline="active"
              onAction={(key) => setCurrentPage(key)}
            >
              <BreadcrumbItem key="home" isCurrent={currentPage === "home"}>
                Home
              </BreadcrumbItem>
              <BreadcrumbItem key="music" isCurrent={currentPage === "music"}>
                Profile
              </BreadcrumbItem>
              
            </Breadcrumbs>
        </NavbarContent>

        <NavbarContent as="div" justify="end" className="">
          <User
            name="Anandu R "
            description="Web Designer"
            avatarProps={{
              src: "",
            }}
          />
        </NavbarContent>
      </Navbar>
    </div>
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
