'use client';
import React, { useState, useEffect } from "react";
import { Sidebar } from "flowbite-react";
import { FaHome } from "react-icons/fa";
import { MdGroups, MdExplore, MdWorkHistory } from "react-icons/md";
import { IoMdChatbubbles } from "react-icons/io";
import { PiPaintBrushFill } from "react-icons/pi";
import { usePathname, useRouter } from "next/navigation";
import ProtectedRoute from "../../components/user/ProtectedRoute";

const HomeSidebar = () => {
  const pathname = usePathname();
  const router = useRouter();

  let words = pathname
    .split("/")
    .filter((word) => word !== "")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1));

  let result = words.join(" / ") + "/";

  result = result.replace(/([a-z])([A-Z])/g, "$1 $2");

  // State to manage sidebar visibility
  const [sidebarOpen, setSidebarOpen] = useState(false); // Initially closed on smaller devices

  // Effect to determine window size and set sidebar state
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 640) {
        setSidebarOpen(true); // Open sidebar on medium devices and above
      } else {
        setSidebarOpen(false); // Close sidebar on small devices
      }
    };

    handleResize(); // Initial check
    window.addEventListener("resize", handleResize); // Listen for window resize

    return () => {
      window.removeEventListener("resize", handleResize); // Clean up resize listener
    };
  }, []);

  // Handle sidebar toggle on swipe right for small devices
  const handleTouchStart = (e) => {
    const touchStartX = e.touches[0].clientX;
    const touchStartY = e.touches[0].clientY;

    const handleTouchMove = (e) => {
      const currentX = e.touches[0].clientX;
      const currentY = e.touches[0].clientY;

      if (currentX - touchStartX > 50 && Math.abs(currentY - touchStartY) < 20) {
        setSidebarOpen(true); // Open sidebar if sliding from the left
      }
    };

    const handleTouchEnd = () => {
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };

    window.addEventListener("touchmove", handleTouchMove);
    window.addEventListener("touchend", handleTouchEnd);
  };

  // Close sidebar on item click for small devices
  const handleItemClick = () => {
    if (window.innerWidth < 640) {
      setSidebarOpen(false);
    }
  };

  return (
    <ProtectedRoute>
      {/* Sidebar */}
      <div
        className={`w-auto h-full p-4 ${sidebarOpen ? "block" : "hidden"} md:block`}
        onTouchStart={handleTouchStart}
      >
        <div className="w-full h-full bg3 rounded-lg overflow-hidden relative ">
          <Sidebar aria-label="Sidebar with content separator example" theme={ownTheme} className="overflow-hidden">
            {/* Sidebar content */}
            <Sidebar.Logo onClick={() => router.push("/home")} className="pl-10">
              <h2 className="text-2xl cursor-pointer">
                <span className="bg2">P</span>ALATTE
              </h2>
            </Sidebar.Logo>
            <Sidebar.ItemGroup className="flex flex-col gap-y-3 pt-10 cursor-pointer">
              <Sidebar.Item
                onClick={() => {
                  handleItemClick();
                  router.push("/home");
                }}
                icon={FaHome}
                className={`bg-5 rounded-lg p-4 shadow-lg text-gray-200 ${
                  result === "Home/"
                    ? "bg-neutral-800 transform scale-110 transition-transform duration-300"
                    : "bg-semiDark"
                }`}
              >
                Home
              </Sidebar.Item>
              <Sidebar.Item
                onClick={() => {
                  handleItemClick();
                  router.push("/explore");
                }}
                icon={MdExplore}
                className={`bg-5 rounded-lg p-4 shadow-lg text-gray-200 ${
                  result === "Explore/"
                    ? "bg-neutral-800 transform scale-110 transition-transform duration-300"
                    : "bg-semiDark"
                }`}
              >
                Explore
              </Sidebar.Item>
              <Sidebar.Item
                onClick={() => {
                  handleItemClick();
                  router.push("/inbox");
                }}
                icon={IoMdChatbubbles}
                className={`bg-5 rounded-lg p-4 shadow-lg text-gray-200 ${
                  result === "Inbox/"
                    ? "bg-neutral-800 transform scale-110 transition-transform duration-300"
                    : "bg-semiDark"
                }`}
              >
                Inbox
              </Sidebar.Item>
              <Sidebar.Item
                icon={MdGroups}
                onClick={() => {
                  handleItemClick();
                  router.push("/community");
                }}
                className={`bg-5 rounded-lg p-4 shadow-lg text-gray-200 ${
                  result === "Community/"
                    ? "bg-neutral-800 transform scale-110 transition-transform duration-300"
                    : "bg-semiDark"
                }`}
              >
                Community
              </Sidebar.Item>
              <Sidebar.Item
                onClick={() => {
                  handleItemClick();
                  router.push("/profile/#myPosts");
                }}
                icon={PiPaintBrushFill}
                className={`bg-5 rounded-lg p-4 shadow-lg text-gray-200 ${
                  result === "Profile/"
                    ? "bg-neutral-800 transform scale-110 transition-transform duration-300"
                    : "bg-semiDark"
                }`}
              >
                My Works
              </Sidebar.Item>
              <Sidebar.Item
                onClick={() => {
                  handleItemClick();
                  router.push("/orders");
                }}
                icon={MdWorkHistory}
                className={`bg-5 rounded-lg p-4 shadow-lg text-gray-200 ${
                  result === "Orders/"
                    ? "bg-neutral-800 transform scale-110 transition-transform duration-300"
                    : "bg-semiDark"
                }`}
              >
                Orders
              </Sidebar.Item>
            </Sidebar.ItemGroup>
          </Sidebar>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default HomeSidebar;

const ownTheme = {
  root: {
    base: "h-full",
    collapsed: {
      on: "w-16",
      off: "w-64",
    },
    inner:
      "h-full overflow-y-auto overflow-x-hidden rounded bg-gray-50 py-4 px-7 dark:bg-neutral-900",
  },
  collapse: {
    button:
      "group flex w-full items-center rounded-lg p-2 text-base font-normal text-gray-900 transition duration-75 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700",
    icon: {
      base: "h-6 w-6 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white",
      open: {
        off: "",
        on: "text-gray-900",
      },
    },
    label: {
      base: "ml-3 flex-1 whitespace-nowrap text-left",
      icon: {
        base: "h-6 w-6 transition ease-in-out delay-0",
        open: {
          on: "rotate-180",
          off: "",
        },
      },
    },
    list: "space-y-2 py-2",
  },
  cta: {
    base: "mt-6 rounded-lg p-4 bg-gray-100 dark:bg3",
    color: {
      blue: "bg-cyan-50 dark:bg-cyan-900",
      dark: "bg-dark-50 dark:bg-dark-900",
      failure: "bg-red-50 dark:bg-red-900",
      gray: "bg-alternative-50 dark:bg-alternative-900",
      green: "bg-green-50 dark:bg-green-900",
      light: "bg-light-50 dark:bg-light-900",
      red: "bg-red-50 dark:bg-red-900",
      purple: "bg-purple-50 dark:bg-purple-900",
      success: "bg-green-50 dark:bg-green-900",
      yellow: "bg-yellow-50 dark:bg-yellow-900",
      warning: "bg-yellow-50 dark:bg-yellow-900",
    },
  },
  item: {
    base: "flex items-center justify-center rounded-lg p-2 text-base font-normal text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700",
    active: "bg-gray-100 dark:bg-gray-700",
    collapsed: {
      insideCollapse: "group w-full pl-8 transition duration-75",
      noIcon: "font-bold",
    },
    content: {
      base: "px-3 flex-1 whitespace-nowrap",
    },
    icon: {
      base: "h-6 w-6 flex-shrink-0 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white",
      active: "text-gray-700 dark:text-gray-100",
    },
    label: "",
    listItem: "",
  },
  items: {
    base: "",
  },
  itemGroup: {
    base: "mt-4 space-y-2 border-t border-gray-200 pt-4 first:mt-0 first:border-t-0 first:pt-0 dark:border-gray-700",
  },
  logo: {
    base: "mb-5 flex items-center pl-2.5",
    collapsed: {
      on: "hidden",
      off: "self-center whitespace-nowrap text-xl font-semibold dark:text-white",
    },
    img: "mr-3 h-6 sm:h-7",
  },
};
