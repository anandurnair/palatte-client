import React from 'react'
import AdminSidebar from '../../../components/admin/sideBar'
import Header from '../../../components/admin/header'
const AdminLayout = ({
    children
  }) => {
  return (
    <div className='w-full h-lvh  '>
        <Header/>
      <div className='w-full flex '>
        <AdminSidebar/>
      {children}
      </div>
    </div>
  )
}

export default AdminLayout
