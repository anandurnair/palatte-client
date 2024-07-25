'use client'
import React, { useState } from 'react'
import HomeSidebar from '../../../components/user/sidebar'
import Header from '../../../components/user/header'
import ProtectedRoute from '@/components/user/ProtectedRoute'
const Home = ({children}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <ProtectedRoute>
      <div className="purple-dark bg-background text-foreground w-full flex flex-row overflow-hidden">
        <HomeSidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
        <div className="flex-1 flex flex-col">
          <Header toggleSidebar={toggleSidebar} />
         
            {children}
         
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Home;