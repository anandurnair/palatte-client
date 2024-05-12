import React from 'react'
import ServiceTable from '../../../../components/admin/serviceTable'
const UserManagement = () => {
  return (
    <div className='purple-dark w-full  h-lvh bg-background text-foreground overflow-y-scroll'>
     <h3 className='ml-7 text-2xl'>Service Management</h3>
      <div className='px-5 mt-5'>
      
      <ServiceTable/>
      </div>
      
    </div>
  )
}

export default UserManagement