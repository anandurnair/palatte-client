'use client'
import React from 'react'
import ReportedPostTable from '@/components/admin/reportedPostTable'
const ReportedComments = () => {
  return (
    <div className='purple-dark w-full  h-lvh bg-background text-foreground overflow-y-scroll'>
     <h3 className='ml-7 text-2xl'>Reported Comment Management</h3>
      <div className='px-5 mt-5'>
      
      <ReportedPostTable/>

      </div>
      
    </div>
  )
}

export default ReportedComments