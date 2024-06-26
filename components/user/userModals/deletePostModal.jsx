"use client";
import dynamic from 'next/dynamic';

import React from "react";
import axiosInstance from "../axiosConfig";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { usePathname,useRouter } from 'next/navigation'  // Usage: App router

import {
  Button,
} from "@nextui-org/react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/react";

const DeletePostModal = ({ postId, setUpdate }) => {
  const url = process.env.NEXT_PUBLIC_API_URL;
  const router = useRouter();
  const pathname = usePathname();

  console.log("path namme",pathname)
  const handleDelete = async () => {
    try {
      await axiosInstance.delete(`${url}/delete-post?postId=${postId}`);
      toast.success("Post deleted");
      setUpdate((prev) => !prev);
      if(pathname !== '/home'){

        router.back();
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete the post");
    }
  };

  return (
    <ModalContent>
      {(onClose) => (
        <>
          <ModalHeader className="flex flex-col gap-1">Delete Post</ModalHeader>
          <ModalBody>
            <p>Are you sure you want to delete the post?</p>
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
