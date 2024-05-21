"use client";
import React, { useEffect, useState } from "react";
import axiosInstance from "../axiosConfig";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { RadioGroup, Radio } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import {Input} from "@nextui-org/react";


import {
  Button,
} from "@nextui-org/react";

import {
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/react";


const EditPostModal = ({ postId,setUpdate }) => {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const url = process.env.NEXT_PUBLIC_API_URL;
    const [caption,setCaption] = useState('')
    useEffect(()=>{
        const fetchCaption=async()=>{
            try {
                const res = await axiosInstance.get(
                    `${url}/get-post-details?postId=${postId}`
                  );
                  if(res.status == 200){
                    const post = res.data.post;
                    console.log('Caption : ',caption)
                    setCaption(post.caption)

                  }
            } catch (error) {
                toast.error(error)
            }
           
        }
        fetchCaption()
    },[])


  
    
    const handleEdit = async () => {
        if(caption.trim() === ''){
            toast.error('Invalid caption')
            return;
        }
      try {
        await axiosInstance.patch(`${url}/edit-post`,{postId,caption});
        toast.success("Post edited");
        setUpdate(prev => !prev)
      } catch (error) {
        console.error(error);
        toast.error(error);
      }
    };
    return (
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">Edit Post</ModalHeader>
            <ModalBody>
            <Input size='md' type="text" label="Caption"  value={caption} onChange={(e)=>setCaption(e.target.value)} />

            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Close
              </Button>
              <Button onPress={onClose} onClick={handleEdit}>
                Submit
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    );
  };
  

  export default EditPostModal;