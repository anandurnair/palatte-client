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
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/admin/ProtectedRoute";

const Header = () => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = React.useState("song");
  const handleLogout = () => {
    localStorage.removeItem("admin");
    router.push("/admin");
  };
  return (
    <ProtectedRoute>
      <div className="w-full h-auto main-bg py-4 px-4">
        <Navbar className="flex bg3 rounded-lg max-w-full">
          <NavbarBrand className="max-w-full">
            <p className="font-bold text-inherit">Admin Panel</p>
          </NavbarBrand>
          {/* <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem>
          <Link color="foreground" href="#">
            Features
          </Link>
        </NavbarItem>
        <NavbarItem isActive>
          <Link href="#" aria-current="page">
            Customers
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" href="#">
            Integrations
          </Link>
        </NavbarItem>
      </NavbarContent> */}
          <NavbarContent justify="end">
            <NavbarItem>
              <Button onClick={handleLogout} variant="bordered">
                Logout
              </Button>
            </NavbarItem>
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
