"use client";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import axiosInstance from "../user/axiosConfig";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";
const ProtectedRoute = ({ children }) => {
  const user = useSelector((state) => state.user.currentUser);
  const router = useRouter();
  const pathname = usePathname();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/");
    }
  }, []);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const res = await axiosInstance.get(
          `http://localhost:4000/user-details?email=${user?.email}`
        );
        if (res.status === 200) {
          if (res.data.user?.isBlocked) {
            localStorage.removeItem("token");
            router.push("/");
          }
        } else {
          // console.log("Eror in verififcation");
          // alert(res.data.error);
        }
      } catch (error) {
        toast.error("Verification Failed");
      }
    };
    fetchUserDetails();
  }, [pathname]);

  return children;
};

export default ProtectedRoute;
