"use client";
import React, { useEffect, useState } from "react";
import ProtectedRoute from "../../user/ProtectedRoute";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Input, Button, useTable } from "@nextui-org/react";
import { MdCurrencyRupee } from "react-icons/md";
import { IoMdTime } from "react-icons/io";
import { BiRevision } from "react-icons/bi";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Accordion,
  AccordionItem,
} from "@nextui-org/react";
import { Select, SelectItem, Textarea } from "@nextui-org/react";
import { Tabs, Tab, Divider } from "@nextui-org/react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Checkbox,
  Avatar,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import axiosInstance from "../axiosConfig";
const ServiceList = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectedService, setSelectedService] = useState();
  const router = useRouter();
  const [update,setUpdate] = useState(true)
  const [serviceList,setServiceList] = useState([])
  const [description, setDescription] = useState(null);
  const [allServices, setAllServices] = useState([]);
  const currentUser = useSelector((state) => state.user.currentUser);
  const [basic, setBasic] = useState({
    name: "basic",
    price: 0,
    deliveryTime: 2,
    revision: 5,
  });
  const [standard, setStandard] = useState({
    name: "standard",
    price: 0,
    deliveryTime: 5,
    revision: 10,
  });
  const [premium, setPremium] = useState({
    name: "premium",
    price: 0,
    deliveryTime: 8,
    revision: 15,
  });
  useEffect(() => {
    try {
      const fetchData = async () => {
        const res = await axiosInstance.get("/getServices");
        setAllServices(res.data.services);
      };
      fetchData();
    } catch (error) {
      toast.error(error);
    }


  }, []);

  useEffect(() => {
    try {
      const fetchData = async () => {
        const res = await axiosInstance.get(`/get-freelance-service-list?userId=${currentUser?._id}`);
        setServiceList(res.data.freelancerServices?.services || []);
      };
      fetchData();
    } catch (error) {
      toast.error(error);
    }


  }, [update]);


  const addService =async () => {
    if (
      !selectedService ||
      !description ||
      basic.price <= 0 ||
      basic.deliveryTime <= 0 ||
      basic.revision <= 0 ||
      standard.price <= 0 ||
      standard.deliveryTime <= 0 ||
      standard.revision <= 0 ||
      premium.price <= 0 ||
      premium.deliveryTime <= 0 ||
      premium.revision <= 0
    ) {
      toast.error("Please fill all fields with valid values.");
      return;
    }
  
    const serviceData = {
      userId: currentUser?._id,
      serviceName: selectedService,
      description,
      basic,
      standard,
      premium,
    };
  
   await axiosInstance.post('/add-freelance-service', serviceData)
      .then(response => {
        toast.success(response.data.message);
        setUpdate(prev => !prev)
        // Close modal and reset form if needed
      })
      .catch(error => {
        toast.error(error.response?.data?.error || "Failed to add service");
      });
  };
  
  return (
    <ProtectedRoute>
      <ToastContainer
        toastStyle={{ backgroundColor: "#20222b", color: "#fff" }}
        position="bottom-right"
      />
      <div className="w-full h-full  flex flex-col items-center rounded-lg mb-5 gap-y-5 px-20  mr-4">
        <>
          <div className="w-full h-auto bg-semi py-2 px-8 rounded-lg flex border-2 border-neutral-800 justify-between items-center">
            <h2>Service List</h2>

            <Button className="btn border-1 bg-semi" onPress={onOpen}>
              Add service
            </Button>
          </div>
          <div className="w-full h-auto  py-2  rounded-lg flex flex-col gap-2">
            {serviceList.length === 0  && <h2 className="text-center">No services</h2>}
           {
            serviceList.map((s)=>(
              <div
              onClick={() =>
                router.push(`/serviceDetails?userId=${currentUser?._id}&&service=${s.title}`)
              }
            >
              <Card className="w-full p-5 cursor-pointer">
                <CardBody className="w-full">
                  <h2 className="text-lg">{s.title}</h2>
                </CardBody>
              </Card>
            </div>
            ))
           }
            
          </div>
        </>
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  Add service
                </ModalHeader>
                <ModalBody>
                  <div className="w-full px-3 flex flex-col  gap-y-4">
                    <Select
                      className="w-full"
                      variant="bordered"
                      size="md"
                      label="Select a service"
                      onChange={(e) => setSelectedService(e.target.value)}
                    >
                      {allServices.map((s) => (
                        <SelectItem key={s.serviceName} value={s.serviceName}>
                          {s.serviceName}
                        </SelectItem>
                      ))}
                    </Select>
                    <Textarea
                      label="Description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      variant="bordered"
                      placeholder="Enter service description"
                      disableAnimation
                      disableAutosize
                      classNames={{
                        base: "w-full",
                        input: "resize-y min-h-[50px]",
                      }}
                    />
                    <div className="flex h-full w-full flex-col">
                      <Tabs aria-label="Options" placement="top">
                        <Tab key="basic" title="Basic">
                          <Card>
                            <CardBody classNamex="h-auto flex flex-col justify-between">
                              <div className="w-full h-full flex flex-col  p-2 gap-5 ">
                                <div className="text-2xl flex text-neutral-300 ">
                                    <Input
                                      type="number"
                                      label="Price"
                                      value={basic.price}
                                      onChange={(e) =>
                                        setBasic({
                                          ...basic,
                                          price: parseFloat(e.target.value) ,
                                        })
                                      }
                                      placeholder="0.00"
                                      labelPlacement="outside"
                                      startContent={
                                        <div className="pointer-events-none flex items-center">
                                          <span className="text-default-400 text-small">
                                            <MdCurrencyRupee size={16} />
                                          </span>
                                        </div>
                                      }
                                    />
                                </div>

                                <div className="text-neutral-300 flex flex-col gap-3">
                                  <div className="text-2xl flex text-neutral-300">
                                    <Input
                                      type="number"
                                      label="Delivery Time (days)"
                                      placeholder="2"
                                      value={basic.deliveryTime}
                                      onChange={(e) =>
                                        setBasic({
                                          ...basic,
                                          deliveryTime:
                                            parseInt(e.target.value),
                                        })
                                      }
                                      labelPlacement="outside"
                                      startContent={
                                        <div className="pointer-events-none flex items-center">
                                          <span className="text-default-400 text-small">
                                            <IoMdTime size={24} />
                                          </span>
                                        </div>
                                      }
                                    />
                                  </div>
                                  <div className="text-2xl flex text-neutral-300">
                                    <Input
                                      type="number"
                                      label="Number of Revisions"
                                      placeholder="5"
                                      value={basic.revision}
                                      onChange={(e)=>setBasic({...basic,revision: parseInt(e.target.value)||0})}
                                      labelPlacement="outside"
                                      startContent={
                                        <div className="pointer-events-none flex items-center">
                                          <span className="text-default-400 text-small">
                                            <BiRevision size={24} />
                                          </span>
                                        </div>
                                      }
                                    />
                                  </div>
                                </div>
                              </div>
                            </CardBody>
                          </Card>
                        </Tab>
                        <Tab key="standard" title="Standard">
                          <Card>
                            <CardBody className="h-auto flex flex-col justify-between">
                              <div className="w-full h-full flex flex-col  p-2 gap-5 ">
                                <div className="text-2xl flex text-neutral-300 ">
                                  <Input
                                    type="number"
                                    label="Price"
                                    value={standard.price}
                                    onChange={(e) =>
                                      setStandard({
                                        ...standard,
                                        price: parseFloat(e.target.value) ,
                                      })
                                    }
                                    placeholder="0.00"
                                    labelPlacement="outside"
                                    startContent={
                                      <div className="pointer-events-none flex items-center">
                                        <span className="text-default-400 text-small">
                                          <MdCurrencyRupee size={16} />
                                        </span>
                                      </div>
                                    }
                                  />
                                </div>

                                <div className="text-neutral-300 flex flex-col gap-3">
                                  <div className="text-2xl flex text-neutral-300">
                                    <Input
                                      type="number"
                                      label="Delivery Time (days)"
                                      placeholder="2"
                                      labelPlacement="outside"
                                      value={standard.deliveryTime}
                                      onChange={(e) =>
                                        setStandard({
                                          ...standard,
                                          deliveryTime: parseInt(e.target.value) ,
                                        })
                                      }
                                      startContent={
                                        <div className="pointer-events-none flex items-center">
                                          <span className="text-default-400 text-small">
                                            <IoMdTime size={24} />
                                          </span>
                                        </div>
                                      }
                                    />
                                  </div>
                                  <div className="text-2xl flex text-neutral-300">
                                    <Input
                                      type="number"
                                      label="Number of Revisions"
                                      placeholder="5"
                                      labelPlacement="outside"
                                      value={standard.revision}
                                      onChange={(e) =>
                                        setStandard({
                                          ...standard,
                                          deliveryTime: parseInt(e.target.value),
                                        })
                                      }
                                      startContent={
                                        <div className="pointer-events-none flex items-center">
                                          <span className="text-default-400 text-small">
                                            <BiRevision size={24} />
                                          </span>
                                        </div>
                                      }
                                    />
                                  </div>
                                </div>
                              </div>
                            </CardBody>
                          </Card>
                        </Tab>
                        <Tab key="premium" title="Premium">
                          <Card>
                            <CardBody className="h-auto flex flex-col justify-between">
                              <div className="w-full h-full flex flex-col  p-2 gap-5 ">
                                <div className="text-2xl flex text-neutral-300 ">
                                  <Input
                                    type="number"
                                    label="Price"
                                    placeholder="0.00"
                                    value={premium.price}
                                    onChange={(e) =>
                                      setPremium({
                                        ...premium,
                                        price: parseFloat(e.target.value) 
                                      })
                                    }
                                    labelPlacement="outside"
                                    startContent={
                                      <div className="pointer-events-none flex items-center">
                                        <span className="text-default-400 text-small">
                                          <MdCurrencyRupee size={16} />
                                        </span>
                                      </div>
                                    }
                                  />
                                </div>

                                <div className="text-neutral-300 flex flex-col gap-3">
                                  <div className="text-2xl flex text-neutral-300">
                                    <Input
                                      type="number"
                                      label="Delivery Time (days)"
                                      placeholder="2"
                                      labelPlacement="outside"
                                      value={premium.deliveryTime}
                                      onChange={(e) =>
                                        setPremium({
                                          ...premium,
                                          deliveryTime: parseInt(e.target.value) ,
                                        })
                                      }
                                      startContent={
                                        <div className="pointer-events-none flex items-center">
                                          <span className="text-default-400 text-small">
                                            <IoMdTime size={24} />
                                          </span>
                                        </div>
                                      }
                                    />
                                  </div>
                                  <div className="text-2xl flex text-neutral-300">
                                    <Input
                                      type="number"
                                      label="Number of Revisions"
                                      placeholder="5"
                                      value={premium.revision}
                                      onChange={(e) =>
                                        setPremium({
                                          ...premium,
                                          deliveryTime: parseInt(e.target.value) ,
                                        })
                                      }
                                      labelPlacement="outside"
                                      startContent={
                                        <div className="pointer-events-none flex items-center">
                                          <span className="text-default-400 text-small">
                                            <BiRevision size={24} />
                                          </span>
                                        </div>
                                      }
                                    />
                                  </div>
                                </div>
                              </div>
                            </CardBody>
                          </Card>
                        </Tab>
                      </Tabs>
                    </div>
                  </div>
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="light" onPress={onClose}>
                    Cancel
                  </Button>
                  <Button variant="bordered" className="btn" onPress={onClose} onClick={addService}>
                    Add
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </div>
    </ProtectedRoute>
  );
};

export default ServiceList;
