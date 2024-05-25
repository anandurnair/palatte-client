"use client";
import React, { useEffect, useState } from "react";
import axiosInstance from "../axiosConfig";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { RadioGroup, Radio } from "@nextui-org/react";
import { useRouter } from "next/navigation";


import {
  Button,
} from "@nextui-org/react";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/react";


const DeleteCommentModal = ({setUpdateComment, commentId ,setUpdate}) => {
    const url = process.env.NEXT_PUBLIC_API_URL;
  
    const router = useRouter()
  
    const handleDelete = async () => {
        
      try {
        const res = await axiosInstance.delete(`${url}/delete-comment?commentId=${commentId}`);
        if(res.status == 200){
            setUpdate(prev=>!prev)
            setUpdateComment(prev => !prev)
            toast.success("Comment deleted");
        }
      } catch (error) {
        console.error(error);
        toast.error(error);
      }
    };
    return (
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">Delete Post</ModalHeader>
            <ModalBody>
              <p>Are want to delete the comment ?</p>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Close
              </Button>
              <Button onPress={onClose} onClick={handleDelete}>
                Delete
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    );
  };
  

  export default DeleteCommentModal;