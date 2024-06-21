'use client'
import React from 'react'
import HomeSidebar from '../../../components/user/sidebar'
import Header from '../../../components/user/header'
const HomeLayout = ({children}) => {
  return (
    <div className='purple-dark bg-background text-foreground  w-full h-lvh flex '>
      <HomeSidebar/>
      <div className='w-full flex flex-col'>
        <Header/>
      {children}
      </div>
    </div>
  )
}

export default HomeLayout