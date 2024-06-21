"use client";
import React, { useEffect, useState } from "react";
import axiosInstance from "../axiosConfig";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  RadioGroup,
  Radio,
  useRadio,
  VisuallyHidden,
  cn,
} from "@nextui-org/react";

import { Button, Input } from "@nextui-org/react";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/react";

const SaveModal = ({setUpdate, postId, userId }) => {
  const url = process.env.NEXT_PUBLIC_API_URL;
  const [selected, setSelected] = useState("All");
  const [show, setShow] = useState(false);
  const [collectionNames, setCollectionNames] = useState([]);

  useEffect(() => {
    const fetchCollectionNames = async () => {
      try {
        const res = await axiosInstance.get(
          `http://localhost:4000/get-collections?userId=${userId}`
        );
        console.log(res.data.collectionNames);
        setCollectionNames(res.data.collectionNames);
      } catch (error) {
        alert(error);
      }
    };

    fetchCollectionNames();
  }, [userId]);

  const showInput = () => {
    setShow((prev) => !prev);
  };

  const handleSave = async () => {
    console.log("selected value : ", selected);
    // console.log("new collection :",newCollection)
    try {
      await axiosInstance.post(`${url}/save-post`, {
        postId,
        userId,
        collectionName: selected,
      });
      setUpdate(prev =>!prev)
      toast.success("Post saved");
    } catch (error) {
      console.error(error);
      toast.error("Error in saving");
    }
  };
  return (
    <ModalContent>
      {(onClose) => (
        <>
          <ModalHeader className="flex flex-col gap-1">
            Save to collection
          </ModalHeader>
          <ModalBody>
            <RadioGroup
              label="Collections"
              value={selected}
              onValueChange={setSelected}
              color="default"
            >
              {collectionNames.map((item,index) => (
                <CustomRadio key={index} value={item}>
                  {item}
                </CustomRadio>
              ))}
            </RadioGroup>
            <Button className="btn" variant="ghost" onClick={showInput}>
              Add collection
            </Button>
            {show && (
              <Input
                type="text"
                label="Enter collection name"
                variant="bordered"
                onChange={(e) => setSelected(e.target.value)}
              />
            )}
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={onClose}>
              Close
            </Button>
            <Button variant="bordered" onPress={onClose} onClick={handleSave}>
              Save
            </Button>
          </ModalFooter>
        </>
      )}
    </ModalContent>
  );
};

export default SaveModal;

const CustomRadio = (props) => {
  const {
    Component,
    children,
    isSelected,
    description,
    getBaseProps,
    getWrapperProps,
    getInputProps,
    getLabelProps,
    getLabelWrapperProps,
    getControlProps,
  } = useRadio(props);

  return (
    <Component
      {...getBaseProps()}
      className={cn(
        "group inline-flex items-center hover:opacity-70 active:opacity-50 justify-between flex-row-reverse tap-highlight-transparent",
        "w-full cursor-pointer border-2 border-default rounded-lg gap-4 p-4",
        "data-[selected=true]:border-teal-500"
      )}
    >
      <VisuallyHidden>
        <input {...getInputProps()} />
      </VisuallyHidden>
      <span {...getWrapperProps()}>
        <span {...getControlProps()} />
      </span>
      <div {...getLabelWrapperProps()}>
        {children && <span {...getLabelProps()}>{children}</span>}
        {description && (
          <span className="text-small text-foreground opacity-70">
            {description}
          </span>
        )}
      </div>
    </Component>
  );
};
