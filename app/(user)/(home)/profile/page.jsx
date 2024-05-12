'use client'
import React from 'react'
import ProfileComponent from '@/components/user/profile'
import UserPosts from '../../../../components/user/userPosts'
const ProfilePage = () => {
  return (
    <div className=' purple-dark h-full bg-background text-foreground  flex flex-col justify-center overflow-scroll'>
        <ProfileComponent/>
        <UserPosts/>
    </div>
  )
}

export default ProfilePage
