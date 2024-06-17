"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
const ProtectedRoute = ({ children }) => {
  const router = useRouter();

  useEffect(() => {
    const isLogin = JSON.parse(localStorage.getItem("admin"));
    console.log("Is login :", isLogin);
    if (!isLogin) {
      router.push("/admin");
    }
  }, []);

  return children;
};

export default ProtectedRoute;
