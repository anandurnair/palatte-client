import React, { useState } from "react";
import { RadioGroup, Input, Radio, cn } from "@nextui-org/react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import { toast } from "react-toastify";
import axiosInstance from "../axiosConfig";

const SelectServiceModal = ({ services,setFreelancers,serviceId,setServiceId}) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const handleSelect =async()=>{
        console.log("Service id : ",serviceId)
        if(!serviceId){
            alert('select a service')
            return;
        }

        try {
            const res = await axiosInstance.get(`/get-freelancers-by-Id?serviceId=${serviceId}`);
            console.log("Freelanncers ",res.data.freelancers)
            setFreelancers(res.data.freelancers)
        } catch (error) {
            alert(error)
        }
    }

  return (
    <>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Select service
            </ModalHeader>
            <ModalBody>
              <RadioGroup label="" value={serviceId}
              onValueChange={setServiceId}>
                {services.map((service) => (
                  <CustomRadio value={service._id}>
                    {service.serviceName}
                  </CustomRadio>
                ))}
              </RadioGroup>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Close
              </Button>
              <Button color="primary" onClick={handleSelect} onPress={onClose}>
                Select
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </>
  );
};

export default SelectServiceModal;

export const CustomRadio = (props) => {
  const { children, ...otherProps } = props;

  return (
    <Radio
      {...otherProps}
      classNames={{
        base: cn(
          "inline-flex m-0 bg-content1 hover:bg-content2 items-center justify-between",
          "flex-row-reverse min-w-full cursor-pointer rounded-lg gap-4 p-4 border-2 border-stone-300",
          "data-[selected=true]:border-primary"
        ),
      }}
    >
      {children}
    </Radio>
  );
};
