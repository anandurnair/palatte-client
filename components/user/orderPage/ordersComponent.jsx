"use client";

import React, { useState,useEffect } from "react";
import ProtectedRoute from "../../user/ProtectedRoute";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { format  as formatDeadline} from "date-fns";

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
  ModalFooter,
  useDisclosure,
  Chip,
  Input
} from "@nextui-org/react";

import { format } from "timeago.js";

import { MdCurrencyRupee } from "react-icons/md";
import { IoMdTime } from "react-icons/io";
import { BiRevision } from "react-icons/bi";
import axiosInstance from "../axiosConfig";
import { useSelector } from "react-redux";

const OrdersComponent = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const currentUser = useSelector((state) => state.user.currentUser);
  const [allOrders, setAllOrders] = useState([]);
  const [modal, setModal] = useState();
  const [selectedOrder, setSelectedOrder] = useState();
  useState(() => {
    const fetchData = async () => {
      try {
        const res = await axiosInstance.get(
          `/get-freelance-orders?userId=${currentUser._id}`
        );
        console.log("orders : ", res.data.orders);
        setAllOrders(res.data.orders);
      } catch (error) {
        toast.error(error);
      }
    };
    fetchData();
  }, [currentUser]);

  const getTimeAgo = (date) => {
    return format(new Date(date));
  };

  const handleAcceptOrder = async () => {
    try {
      const res = await axiosInstance.patch(
        `/accept-order?orderId=${selectedOrder}`
      );
      toast.success(res.data.message);
    } catch (error) {
      toast.error(error);
    }
  };

  const handleRejectOrder = async () => {
    try {
      const res = await axiosInstance.patch(
        `/reject-order?orderId=${selectedOrder}`
      );
      toast.success(res.data.message);
    } catch (error) {
      toast.error(error);
    }
  };

  return (
    <ProtectedRoute>
      <div className="w-full h-full flex flex-col  items-center rounded-lg px-20 my-5">
        <div className=" w-full overflow-y-auto">
          <Tabs aria-label="Options" placement="top" className="w-full">
            <Tab key="latest-order" title="New Orders" className="w-full">
              <Card>
                <CardBody className="h-auto">
                  <div className="w-full h-full flex ">
                    <Accordion selectionMode="multiple">
                      {allOrders.map((order, index) => (
                        <AccordionItem
                          key={index}
                          aria-label={order?.client?.fullname}
                          startContent={
                            <Avatar
                              isBordered
                              radius="lg"
                              src={order?.client?.profileImg}
                            />
                          }
                          subtitle={getTimeAgo(order?.createdAt)}
                          title={`${order?.client?.fullname} - ${order?.serviceName}`}
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
                                <div className="w-full flex  gap-x-3">
                                  <h2 className="text-md  font-bold">
                                    Payment Status :
                                  </h2>
                                  <Chip color="default">{order?.status}</Chip>
                                </div>
                                {  order?.status === 'in progress' && <div className="w-full flex  gap-x-3">
                                  <h2 className="text-md  font-bold">
                                   Dead Line : 
                                  </h2>
                                  <Chip color="success">{formatDeadline(order?.deadline, "dd MMM yyyy hh:mm a")}</Chip>
                                </div>}
                                <div className="border-1 border-neutral-500 p-4 flex flex-col items-center rounded-lg  ">
                                  <div className="font-bold text-lg text-green-500">

                                <CountdownTimer deadline={order?.deadline} />
                                  </div>
                               <p className="text-neutral-300">If the work is not completed within this timeframe, payment will not be disbursed.</p> 
                                </div>
                            

                              </div>
                              <div className="w-full flex  gap-3 p-5">
                              <Input type="file" labelPlacement="outside" />
                              <Button>Upload</Button>
                              </div>
                              <div className="w-full flex justify-end gap-3 p-5">
                                {order?.status === "pending" && (
                                  <>
                                    <Button
                                      color="danger"
                                      variant="bordered"
                                      className=""
                                      onClick={() => {
                                        setModal("reject");
                                        setSelectedOrder(order._id);
                                        onOpen();
                                      }}
                                    >
                                      Reject
                                    </Button>
                                    <Button
                                      variant="bordered"
                                      className=" btn"
                                      onClick={() => {
                                        setModal("accept");
                                        setSelectedOrder(order._id);
                                        onOpen();
                                      }}
                                    >
                                      Accept
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
        {modal === "accept" && (
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  Confirm Order
                </ModalHeader>
                <ModalBody>
                  Are you sure you want to accept this order?
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="light" onPress={onClose}>
                    Close
                  </Button>
                  <Button
                    variant="bordered"
                    onClick={handleAcceptOrder}
                    onPress={onClose}
                  >
                    Accept
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        )}

        {modal === "reject" && (
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  Reject order
                </ModalHeader>
                <ModalBody>
                  <h2>Are you sure you want to reject this order?</h2>
                  <p className="font-thin">( This action cannot be undone.)</p>
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="light" onPress={onClose}>
                    Cancel
                  </Button>
                  <Button
                    variant="bordered"
                    onClick={handleRejectOrder}
                    onPress={onClose}
                  >
                    Reject
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

export default OrdersComponent;




const CountdownTimer = ({ deadline }) => {
  const calculateTimeLeft = () => {
    const difference = new Date(deadline) - new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearTimeout(timer);
  });

  const timerComponents = [];

  Object.keys(timeLeft).forEach((interval) => {
    if (!timeLeft[interval]) {
      return;
    }

    timerComponents.push(
      <span key={interval}>
        {timeLeft[interval]} {interval}{" "}
      </span>
    );
  });

  return (
    <div>
      {timerComponents.length ? timerComponents : <span>Time's up!</span>}
    </div>
  );
};