import React from 'react'
import AdminDashboardComponent from '@/components/admin/adminDashboard'
const AdminDashboard = () => {
  return (
    <div className="purple-dark w-full  h-lvh bg-background text-foreground overflow-y-scroll">
      <h3 className="ml-7 text-2xl">Admin Dashboard</h3>

      <div className="px-5 mt-5">
        <AdminDashboardComponent/>
      </div>
    </div>
  )
}

export default AdminDashboard
