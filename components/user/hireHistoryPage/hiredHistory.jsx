"use client";

import React, { useState } from "react";
import ProtectedRoute from "../../user/ProtectedRoute";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Tabs,
  Tab,
  Card,
  CardBody,
  RadioGroup,
  Radio,
  Accordion,
  AccordionItem,
  Avatar,
  Button,
  Divider
} from "@nextui-org/react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Chip,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/react";

import { format } from "timeago.js";
import { useRadio, VisuallyHidden, cn } from "@nextui-org/react";
import { format  as formatDeadline} from "date-fns";

import { MdCurrencyRupee } from "react-icons/md";
import { IoMdTime } from "react-icons/io";
import { BiRevision } from "react-icons/bi";
import axiosInstance from "../axiosConfig";
import { useSelector } from "react-redux";

const HiredHistory = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectedOption, setSelectedOption] = useState("wallet");
  const currentUser = useSelector((state) => state.user.currentUser);
  const [allOrders, setAllOrders] = useState([]);
  const [modal, setModal] = useState();
  const [selectedOrder, setSelectedOrder] = useState();
  const [update,setUpdate] = useState(true)
  useState(() => {
    const fetchData = async () => {
      try {
        const res = await axiosInstance.get(
          `/get-client-orders?userId=${currentUser._id}`
        );
        console.log("orders : ", res.data.orders);
        setAllOrders(res.data.orders);
      } catch (error) {
        toast.error(error);
      }
    };
    fetchData();
  }, [currentUser,update]);

  const getTimeAgo = (date) => {
    return format(new Date(date));
  };
  const handleChoosePayment = () => {
    if (selectedOption == "wallet") {
      setModal("walletPayment");
    } else {
      setModal("stripePayment");
    }
    onOpen();
  };


  const handlePay = async()=>{
    const data = {
      orderId :selectedOrder?._id,
      clientId : currentUser?._id,
      freelancerId : selectedOrder?.freelancer,
      amount : selectedOrder?.plan?.price
    }

    try {
      const res = await axiosInstance.post('/service-payment',data)
      setUpdate(prev =>!prev)
      toast.success(res.data.message)
    } catch (error) {
      toast.error(error)
    }
  }

  return (
    <ProtectedRoute>
      <ToastContainer
        toastStyle={{ backgroundColor: "#1d2028" }}
        position="bottom-center"
      />
      <div className="w-full h-full flex flex-col  items-center rounded-lg px-20 my-5">
        <div className=" w-full overflow-y-auto">
          <Tabs aria-label="Options" placement="top" className="w-full">
            <Tab key="latest-order" title="New Orders" className="w-full">
              <Card>
                <CardBody className="h-auto">
                  <div className="w-full h-full flex ">
                    <Accordion variant="light" selectionMode="multiple">
                      {allOrders.map((order, index) => (
                        <AccordionItem
                          key={index}
                          aria-label={order?.freelancer?.fullname}
                          startContent={
                            <Avatar
                              isBordered
                              radius="lg"
                              src={order?.freelancer?.profileImg}
                            />
                          }
                          subtitle={getTimeAgo(order?.createdAt)}
                          title={`${order?.freelancer?.fullname} - ${order?.serviceName}`}
                        >
                          <Card>
                            <CardBody className="h-auto flex flex-col justify-between">
                              <div className="w-full h-full flex flex-col  p-5 gap-5 ">
                                <div className="text-2xl flex justify-between text-neutral-300 ">
                                  <h2 className="font-bold">
                                    {order?.plan.name}
                                  </h2>
                                  <div className="flex">
                                    <MdCurrencyRupee size={30} />
                                    <h2 className="">{order?.plan.price}.00</h2>
                                  </div>
                                </div>

                                <div className="text-neutral-300 flex flex-col gap-3">
                                  <div className="flex gap-2 ">
                                    <IoMdTime size={24} />
                                    <p>
                                      {order?.plan.deliveryTime}-day delivery
                                    </p>
                                  </div>
                                  <div className="flex gap-2 ">
                                    <BiRevision size={24} />
                                    <p>{order?.plan.revision} Revisions</p>
                                  </div>
                                </div>
                                <Divider className="my-4" />

                                <div className="w-full flex flex-col gap-y-3">
                                  <h2 className="text-lg font-bold">
                                    Requirements
                                  </h2>
                                  <p>{order?.requirements}</p>
                                </div>
                                <Divider className="my-4" />

                                <h2 className="text-lg font-bold">
                                    Details
                                  </h2>
                                <div className="w-full flex  gap-x-3">
                                  <h2 className="text-md  font-bold">
                                    Order Status :
                                  </h2>
                                  <Chip color="default">{order?.status}</Chip>
                                </div>
                               { order?.status === 'in progress' && <div className="w-full flex  gap-x-3">
                                  <h2 className="text-md  font-bold">
                                   Dead Line : 
                                  </h2>
                                  <Chip color="success">{formatDeadline(order?.deadline, "dd MMM yyyy hh:mm a")}</Chip>
                                </div>}
                              </div>
                              <div className="w-full flex justify-between gap-3 p-5">
                                {order.status === "pending" && (
                                  <>
                                  <div></div>
                                  <Button
                                    color="danger"
                                    variant="bordered"
                                    className=""
                                    onClick={() => {
                                      setModal("cancel");
                                      setSelectedOrder(order);
                                      onOpen();
                                    }}
                                  >  Cancel Order
                                  </Button>
                                  </>
                                  
                                  
                                )}
                                {order.status === "accepted" && (

                                  <>
                                 <div className="">
                                   <h3 className="font-bold">Choose payment method : {selectedOption}</h3> 
                                   <Button   onClick={() => {
                                      setModal("payment");
                                      setSelectedOrder(order);
                                      onOpen();
                                    }}>
                                    Choose
                                   </Button>
                                 </div>
                                  <Button
                                    color="primary"
                                    variant="bordered"
                                    className=""
                                  onClick={handleChoosePayment}
                                  >
                                    Continue Payment
                                  </Button>
                                  </>
                                 
                                )}
                              </div>
                            </CardBody>
                          </Card>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </div>
                </CardBody>
              </Card>
            </Tab>
            <Tab key="order-history" title="Order history">
              <Card>
                <CardBody className="h-96">
                  <div className="w-full h-full flex items-center justify-center">
                    <h2 className="text-2xl text-neutral-600">Order history</h2>
                  </div>
                </CardBody>
              </Card>
            </Tab>
          </Tabs>
        </div>
      </div>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        {modal === "payment" && (
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  Choose Payment
                </ModalHeader>
                <ModalBody>
                  {" "}
                  <RadioGroup
                    label="Select a payment"
                    value={selectedOption}
                    onValueChange={setSelectedOption}
                  >
                    <CustomRadio
                      description={`Balance Rs.${currentUser?.wallet?.balance}.00 `}
                      value="wallet"
                    >
                      Wallet
                    </CustomRadio>
                    <CustomRadio value="stripe">Stripe</CustomRadio>
                  </RadioGroup>
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="light" onPress={() => {
    onClose();
    setModal(''); // Clear modal state
  }}>
                    Close
                  </Button>
                  <Button
                    variant="bordered"
                    onPress={onClose}
                    
                  >
                    Ok
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        )}

        {modal === "cancel" && (
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  Cancel order
                </ModalHeader>
                <ModalBody>
                  <h2>Are you sure you want to cancel this order?</h2>
                  <p className="font-thin">( This action cannot be undone.)</p>
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="light"  onPress={() => {
    onClose();
    setModal(''); // Clear modal state
  }}>
                    Close
                  </Button>
                  <Button variant="bordered" onPress={onClose}>
                    Confirm
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        )}

        {modal === "walletPayment" && (
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  Wallet payment
                </ModalHeader>
                <ModalBody className="flex gap-5">
                  <h2>Are you sure you want to confirm this order?</h2>
                  <Card>
                    <CardBody className="h-auto">
                      <div className="w-full h-full flex flex-col gap-3 px-5">
                        <h2 className="text-md font-semibold">
                          Wallet
                        </h2>
                        <div className="w-full flex justify-between text-neutral-400">
                        <h2>Balance </h2>
                        <h2>Rs {currentUser?.wallet?.balance}.00</h2>
                        </div>
                      
                      </div>
                    </CardBody>
                  </Card>
                  <Card>
                    <CardBody className="h-auto">
                      <div className="w-full h-full flex flex-col gap-3 px-5">
                        <h2 className="text-md font-semibold">
                          Total
                        </h2>
                        <div className="w-full flex justify-between text-neutral-400">
                        <h2>Amount </h2>
                        <h2>Rs {selectedOrder?.plan?.price}.00</h2>
                        </div>
                      
                      </div>
                    </CardBody>
                  </Card>
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="light" onPress={() => {
    onClose();
    setModal(''); // Clear modal state
  }}>
                    Close
                  </Button>
                  <Button variant="bordered" onPress={onClose} onClick={handlePay}>
                    Pay
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        )}
      </Modal>
    </ProtectedRoute>
  );
};

export default HiredHistory;

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
        "data-[selected=true]:border-primary"
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
