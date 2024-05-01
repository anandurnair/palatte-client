import React from 'react'
import UserTable from '@/components/admin/userTable'
const UserManagement = () => {
  return (
    <div className='purple-dark w-full  h-lvh bg-background text-foreground overflow-y-scroll'>
     <h3 className='ml-7 text-2xl'>User Management</h3>
      <div className='px-5 mt-5'>
      
      <UserTable/>
      </div>
      
    </div>
  )
}

export default UserManagement
