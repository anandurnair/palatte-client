import React from "react";
import ProtectedRoute from "../../user/ProtectedRoute";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const HiredHistory = () => {
  return (
    <ProtectedRoute>
      <div className="w-full h-full flex flex-col  items-center rounded-lg px-20 my-5">
        <div className="w-5/6 h-full bg-semi mt-3 rounded-lg p-20 z-10 shadow-2xl flex items-center justify-center">
          <h2 className="text-2xl text-neutral-600">Hired history</h2>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default HiredHistory;
