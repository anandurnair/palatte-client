'use client'
import React from 'react'
import {Button} from "@nextui-org/react";
import { useRouter } from 'next/navigation';

const OrderSuccessPage = () => {
    const router = useRouter()
  return (
    <div className=" purple-dark h-full bg-background text-foreground  flex flex-col justify-center overflow-scroll">
       <div className="w-full h-auto  flex flex-col items-center rounded-lg my-5">
       <div className="w-2/5 h-auto bg-semi flex flex-col items-center  rounded-lg  z-10 shadow-2xl py-20 gap-y-5">
       <h2 className='text-2xl'>Payment Successfull</h2>
       <Button variant='bordered' onClick={()=>{
        router.push('/hiredHistory')
       }}>Back</Button>
       </div>   
       </div>
    </div>
  )
}

export default OrderSuccessPage