"use client";
import React, { useEffect, useState } from "react";
import axiosInstance from "../axiosConfig";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { RadioGroup, Radio } from "@nextui-org/react";

import { Button } from "@nextui-org/react";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/react";

const ReportCommentModal = ({commentId, postId, userId }) => {
  console.log("userId", userId);
  const url = process.env.NEXT_PUBLIC_API_URL;
  const [selected, setSelected] = useState("It's spam");

  const handleReport = async () => {
    try {
    const res =   await axiosInstance.post(`${url}/report-comment`, {
        commentId,
        postId,
        userId,
        reason: selected,
      });
      if(res.status == 200){

          toast.success("Comment reported");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error in reporting");
    }
  };
  return (
    <ModalContent>
      {(onClose) => (
        <>
          <ModalHeader className="flex flex-col gap-1">Report Comment</ModalHeader>
          <ModalBody>
            <p>Why are you reporting this comment ?</p>
            <div className="flex flex-col gap-5">
              <RadioGroup label="" value={selected} onValueChange={setSelected}>
                <Radio value="It's spam">It's spam</Radio>
                <Radio value="Nudity or sexual activity">
                  Nudity or sexual activity
                </Radio>
                <Radio value="Hate speech or symbols">
                  Hate speech or symbols
                </Radio>
                <Radio value="False information">False information</Radio>
                <Radio value="Bullying or harassment">
                  Bullying or harassment
                </Radio>
              </RadioGroup>
              <p className="text-default-500 text-small">
                Reason for report : {selected}
              </p>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={onClose}>
              Close
            </Button>
            <Button onPress={onClose} onClick={handleReport}>
              Report
            </Button>
          </ModalFooter>
        </>
      )}
    </ModalContent>
  );
};

export default ReportCommentModal;
