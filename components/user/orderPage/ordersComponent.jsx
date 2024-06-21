"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import ProtectedRoute from "../../user/ProtectedRoute";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { format as formatDeadline } from "date-fns";
import { io } from "socket.io-client";

import {
  Tabs,
  Tab,
  Card,
  CardBody,
  Accordion,
  AccordionItem,
  Avatar,
  Button,
  Divider,
  Chip,
  Input,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Image,
  Spinner,
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
  const [image, setImage] = useState("");
  const [update, setUpdate] = useState(false);
  const socket = useRef(null);
  socket.current = io(process.env.NEXT_PUBLIC_API_URL);
  const fetchData = useCallback(async () => {
    try {
      const res = await axiosInstance.get(
        `/get-freelance-orders?userId=${currentUser._id}`
      );
      console.log("orders : ", res.data.orders);
      setAllOrders(res.data.orders);
    } catch (error) {
      toast.error(error.message);
    }
  }, [currentUser._id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const getTimeAgo = (date) => {
    return format(new Date(date));
  };

  const handleAcceptOrder = async () => {
    try {
      const res = await axiosInstance.patch(
        `/accept-order?orderId=${selectedOrder._id}`
      );
      setUpdate((prev) => !prev);
      console.log("Selected Order : ",selectedOrder)
      socket.current.emit("accept", 
        currentUser,selectedOrder?.client
      );
      toast.success(res.data.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleRejectOrder = async () => {
    try {
      const res = await axiosInstance.patch(
        `/reject-order?orderId=${selectedOrder._id}`
      );
      socket.current.emit("reject", 
        currentUser,selectedOrder?.client
      );
      setUpdate((prev) => !prev);
      toast.success(res.data.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleFileInputChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = (event) => {
        const dataURL = event.target.result;
        setImage(dataURL);
      };

      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async (orderId) => {
    try {
      const res = await axiosInstance.post("/upload-freelance-work", {
        orderId,
        image,
      });
      setUpdate((prev) => !prev);
      socket.current.emit("upload", 
        currentUser,selectedOrder?.client
      );
      setImage(null);
      toast.success(res.data.message);
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  

  const onTimeUp =async(orderId)=>{
    try {
      const res = await axiosInstance.post("/work-uncompleted", {
        orderId ,
      });
      setUpdate((prev) => !prev);
      toast.success(res.data.message);
    } catch (error) {
      console.log(error);
      toast.error(error.message)
    }
  }

  return (
    <ProtectedRoute>
      <ToastContainer
        toastStyle={{ backgroundColor: "#1d2028" }}
        position="bottom-center"
      />
      <div className="w-full h-full flex flex-col items-center rounded-lg px-20 my-5">
        <div className="w-full overflow-y-auto">
          <Tabs aria-label="Options" placement="top" className="w-full">
            <Tab key="latest-order" title="New Orders" className="w-full">
              <Card>
                <CardBody className="h-auto">
                  <div className="w-full h-full flex">
                    <Accordion selectionMode="multiple">
                      {allOrders.slice().reverse().map(
                        (order, index) =>
                          order.status !== "rejected" && order.status !== "completed" && (
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
                                  <div className="w-full h-full flex flex-col p-5 gap-5">
                                    <div className="text-2xl flex justify-between text-neutral-300">
                                      <h2 className="font-bold">
                                        {order?.plan.name}
                                      </h2>
                                      <div className="flex">
                                        <MdCurrencyRupee size={30} />
                                        <h2 className="">
                                          {order?.plan.price}.00
                                        </h2>
                                      </div>
                                    </div>

                                    <div className="text-neutral-300 flex flex-col gap-3">
                                      <div className="flex gap-2">
                                        <IoMdTime size={24} />
                                        <p>
                                          {order?.plan.deliveryTime}-day
                                          delivery
                                        </p>
                                      </div>
                                      <div className="flex gap-2">
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
                                    <div className="w-full flex gap-x-3">
                                      <h2 className="text-md font-bold">
                                        Order Status :
                                      </h2>
                                      <Chip color="success" variant="bordered">
                                        {order?.status}
                                      </Chip>
                                    </div>
                                    <div className="w-full flex gap-x-3">
                                      <h2 className="text-md font-bold">
                                      Remaining revisions :
                                      </h2>
                                      <h2>{order.remainingRevisions}</h2>
                                    </div>

                                    {order.status === "accepted" && (
                                      <div className="w-full flex justify-center gap-x-3">
                                        <Spinner
                                          label="Awaiting payment from the client..."
                                          color="warning"
                                          size="lg"
                                        />
                                      </div>
                                    )}
                                    {/* <div className="w-full flex gap-x-3">
                                  <h2 className="text-md font-bold">Payment Status :</h2>
                                  <Chip color="default">{order?.paymentStatus}</Chip>
                                </div> */}
                                    {order?.status === "in progress" && (
                                      <>
                                        <div className="w-full flex gap-x-3">
                                          <h2 className="text-md font-bold">
                                            Dead Line :
                                          </h2>
                                          <Chip color="success">
                                            {formatDeadline(
                                              order?.deadline,
                                              "dd MMM yyyy hh:mm a"
                                            )}
                                          </Chip>
                                        </div>
                                        <div className="border-1 border-neutral-500 p-4 flex flex-col items-center rounded-lg">
                                          <div className="font-bold text-lg text-green-500">
                                            <CountdownTimer orderId = {order._id} 
                                              deadline={order?.deadline} onTimeUp={onTimeUp}
                                            />
                                          </div>
                                          <p className="text-neutral-300">
                                            If the work is not completed within
                                            this timeframe, payment will not be
                                            disbursed.
                                          </p>
                                        </div>
                                      </>
                                    )}
                                    {order?.status === "revision" && (
                                          <>
                                           <div className="w-full flex gap-x-3">
                                            <h2 className="text-md font-bold">
                                            Additional Requriements :
                                            </h2>
                                            <h2>
                                              {order.additionalRequirements}
                                            </h2>
                                          </div>
                                          <div className="w-full flex gap-x-3">
                                            <h2 className="text-md font-bold">
                                            Reamining Revisions :
                                            </h2>
                                            <Chip color="success">
                                              {order.remainingRevisions}
                                            </Chip>
                                          </div>
                                          <div className="w-full flex gap-x-3">
                                            <h2 className="text-md font-bold">
                                            Revision  Deadline :
                                            </h2>
                                            <Chip color="success">
                                              {formatDeadline(
                                                order?.deadline,
                                                "dd MMM yyyy hh:mm a"
                                              )}
                                            </Chip>
                                          </div>
                                          <div className="border-1 border-neutral-500 p-4 flex flex-col items-center rounded-lg">
                                            <div className="font-bold text-lg text-green-500">
                                              <CountdownTimer
                                                deadline={order?.deadline} setSelectedOrder={selectedOrder} order={order}
                                              />
                                            </div>
                                            <p className="text-neutral-300">
                                              If the work is not completed
                                              within this timeframe, payment
                                              will not be disbursed.
                                            </p>
                                          </div>
                                          </>
                                         
                                        )}
                                  </div>
                                  {(order?.status === "in progress" || order?.status == "revision") && (
                                    <>
                                      <div className="w-full flex gap-3 p-5">
                                        <Input
                                          type="file"
                                          labelPlacement="outside"
                                          onChange={handleFileInputChange}
                                        />
                                        <Button
                                          onClick={() =>{

                                            setSelectedOrder(order)
                                            handleUpload(order._id)
                                          }
                                          }
                                        >
                                          Upload
                                        </Button>
                                      </div>
                                      <div className="w-full flex flex-col items-center gap-3 p-5">
                                        {image && (
                                          <h2 className="font-bold">Preview</h2>
                                        )}
                                        <Image
                                          width={300}
                                          alt="NextUI hero Image"
                                          src={image}
                                        />
                                      </div>
                                    </>
                                  )}
                                  

                                  <div className="w-full flex justify-end gap-3 p-5">
                                    {order?.status === "pending" && (
                                      <>
                                        <Button
                                          color="danger"
                                          variant="bordered"
                                          className=""
                                          onClick={() => {
                                            setModal("reject");
                                            setSelectedOrder(order);
                                            onOpen();
                                          }}
                                        >
                                          Reject
                                        </Button>
                                        <Button
                                          variant="bordered"
                                          className="btn"
                                          onClick={() => {
                                            setModal("accept");
                                            setSelectedOrder(order);
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
                          )
                      )}
                    </Accordion>
                  </div>
                </CardBody>
              </Card>
            </Tab>
            <Tab key="order-history" title="Order history">
              <Card>
                <CardBody className="h-auto">
                  <div className="w-full h-full flex">
                    <Accordion selectionMode="multiple">
                      {allOrders
                        .slice()
                        .reverse()
                        .map(
                          (order, index) =>
                            order.status === "completed" && (
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
                                    <div className="w-full h-full flex flex-col p-5 gap-5">
                                      <div className="text-2xl flex justify-between text-neutral-300">
                                        <h2 className="font-bold">
                                          {order?.plan.name}
                                        </h2>
                                        <div className="flex">
                                          <MdCurrencyRupee size={30} />
                                          <h2 className="">
                                            {order?.plan.price}.00
                                          </h2>
                                        </div>
                                      </div>

                                      <div className="text-neutral-300 flex flex-col gap-3">
                                        <div className="flex gap-2">
                                          <IoMdTime size={24} />
                                          <p>
                                            {order?.plan.deliveryTime}-day
                                            delivery
                                          </p>
                                        </div>
                                        <div className="flex gap-2">
                                          <BiRevision size={24} />
                                          <p>
                                            {order?.plan.revision} Revisions
                                          </p>
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
                                      <div className="w-full flex gap-x-3">
                                        <h2 className="text-md font-bold">
                                          Order Status :
                                        </h2>
                                        <Chip
                                          color="success"
                                          variant="bordered"
                                        >
                                          {order?.status}
                                        </Chip>
                                      </div>
                                      {/* <div className="w-full flex gap-x-3">
                                  <h2 className="text-md font-bold">Payment Status :</h2>
                                  <Chip color="default">{order?.paymentStatus}</Chip>
                                </div> */}
                                      {order?.status === "in progress" && (
                                        <>
                                          <div className="w-full flex gap-x-3">
                                            <h2 className="text-md font-bold">
                                              Dead Line :
                                            </h2>
                                            <Chip color="success">
                                              {formatDeadline(
                                                order?.deadline,
                                                "dd MMM yyyy hh:mm a"
                                              )}
                                            </Chip>
                                          </div>
                                          <div className="border-1 border-neutral-500 p-4 flex flex-col items-center rounded-lg">
                                            <div className="font-bold text-lg text-green-500">
                                              <CountdownTimer
                                                deadline={order?.deadline}
                                              />
                                            </div>
                                            <p className="text-neutral-300">
                                              If the work is not completed
                                              within this timeframe, payment
                                              will not be disbursed.
                                            </p>
                                          </div>
                                        </>
                                      )}
                                    </div>
                                    {order?.status === "in progress" && (
                                      <>
                                        <div className="w-full flex gap-3 p-5">
                                          <Input
                                            type="file"
                                            labelPlacement="outside"
                                            onChange={handleFileInputChange}
                                          />
                                          <Button
                                            onClick={() =>
                                              handleUpload(order._id)
                                            }
                                          >
                                            Upload
                                          </Button>
                                        </div>
                                        <div className="w-full flex flex-col items-center gap-3 p-5">
                                          {image && (
                                            <h2 className="font-bold">
                                              Preview
                                            </h2>
                                          )}
                                          <Image
                                            width={300}
                                            alt="NextUI hero Image"
                                            src={image}
                                          />
                                        </div>
                                      </>
                                    )}

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
                                            className="btn"
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
                            )
                        )}
                    </Accordion>
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
                    onClick={() => {
                      handleAcceptOrder();
                      onClose();
                    }}
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
                    onClick={() => {
                      handleRejectOrder();
                      onClose();
                    }}
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

const CountdownTimer = ({ deadline, onTimeUp ,orderId}) => {
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
      const newTimeLeft = calculateTimeLeft();
      setTimeLeft(newTimeLeft);

      if (Object.keys(newTimeLeft).length === 0 && onTimeUp) {
        onTimeUp(orderId);
      }
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
      {timerComponents.length ? timerComponents : <span>Time is up!</span>}
    </div>
  );
};
