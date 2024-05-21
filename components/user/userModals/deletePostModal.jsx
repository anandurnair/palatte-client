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


const DeletePostModal = ({ postId }) => {
    const url = process.env.NEXT_PUBLIC_API_URL;
  
    const router = useRouter()
  
    const handleDelete = async () => {
      try {
        await axiosInstance.delete(`${url}/delete-post?postId=${postId}`);
        toast.success("Post deleted");
        router.push("/profile/#myPosts");
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
              <p>Are want to delete the post ?</p>
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
  

  export default DeletePostModal;