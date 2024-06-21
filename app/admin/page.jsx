'use client'
import React from "react";
import Login from "../../components/admin/login";
import ProtectedRoute from "@/components/admin/ProtectedRoute";
const AdminLogin = () => {
  return (
    <ProtectedRoute>
      <div className="purple-dark h-lvh bg-background text-foreground flex flex-col gap-11 items-center justify-center">
        <Login />
      </div>
    </ProtectedRoute>
  );
};

export default AdminLogin;
