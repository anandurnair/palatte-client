"use client";

import React, { useState, useEffect, useRef } from "react";
import ProtectedRoute from "../../user/ProtectedRoute";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { IoMdMore } from "react-icons/io";

import {
  Tabs,
  Tab,
  Card,
  CardBody,
  CardHeader,
  RadioGroup,
  Radio,
  Accordion,
  AccordionItem,
  Avatar,
  Button,
  Divider,
  Image,
  Textarea,
} from "@nextui-org/react";
import { Rating } from "primereact/rating";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Chip,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/react";
import { io } from "socket.io-client";

import { format } from "timeago.js";
import { useRadio, VisuallyHidden, cn } from "@nextui-org/react";
import { format as formatDeadline } from "date-fns";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";

import { MdCurrencyRupee } from "react-icons/md";
import { IoMdTime } from "react-icons/io";
import { BiRevision } from "react-icons/bi";
import axiosInstance from "../axiosConfig";
import { useDispatch, useSelector } from "react-redux";
import { loadStripe } from "@stripe/stripe-js";
import { current } from "@reduxjs/toolkit";
import { logout, updateUser } from "@/redux/reducers/user";

const HiredHistory = () => {
  const dispatch = useDispatch();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectedOption, setSelectedOption] = useState("wallet");
  const currentUser = useSelector((state) => state.user.currentUser);
  const [allOrders, setAllOrders] = useState([]);
  const [existingReview, setExistingReview] = useState(null);
  const [modal, setModal] = useState();
  const [selectedOrder, setSelectedOrder] = useState();
  const [update, setUpdate] = useState(false);
  const [value, setValue] = useState(0);
  const [review, setReview] = useState("");
  const [additional, setAdditional] = useState("");
  const [editReview, setEditReview] = useState();
  const [editRating, setEditRating] = useState();
  const socket = useRef(null);
  socket.current = io(process.env.NEXT_PUBLIC_API_URL);

  const stripePromise = loadStripe(
    "pk_test_51OMD9cSHHtMTvNEWFwltwJ7Ms44q8bgqFZSvmQRnBDsrDYUZi1hKe5AxS1qSyGYjAJzMeMfPCNnCdWevOrkaBpIH00ANhFQoJ7"
  );

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (currentUser.email) {
        try {
          const res = await axiosInstance.get(
            `http://localhost:4000/user-details?email=${currentUser.email}`
          );
          dispatch(updateUser(res.data.user));
        } catch (error) {
          dispatch(logout());
        }
      }
    };
    fetchUserDetails();
  }, [update,currentUser,dispatch]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axiosInstance.get(
          `/get-client-orders?userId=${currentUser._id}`
        );
        console.log("orders : ", res.data.orders);
        setAllOrders(res.data.orders);
      } catch (error) {
        toast.error(error.message);
      }
    };
    if (currentUser) {
      fetchData();
    }
  }, [currentUser, update]);

  const handleRevision = async () => {
    if (additional === "") {
      toast.error("fill form");
      return;
    }
    try {
      console.log("working");
      const res = await axiosInstance.post("/revise-work", {
        orderId: selectedOrder._id,
        additionalRequirements: additional,
      });

      setUpdate((prev) => !prev);
      toast.success(res.data.message);
    } catch (error) {
      alert(error);
      toast.error(error);
    }
  };

  const getTimeAgo = (date) => {
    return format(new Date(date));
  };

  const handleChoosePayment = async () => {
    if (selectedOption === "wallet") {
      setModal("walletPayment");
    } else {
      const data = {
        orderId: selectedOrder?._id,
        clientId: currentUser?._id,
        freelancerId: selectedOrder?.freelancer,
        amount: selectedOrder?.plan?.price,
      };
      try {
        const res = await axiosInstance.post(
          "/service-payment-by-stripe",
          data
        );
        const stripe = await stripePromise;
        const { error } = await stripe.redirectToCheckout({
          sessionId: res.data.id,
        });
        setUpdate((prev) => !prev);
        socket.current.emit("payment", currentUser, selectedOrder?.freelancer);
        toast.success(res.data.message);
      } catch (error) {
        toast.error(error.message);
      }
    }
    onOpen();
  };

  const handlePay = async () => {
    if (
      selectedOption === "wallet" &&
      currentUser?.wallet?.balance < selectedOrder?.plan?.price
    ) {
      toast.error("Insufficient balance");
      return;
    }
    const data = {
      orderId: selectedOrder?._id,
      clientId: currentUser?._id,
      freelancerId: selectedOrder?.freelancer,
      amount: selectedOrder?.plan?.price,
    };

    try {
      const res = await axiosInstance.post("/service-payment-by-wallet", data);
      setUpdate((prev) => !prev);
      console.log("Current user  :", selectedOrder.freelancer);
      socket.current.emit("payment", currentUser, selectedOrder?.freelancer);
      toast.success(res.data.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleApprove = async () => {
    try {
      const res = await axiosInstance.post("/approve-work", {
        orderId: selectedOrder._id,
      });
      setUpdate((prev) => !prev);
      socket.current.emit("approve", currentUser, selectedOrder?.freelancer);
      toast.success(res.data.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDownload = (imageUrl) => {
    if (typeof document === "undefined") return; 

    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = "art-image.jpg";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSubmitReview = async () => {
    console.log("rating : ", review, value);
    if (review == "" || value === 0) {
      toast.error("Fill the form");
      return;
    }

    try {
      const res = await axiosInstance.post("/add-review", {
        orderId: selectedOrder?._id,
        ratedUser: currentUser?._id,
        freelancerId: selectedOrder?.freelancer,
        serviceName: selectedOrder?.serviceName,
        review,
        rating: value,
      });
      toast.success(res.data.message);
      setUpdate((prev) => !prev);
      setReview("");
      setValue(0);
    } catch (error) {
      const errorMessage = error.response?.data?.message || "An error occurred";
      toast.error(errorMessage);
    }
  };

  const handleEditReview = async () => {
    try {
      const res = await axiosInstance.patch("/edit-review", {
        reviewId: selectedOrder?.reviewId._id,
        editRating,
        editReview,
      });
      toast.success(res.data.message);
      setEditRating(null);
      setEditReview(null);
      setUpdate((prev) => !prev);
    } catch (error) {
      toast.error(error);
    }
  };

  const handleDeleteReview = async () => {
    try {
      const res = await axiosInstance.delete(
        `/delete-review?reviewId=${selectedOrder?.reviewId._id}`
      );
      toast.success("Review deleted");
      setUpdate((prev) => !prev);
    } catch (error) {
      toast.error(error);
      alert(error);
    }
  };

  return (
    <ProtectedRoute>
      <div className="w-full h-full flex flex-col items-center rounded-lg px-20 my-5">
        <ToastContainer
          toastStyle={{ backgroundColor: "#1d2028" }}
          position="bottom-center"
        />
        <div className="w-full overflow-y-auto">
          <Tabs aria-label="Options" placement="top" className="w-full">
            <Tab key="latest-order" title="New hirings" className="w-full">
              <Card>
                <CardBody className="h-auto">
                  <div className="w-full h-full flex">
                    <Accordion variant="light" selectionMode="multiple">
                      {allOrders
                        .slice()
                        .reverse()
                        .map(
                          (order, index) =>
                            order.status !== "completed" && (
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
                                <div className="flex flex-col gap-y-5">
                                  <Card>
                                    <CardBody className="h-auto flex flex-col justify-between">
                                      <div className="w-full h-full flex flex-col p-5 gap-5">
                                        <div className="text-2xl flex justify-between text-neutral-300">
                                          <h2 className="font-bold">
                                            {order?.plan.name}
                                          </h2>
                                          <div className="flex">
                                            <MdCurrencyRupee size={30} />
                                            <h2>{order?.plan.price}.00</h2>
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
                                          <Chip color="default">
                                            {order?.status}
                                          </Chip>
                                        </div>
                                        {order?.status === "in progress" && (
                                          <div className="w-full flex gap-x-3">
                                            <h2 className="text-md font-bold">
                                              Deadline :
                                            </h2>
                                            <Chip color="success">
                                              {formatDeadline(
                                                order?.deadline,
                                                "dd MMM yyyy hh:mm a"
                                              )}
                                            </Chip>
                                          </div>
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
                                                Remaining Revisions :
                                              </h2>
                                              <Chip color="success">
                                                {order.remainingRevisions}
                                              </Chip>
                                            </div>
                                            <div className="w-full flex gap-x-3">
                                              <h2 className="text-md font-bold">
                                                Revision Deadline :
                                              </h2>
                                              <Chip color="success">
                                                {formatDeadline(
                                                  order?.deadline,
                                                  "dd MMM yyyy hh:mm a"
                                                )}
                                              </Chip>
                                            </div>
                                          </>
                                        )}
                                      </div>
                                      <div className="w-full flex justify-between gap-3 p-5">
                                        {order.status === "pending" && (
                                          <>
                                            <div></div>
                                            <Button
                                              color="danger"
                                              variant="bordered"
                                              onClick={() => {
                                                setModal("cancel");
                                                setSelectedOrder(order);
                                                onOpen();
                                              }}
                                            >
                                              Cancel Order
                                            </Button>
                                          </>
                                        )}
                                        {order.status === "accepted" && (
                                          <>
                                            <div>
                                              <h3 className="font-bold">
                                                Choose payment method :{" "}
                                                {selectedOption}
                                              </h3>
                                              <Button
                                                onClick={() => {
                                                  setModal("payment");
                                                  setSelectedOrder(order);
                                                  onOpen();
                                                }}
                                              >
                                                Choose
                                              </Button>
                                            </div>
                                            {currentUser?.wallet?.balance <
                                              selectedOrder?.plan?.price &&
                                            selectedOption == "wallet" ? (
                                              <Button
                                                color="primary"
                                                variant="bordered"
                                                isDisabled
                                              >
                                                Continue Payment
                                              </Button>
                                            ) : (
                                              <Button
                                                color="primary"
                                                variant="bordered"
                                                onClick={() => {
                                                  setSelectedOrder(order);
                                                  handleChoosePayment();
                                                }}
                                              >
                                                Continue Payment
                                              </Button>
                                            )}
                                          </>
                                        )}
                                      </div>
                                    </CardBody>
                                  </Card>
                                  {(order.status === "waiting for approval" ||
                                    order.status === "completed") && (
                                    <Card>
                                      <CardBody className="h-auto">
                                        <div className="flex flex-col items-center py-5 gap-5">
                                          <h2 className="text-lg">Work</h2>
                                          <Image
                                            width={500}
                                            alt="image"
                                            src={order?.workId?.image}
                                          />
                                          {order.status ===
                                            "waiting for approval" && (
                                            <div className="flex gap-4">
                                              {order.remainingRevisions ===
                                              0 ? (
                                                <Button
                                                  variant="bordered"
                                                  color="warning"
                                                  isDisabled
                                                >
                                                  Revision (no revision left)
                                                </Button>
                                              ) : (
                                                <Button
                                                  variant="bordered"
                                                  color="warning"
                                                  onClick={() => {
                                                    setSelectedOrder(order);
                                                    setModal("revision");
                                                    onOpen();
                                                  }}
                                                >
                                                  Revision{" "}
                                                  {`(${order?.remainingRevisions} left)`}
                                                </Button>
                                              )}

                                              <Button
                                                variant="bordered"
                                                color="success"
                                                onClick={() => {
                                                  setSelectedOrder(order);
                                                  setModal("approve");
                                                  onOpen();
                                                }}
                                              >
                                                Approve
                                              </Button>
                                            </div>
                                          )}
                                          {order.status === "completed" && (
                                            <Button
                                              variant="bordered"
                                              color="success"
                                              onClick={() =>
                                                handleDownload(
                                                  order?.workId?.image
                                                )
                                              }
                                            >
                                              Download
                                            </Button>
                                          )}
                                        </div>
                                      </CardBody>
                                    </Card>
                                  )}
                                </div>
                              </AccordionItem>
                            )
                        )}
                    </Accordion>
                  </div>
                </CardBody>
              </Card>
            </Tab>
            <Tab key="order-history" title="Hired history">
              <Card>
                <CardBody className="h-auto">
                  <div className="w-full h-full flex">
                    <Accordion variant="light" selectionMode="multiple">
                      {allOrders
                        .slice()
                        .reverse()
                        .map(
                          (order, index) =>
                            order.status == "completed" && (
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
                                <div className="flex flex-col gap-y-5">
                                  <Card>
                                    <CardBody className="h-auto flex flex-col justify-between">
                                      <div className="w-full h-full flex flex-col p-5 gap-5">
                                        <div className="text-2xl flex justify-between text-neutral-300">
                                          <h2 className="font-bold">
                                            {order?.plan.name}
                                          </h2>
                                          <div className="flex">
                                            <MdCurrencyRupee size={30} />
                                            <h2>{order?.plan.price}.00</h2>
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
                                          <Chip color="default">
                                            {order?.status}
                                          </Chip>
                                        </div>
                                        {order?.status === "in progress" && (
                                          <div className="w-full flex gap-x-3">
                                            <h2 className="text-md font-bold">
                                              Deadline :
                                            </h2>
                                            <Chip color="success">
                                              {formatDeadline(
                                                order?.deadline,
                                                "dd MMM yyyy hh:mm a"
                                              )}
                                            </Chip>
                                          </div>
                                        )}
                                      </div>
                                      <Divider className="my-4" />

                                      <div className="w-full flex justify-center gap-3 py-5">
                                        {order.reviewId ? (
                                          <div className="w-full h-auto px-10 py flex flex-col justify-center ">
                                            <h2 className="text-2xl font-bold">
                                              Your Review
                                            </h2>
                                            <div className="w-full py-5  flex justify-between"></div>
                                            <div className="w-full flex flex-col gap-y-4">
                                              <Card className="w-full p-2">
                                                <CardHeader className="justify-between">
                                                  <div className="flex gap-5">
                                                    <Avatar
                                                      isBordered
                                                      radius="full"
                                                      size="md"
                                                      src={
                                                        currentUser?.profileImg
                                                      }
                                                    />
                                                    <div className="flex flex-col gap-1 items-start justify-center">
                                                      <h4 className="text-small font-semibold leading-none text-default-600">
                                                        {currentUser?.fullname}
                                                      </h4>
                                                      <h5 className="text-small tracking-tight text-default-400">
                                                        @{currentUser?.username}
                                                      </h5>
                                                    </div>
                                                  </div>
                                                  <Dropdown>
                                                    <DropdownTrigger>
                                                      <Button
                                                        variant=""
                                                        isIconOnly
                                                      >
                                                        <IoMdMore size={25} />
                                                      </Button>
                                                    </DropdownTrigger>
                                                    <DropdownMenu aria-label="Static Actions">
                                                      <DropdownItem
                                                        key="new"
                                                        onClick={() => {
                                                          setEditReview(
                                                            order?.reviewId
                                                              .review
                                                          );
                                                          setEditRating(
                                                            order?.reviewId
                                                              .rating
                                                          );
                                                          setModal(
                                                            "edit-review"
                                                          );
                                                          setSelectedOrder(
                                                            order
                                                          );
                                                          onOpen();
                                                        }}
                                                      >
                                                        Edit
                                                      </DropdownItem>

                                                      <DropdownItem
                                                        key="delete"
                                                        className="text-danger"
                                                        color="danger"
                                                        onClick={() => {
                                                          setModal(
                                                            "delete-review"
                                                          );
                                                          setSelectedOrder(
                                                            order
                                                          );
                                                          onOpen();
                                                        }}
                                                      >
                                                        Delete
                                                      </DropdownItem>
                                                    </DropdownMenu>
                                                  </Dropdown>
                                                </CardHeader>
                                                <CardBody className="px-3 py-0 text-smallflex flex-col gap-y-3 text-default-400">
                                                  <div className="flex gap-5">
                                                    <Rating
                                                      value={
                                                        order?.reviewId.rating
                                                      }
                                                      className="flex gap-3 text-teal-500 "
                                                      disabled
                                                      size={50}
                                                      cancel={false}
                                                    />
                                                    <p className="text-teal-500">
                                                      {order?.reviewId.rating}.0
                                                    </p>
                                                  </div>
                                                  <p>{order.reviewId.review}</p>
                                                  <span className="pt-2"></span>
                                                </CardBody>
                                              </Card>
                                            </div>
                                          </div>
                                        ) : (
                                          <>
                                            <Button
                                              className="w-1/3 font-bold"
                                              color="primary"
                                              variant="bordered"
                                              onClick={() => {
                                                setModal("review");
                                                setSelectedOrder(order);
                                                onOpen();
                                              }}
                                            >
                                              Write a review
                                            </Button>
                                          </>
                                        )}

                                        {order.status === "accepted" && (
                                          <>
                                            <div>
                                              <h3 className="font-bold">
                                                Choose payment method :{" "}
                                                {selectedOption}
                                              </h3>
                                              <Button
                                                onClick={() => {
                                                  setModal("payment");
                                                  setSelectedOrder(order);
                                                  onOpen();
                                                }}
                                              >
                                                Choose
                                              </Button>
                                            </div>
                                            <Button
                                              color="primary"
                                              variant="bordered"
                                              onClick={handleChoosePayment}
                                            >
                                              Continue Payment
                                            </Button>
                                          </>
                                        )}
                                      </div>
                                    </CardBody>
                                  </Card>
                                  {(order.status === "waiting for approval" ||
                                    order.status === "completed") && (
                                    <Card>
                                      <CardBody className="h-auto">
                                        <div className="flex flex-col items-center py-5 gap-5">
                                          <h2 className="text-lg">Work</h2>
                                          <Image
                                            width={500}
                                            alt="image"
                                            src={order?.workId?.image}
                                          />
                                          {order.status ===
                                            "waiting for approval" && (
                                            <div className="flex gap-4">
                                              <Button
                                                variant="bordered"
                                                color="warning"
                                              >
                                                Revision
                                              </Button>
                                              <Button
                                                variant="bordered"
                                                color="success"
                                                onClick={() => {
                                                  console.log("working");
                                                  setSelectedOrder(order);
                                                  setModal("approve");
                                                  onOpen();
                                                }}
                                              >
                                                Approve
                                              </Button>
                                            </div>
                                          )}
                                          {order.status === "completed" && (
                                            <Button
                                              variant="bordered"
                                              color="success"
                                              onClick={() =>
                                                handleDownload(
                                                  order?.workId?.image
                                                )
                                              }
                                            >
                                              Download
                                            </Button>
                                          )}
                                        </div>
                                      </CardBody>
                                    </Card>
                                  )}
                                </div>
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
        {modal === "payment" && (
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  Choose Payment
                </ModalHeader>
                <ModalBody>
                  <RadioGroup
                    label="Select a payment"
                    value={selectedOption}
                    onValueChange={setSelectedOption}
                  >
                    <CustomRadio
                      description={`Balance Rs.${currentUser?.wallet?.balance}.00 `}
                      value="wallet"
                    >
                      <p>Wallet</p>
                      {currentUser?.wallet?.balance <
                      selectedOrder?.plan?.price ? (
                        <p className="text-red-600 text-xs">
                          Insufficient balance
                        </p>
                      ) : (
                        ""
                      )}
                    </CustomRadio>
                    <CustomRadio value="stripe">Stripe</CustomRadio>
                  </RadioGroup>
                </ModalBody>
                <ModalFooter>
                  <Button
                    color="danger"
                    variant="light"
                    onPress={() => {
                      onClose();
                      setModal(""); // Clear modal state
                    }}
                  >
                    Close
                  </Button>
                  {currentUser?.wallet?.balance < selectedOrder?.plan?.price &&
                  selectedOption == "wallet" ? (
                    <Button variant="bordered" isDisabled onPress={onClose}>
                      Ok
                    </Button>
                  ) : (
                    <Button variant="bordered" onPress={onClose}>
                      Ok
                    </Button>
                  )}
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
                  <Button
                    color="danger"
                    variant="light"
                    onPress={() => {
                      onClose();
                      setModal(""); // Clear modal state
                    }}
                  >
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
        {modal === "delete-review" && (
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  Delete review
                </ModalHeader>
                <ModalBody>
                  <h2>Are you sure you want to celete this review?</h2>
                </ModalBody>
                <ModalFooter>
                  <Button
                    color="danger"
                    variant="light"
                    onPress={() => {
                      onClose();
                      setModal(""); // Clear modal state
                    }}
                  >
                    Close
                  </Button>
                  <Button
                    variant="bordered"
                    onPress={onClose}
                    onClick={handleDeleteReview}
                  >
                    Confirm
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        )}
        {modal === "review" && (
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  Review and rating
                </ModalHeader>
                <ModalBody>
                  <div className="flex gap-4">
                    <h2>Give a rate : </h2>
                    <Rating
                      value={value}
                      className="flex gap-3 text-teal-500 "
                      cancel={false}
                      onChange={(e) => setValue(e.value)}
                    />
                    <h2>{value}.0</h2>
                  </div>

                  <Textarea
                    label="Review"
                    labelPlacement="outside"
                    placeholder="Enter your review"
                    className="w-full"
                    onChange={(e) => setReview(e.target.value)}
                  />
                </ModalBody>
                <ModalFooter>
                  <Button
                    color="danger"
                    variant="light"
                    onPress={() => {
                      onClose();
                      setModal(""); // Clear modal state
                    }}
                  >
                    Close
                  </Button>
                  <Button
                    variant="bordered"
                    onPress={onClose}
                    onClick={handleSubmitReview}
                  >
                    Confirm
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        )}
        {modal === "edit-review" && (
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  Edit review
                </ModalHeader>
                <ModalBody>
                  <div className="flex gap-4">
                    <h2>Give a rate : </h2>
                    <Rating
                      value={editRating}
                      className="flex gap-3 text-teal-500 "
                      cancel={false}
                      onChange={(e) => setEditRating(e.value)}
                    />
                    <h2>{editRating}.0</h2>
                  </div>

                  <Textarea
                    label="Review"
                    value={editReview}
                    labelPlacement="outside"
                    placeholder="Enter your review"
                    className="w-full"
                    onChange={(e) => setEditReview(e.target.value)}
                  />
                </ModalBody>
                <ModalFooter>
                  <Button
                    color="danger"
                    variant="light"
                    onPress={() => {
                      onClose();
                      setModal(""); // Clear modal state
                    }}
                  >
                    Close
                  </Button>
                  <Button
                    variant="bordered"
                    onPress={onClose}
                    onClick={handleEditReview}
                  >
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
                        <h2 className="text-md font-semibold">Wallet</h2>
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
                        <h2 className="text-md font-semibold">Total</h2>
                        <div className="w-full flex justify-between text-neutral-400">
                          <h2>Amount </h2>
                          <h2>Rs {selectedOrder?.plan?.price}.00</h2>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                </ModalBody>
                <ModalFooter>
                  <Button
                    color="danger"
                    variant="light"
                    onPress={() => {
                      onClose();
                      setModal(""); // Clear modal state
                    }}
                  >
                    Close
                  </Button>
                  <Button
                    color="primary"
                    variant="bordered"
                    onPress={onClose}
                    onClick={handlePay}
                  >
                    Pay
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        )}
        {modal === "approve" && (
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  Approve work
                </ModalHeader>
                <ModalBody>
                  <h2>Are you sure you want to approve?</h2>
                </ModalBody>
                <ModalFooter>
                  <Button
                    color="danger"
                    variant="light"
                    onPress={() => {
                      onClose();
                      setModal(""); // Clear modal state
                    }}
                  >
                    Close
                  </Button>
                  <Button
                    variant="bordered"
                    onPress={() => {
                      onClose();
                      handleApprove();
                    }}
                  >
                    Approve
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        )}
        {modal === "revision" && (
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  Confirm revision
                </ModalHeader>
                <ModalBody>
                  <div>
                    <Textarea
                      variant="bordered"
                      label="Additional Requirements"
                      labelPlacement="outside"
                      placeholder="Enter your requirements"
                      className="col-span-12 md:col-span-6 mb-6 md:mb-0"
                      onChange={(e) => setAdditional(e.target.value)}
                    />
                  </div>
                </ModalBody>
                <ModalFooter>
                  <Button
                    color="danger"
                    variant="light"
                    onPress={() => {
                      onClose();
                      setModal(""); // Clear modal state
                    }}
                  >
                    Close
                  </Button>
                  <Button
                    variant="bordered"
                    onPress={() => {
                      onClose();

                      handleRevision();
                    }}
                  >
                    Approve
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
