import React from 'react'
import CreateProfileForm from '@/components/user/createProfileForm'
import Loading from '../loading'
import { Suspense } from "react";

const CreateProfile = () => {

  return (
    <div  className="purple-dark h-auto bg-background text-foreground ">
      <Suspense fallback={<Loading/>}>

      <CreateProfileForm/>
      </Suspense>
    </div>
  )
}

export default CreateProfile
