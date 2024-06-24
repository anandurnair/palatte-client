"use client";
import React, { useEffect, useRef, useState } from "react";
import { Tabs, Tab, Divider } from "@nextui-org/react";
import { useParams, useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import axiosInstance from "../axiosConfig";
import { Rating } from "primereact/rating";
import { MdCurrencyRupee } from "react-icons/md";
import { IoMdTime } from "react-icons/io";
import { BiRevision } from "react-icons/bi";
import { ToastContainer, toast } from "react-toastify";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Textarea,
} from "@nextui-org/react";
import { Select, SelectItem, Input } from "@nextui-org/react";

import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Checkbox,
  Avatar,
  Button,
} from "@nextui-org/react";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";

const FreelanceDetailsComponent = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [serviceDetails, setServiceDetails] = useState();
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");
  const serviceName = searchParams.get("service");
  const [value, setValue] = useState(3);
  const [user, setUser] = useState();
  const currentUser = useSelector((state) => state.user.currentUser);
  const [modal, setModal] = useState();
  const [selectedPlan, setSelectedPlan] = useState();
  const [requirements, setRequirements] = useState("");
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const socket = useRef(null);
  const [update,setUpdate] = useState(false)
  socket.current = io(process.env.NEXT_PUBLIC_SOCKET_URI);

  const handleSelectPlan = (plan) => {
    setModal("order");
    setSelectedPlan(plan);
  };
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axiosInstance.get(
          `/get-review-list?freelancerId=${userId}&&serviceName=${serviceName}`
        );
        const totalReviews = res.data.serviceReviews.length;
        const sumOfRatings = res.data.serviceReviews.reduce(
          (sum, review) => sum + review.rating,
          0
        );
        const average = totalReviews > 0 ? sumOfRatings / totalReviews : 0;
        setAverageRating(average.toFixed(1));
        setReviews(res.data.serviceReviews);
      } catch (error) {
        toast.error(error);
      }
    };
    fetchReviews();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axiosInstance.get(
          `/get-freelance-service-details?userId=${userId}&&serviceName=${serviceName}`
        );
        setServiceDetails(res.data.service);
      } catch (error) {
        alert(error);
      }
    };
    fetchData();
  }, [userId, serviceName,update]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await axiosInstance.get(`/getUserById?userId=${userId}`);
        if (res.status === 200) {
          setUser(res.data.user);
        }
      } catch (error) {
        toast.error(error);
      }
    };
    fetchUserData();
  }, [userId]);

  const hanldeSendOrder = async () => {
    if (requirements.trim() === "") {
      toast.error("Enter requirements");
      return;
    }
    try {
      const res = await axiosInstance.post("/post-order", {
        freelancer: userId,
        client: currentUser._id,
        requirements,
        plan: selectedPlan,
        serviceName,
      });
      console.log("currentUser : ", currentUser, " user ; ", user);
      socket.current.emit("order", currentUser, user);
      toast.success(res.data.message);
    } catch (error) {
      toast.error("Error in sending order ");
    }
  };
  const capitalizeFirstLetter = (string) => {
    if (!string) return "";
    return string.charAt(0).toUpperCase() + string.slice(1);
  };
  return (
    <div className="w-full h-full flex items-center rounded-lg px-5 my-5 gap-x-4">
      <ToastContainer
        toastStyle={{ backgroundColor: "#20222b", color: "#fff" }}
        position="bottom-right"
      />
      <div className="w-4/6 h-full  rounded-lg  z-10 shadow-2xl flex flex-col gap-y-2 ">
        <div className="w-full h-auto">
          <Card className="w-full px-5 py-2">
            <CardHeader className="justify-between">
              <div className="flex gap-5">
                <Avatar
                  isBordered
                  radius="full"
                  size="lg"
                  src={user?.profileImg}
                />
                <div className="flex flex-col gap-1 items-start justify-center">
                  <h4 className="text-small font-semibold leading-none text-default-600">
                    {user?.fullname}
                  </h4>
                  <h5 className="text-small tracking-tight text-default-400">
                    @{user?.username}
                  </h5>
                </div>
              </div>
              <div className="flex gap-3">
                {currentUser?._id === userId ? (
                  <>
                    <Button
                      // className={isFollowed ? "bg-transparent text-foreground border-default-200" : ""}
                      color="primary"
                      radius="full"
                      size="sm"
                      variant="bordered"
                      onClick={() => {
                        setModal("edit");
                        onOpen();
                      }}
                    >
                      Edit service
                    </Button>
                    <Button
                      // className={isFollowed ? "bg-transparent text-foreground border-default-200" : ""}
                      color="primary"
                      radius="full"
                      size="sm"
                      variant="bordered"
                      onClick={() => {
                        setModal("remove");
                        onOpen();
                      }}
                    >
                      Remove
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      // className={isFollowed ? "bg-transparent text-foreground border-default-200" : ""}
                      color="primary"
                      radius="full"
                      size="sm"
                      variant="bordered"
                    >
                      Message
                    </Button>
                    <Button
                      // className={isFollowed ? "bg-transparent text-foreground border-default-200" : ""}
                      color="primary"
                      radius="full"
                      size="sm"
                      variant="bordered"
                      onClick={() =>
                        router.push(`/userProfile?userId=${user._id}`)
                      }
                    >
                      See works
                    </Button>
                  </>
                )}
              </div>
            </CardHeader>
          </Card>
        </div>

        <div className="w-full overflow-auto">
          <div className="w-full h-auto p-10 flex flex-col">
            <div className="h-auto w-full flex flex-col gap-y-5">
              <h2 className="text-2xl font-bold">{serviceDetails?.title}</h2>
              <h2 className="text-lg">{serviceDetails?.description}</h2>
            </div>
          </div>

          <div className="w-full h-auto px-10 py flex flex-col justify-center ">
            <h2 className="text-2xl font-bold">Reviews</h2>
            <div className="w-full py-5  flex justify-between">
              <h2>{reviews.length} reviews</h2>
              <div className="flex gap-5">
                <Rating
                  value={averageRating}
                  className="flex gap-3 text-teal-500 "
                  disabled
                  size={50}
                  cancel={false}
                />
                <p className="text-teal-500">{averageRating}</p>
              </div>
            </div>
            <div className="w-full flex flex-col gap-y-4 pb-10">
              {reviews.length === 0 ? (
                <h2>No reviews</h2>
              ) : (
                <>
                  {reviews
                    .slice()
                    .reverse()
                    .map((review) => (
                      <Card className="w-full p-2">
                        <CardHeader className="justify-between">
                          <div className="flex gap-5">
                            <Avatar
                              isBordered
                              radius="full"
                              size="md"
                              src={review.ratedUser.profileImg}
                            />
                            <div className="flex flex-col gap-1 items-start justify-center">
                              <h4 className="text-small font-semibold leading-none text-default-600">
                                {review.ratedUser.fullname}
                              </h4>
                              <h5 className="text-small tracking-tight text-default-400">
                                @{review.ratedUser.username}
                              </h5>
                            </div>
                          </div>
                        </CardHeader>
                        <CardBody className="px-3 py-0 text-smallflex flex-col gap-y-3 text-default-400">
                          <Rating
                            value={review.rating}
                            className="flex gap-3 "
                            disabled
                            size={50}
                            cancel={false}
                          />
                          <p>{review.review}</p>
                          <span className="pt-2"></span>
                        </CardBody>
                      </Card>
                    ))}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="w-2/6 h-full   rounded-lg  z-10 shadow-2xl flex items-center justify-center">
        <div className="flex h-full w-full gap-4 flex-col">
          <h2 className="text-neutral-400">Choose plan</h2>
          <Tabs aria-label="Options" placement="top">
            <Tab key="basic" title="Basic">
              <Card>
                <CardBody className="h-80 flex flex-col justify-between">
                  <div className="w-full h-full flex flex-col  p-5 gap-5 ">
                    <div className="text-2xl flex text-neutral-300 ">
                      <MdCurrencyRupee size={30} />
                      <h2 className="">{serviceDetails?.plans[0].price}.00</h2>
                    </div>
                    <div className="text-neutral-300">
                      <p className="font-bold">Details</p>
                    </div>

                    <div className="text-neutral-300 flex flex-col gap-3">
                      <div className="flex gap-2 ">
                        <IoMdTime size={24} />
                        <p>
                          {serviceDetails?.plans[0].deliveryTime}-day delivery
                        </p>
                      </div>
                      <div className="flex gap-2 ">
                        <BiRevision size={24} />
                        <p>{serviceDetails?.plans[0].revision} Revisions</p>
                      </div>
                    </div>
                  </div>
                  <div className="w-full flex justify-end p-5">
                    {currentUser?._id !== userId && (
                      <Button
                        variant="bordered"
                        className="w-full btn"
                        onPress={onOpen}
                        onClick={() =>
                          handleSelectPlan(serviceDetails?.plans[0])
                        }
                      >
                        Send order
                      </Button>
                    )}
                  </div>
                </CardBody>
              </Card>
            </Tab>
            <Tab key="standard" title="Standard">
              <Card>
                <CardBody className="h-80 flex flex-col justify-between">
                  <div className="w-full h-full flex flex-col  p-5 gap-5 ">
                    <div className="text-2xl flex text-neutral-300 ">
                      <MdCurrencyRupee size={30} />
                      <h2 className="">{serviceDetails?.plans[1].price}.00</h2>
                    </div>
                    <div className="text-neutral-300">
                      <p className="font-bold">Details</p>
                    </div>

                    <div className="text-neutral-300 flex flex-col gap-3">
                      <div className="flex gap-2 ">
                        <IoMdTime size={24} />
                        <p>
                          {serviceDetails?.plans[1].deliveryTime}-day delivery
                        </p>
                      </div>
                      <div className="flex gap-2 ">
                        <BiRevision size={24} />
                        <p>{serviceDetails?.plans[1].revision} Revisions</p>
                      </div>
                    </div>
                  </div>
                  <div className="w-full flex justify-end p-5">
                    {currentUser?._id !== userId && (
                      <Button
                        variant="bordered"
                        className="w-full btn"
                        onPress={onOpen}
                        onClick={() =>
                          handleSelectPlan(serviceDetails?.plans[1])
                        }
                      >
                        Send order
                      </Button>
                    )}
                  </div>
                </CardBody>
              </Card>
            </Tab>
            <Tab key="premium" title="Premium">
              <Card>
                <CardBody className="h-80 flex flex-col justify-between">
                  <div className="w-full h-full flex flex-col  p-5 gap-5 ">
                    <div className="text-2xl flex text-neutral-300 ">
                      <MdCurrencyRupee size={30} />
                      <h2 className="">{serviceDetails?.plans[2].price}.00</h2>
                    </div>
                    <div className="text-neutral-300">
                      <p className="font-bold">Details</p>
                    </div>

                    <div className="text-neutral-300 flex flex-col gap-3">
                      <div className="flex gap-2 ">
                        <IoMdTime size={24} />
                        <p>
                          {serviceDetails?.plans[2].deliveryTime}-day delivery
                        </p>
                      </div>
                      <div className="flex gap-2 ">
                        <BiRevision size={24} />
                        <p>{serviceDetails?.plans[2].revision} Revisions</p>
                      </div>
                    </div>
                  </div>
                  <div className="w-full flex justify-end p-5">
                    {currentUser?._id !== userId && (
                      <Button
                        variant="bordered"
                        className="w-full btn"
                        onPress={onOpen}
                        onClick={() =>
                          handleSelectPlan(serviceDetails?.plans[2])
                        }
                      >
                        Send order
                      </Button>
                    )}
                  </div>
                </CardBody>
              </Card>
            </Tab>
          </Tabs>
        </div>
      </div>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        {modal == "order" && (
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  Send Order
                </ModalHeader>
                <ModalBody className="flex flex-col gap-y-6">
                  <Card>
                    <CardBody className="h-auto flex flex-col justify-between">
                      <div className="w-full h-full flex flex-col  p-5 gap-5 ">
                        <div className="text-2xl flex justify-between text-neutral-300 ">
                          <h2>{capitalizeFirstLetter(selectedPlan?.name)}</h2>
                          <div className="flex">
                            <MdCurrencyRupee size={30} />
                            <h2 className="">{selectedPlan?.price}</h2>
                          </div>
                        </div>
                        {/* <div className="text-neutral-300">
                        <p>
                          SILKY FLOW 3 LOGOS in JPG & PNG (transparent) + Vector
                          files + Logo Presentation - NO Mascots & Complex
                          design
                        </p>
                      </div> */}

                        <div className="text-neutral-300 flex flex-col gap-3">
                          <div className="flex gap-2 ">
                            <IoMdTime size={24} />
                            <p>{selectedPlan?.deliveryTime}-day delivery</p>
                          </div>
                          <div className="flex gap-2 ">
                            <BiRevision size={24} />
                            <p>{selectedPlan?.revision} Revisions</p>
                          </div>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                  <Textarea
                    isRequired
                    variant="bordered"
                    label="Requirements"
                    labelPlacement="outside"
                    placeholder="Enter your Requirements"
                    className="w-full"
                    onChange={(e) => setRequirements(e.target.value)}
                  />
                  {/* <Input
                    type="file"
                    label="Reference (optional)"
                    labelPlacement="outside"
                    placeholder=" "
                    variant="bordered"
                    className="w-full"
                    
                  /> */}
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="light" onPress={onClose}>
                    Cancel
                  </Button>
                  <Button
                    variant="bordered"
                    className="btn"
                    onClick={hanldeSendOrder}
                    onPress={onClose}
                  >
                    Send
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        )}

        {modal === "edit" && (
          <EditServiceModal serviceDetails={serviceDetails} setUpdate={setUpdate} />
        )}
        {modal == "remove" && (
          <RemoveServiceModal
            currentUser={currentUser}
            serviceName={serviceName}
          />
        )}
      </Modal>
    </div>
  );
};

export default FreelanceDetailsComponent;

const RemoveServiceModal = ({ currentUser, serviceName }) => {
  const router = useRouter();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const handleRemove = async () => {
    try {
      await axiosInstance.delete(
        `/remove-freelance-service?userId=${currentUser?._id}&&serviceName=${serviceName}`
      );
      toast.success("Service removed");
      router.back();
    } catch (error) {
      alert(error);
    }
  };
  return (
    <ModalContent>
      {(onClose) => (
        <>
          <ModalHeader className="flex flex-col gap-1">
            Confirm remove
          </ModalHeader>
          <ModalBody>
            <p>Are sure you want to remove the service ? </p>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={onClose}>
              Cancel
            </Button>
            <Button
              variant="bordered"
              className="btn"
              onPress={onClose}
              onClick={handleRemove}
            >
              Remove
            </Button>
          </ModalFooter>
        </>
      )}
    </ModalContent>
  );
};

const EditServiceModal = ({ serviceDetails,setUpdate }) => {
  console.log("Service details : ", serviceDetails);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [allServices, setAllServices] = useState([]);
  const [details, setDetails] = useState(serviceDetails);
  useEffect(() => {
    try {
      const fetchData = async () => {
        console.log("Effect working");
        const res = await axiosInstance.get("/getServices");
        setAllServices(res.data.services);
      };
      fetchData();
    } catch (error) {
      toast.error(error);
    }
  }, []);

  const handleEdit = async () => {
    try {
      console.log("Edited details : ", details);
      const res = await axiosInstance.post('/edit-freelance-sevice',{freelanceId : serviceDetails._id,details});
      setUpdate(prev =>!prev)
      toast.success(res.data.message)
    } catch (error) {
      alert(error);
    }
  };
  return (
    <ModalContent>
      {(onClose) => (
        <>
          <ModalHeader className="flex flex-col gap-1">
            Edit service
          </ModalHeader>
          <ModalBody>
            <div className="w-full px-3 flex flex-col  gap-y-4">
              <Input type="text" value={details.title} />
              <Textarea
                label="Description"
                variant="bordered"
                placeholder="Enter service description"
                disableAnimation
                disableAutosize
                classNames={{
                  base: "w-full",
                  input: "resize-y min-h-[50px]",
                }}
                value={details.description}
                onChange={(e) =>
                  setDetails({ ...details, description: e.target.value })
                }
              ></Textarea>
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
                              value={details.plans[0].price}
                              onChange={(e) => {
                                const updatedPlans = [...details.plans];
                                updatedPlans[0] = {
                                  ...updatedPlans[0],
                                  price: e.target.value,
                                };
                                setDetails({ ...details, plans: updatedPlans });
                              }}
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
                                value={details.plans[0].deliveryTime}
                                onChange={(e) => {
                                  const updatedPlans = [...details.plans];
                                  updatedPlans[0] = {
                                    ...updatedPlans[0],
                                    deliveryTime: e.target.value,
                                  };
                                  setDetails({
                                    ...details,
                                    plans: updatedPlans,
                                  });
                                }}
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
                                value={details.plans[0].revision}
                                onChange={(e) => {
                                  const updatedPlans = [...details.plans];
                                  updatedPlans[0] = {
                                    ...updatedPlans[0],
                                    revision: e.target.value,
                                  };
                                  setDetails({
                                    ...details,
                                    plans: updatedPlans,
                                  });
                                }}
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
                              value={details.plans[1].price}
                              onChange={(e) => {
                                const updatedPlans = [...details.plans];
                                updatedPlans[1] = {
                                  ...updatedPlans[1],
                                  price: e.target.value,
                                };
                                setDetails({ ...details, plans: updatedPlans });
                              }}
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
                                value={details.plans[1].deliveryTime}
                                onChange={(e) => {
                                  const updatedPlans = [...details.plans];
                                  updatedPlans[1] = {
                                    ...updatedPlans[1],
                                    deliveryTime: e.target.value,
                                  };
                                  setDetails({
                                    ...details,
                                    plans: updatedPlans,
                                  });
                                }}
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
                                value={details.plans[1].revision}
                                onChange={(e) => {
                                  const updatedPlans = [...details.plans];
                                  updatedPlans[1] = {
                                    ...updatedPlans[1],
                                    revision: e.target.value,
                                  };
                                  setDetails({
                                    ...details,
                                    plans: updatedPlans,
                                  });
                                }}
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
                  <Tab key="premium" title="Premium">
                    <Card>
                      <CardBody className="h-auto flex flex-col justify-between">
                        <div className="w-full h-full flex flex-col  p-2 gap-5 ">
                          <div className="text-2xl flex text-neutral-300 ">
                            <Input
                              type="number"
                              label="Price"
                              value={details.plans[2].price}
                              onChange={(e) => {
                                const updatedPlans = [...details.plans];
                                updatedPlans[2] = {
                                  ...updatedPlans[2],
                                  price: e.target.value,
                                };
                                setDetails({ ...details, plans: updatedPlans });
                              }}
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
                                value={details.plans[2].deliveryTime}
                                onChange={(e) => {
                                  const updatedPlans = [...details.plans];
                                  updatedPlans[2] = {
                                    ...updatedPlans[2],
                                    deliveryTime: e.target.value,
                                  };
                                  setDetails({
                                    ...details,
                                    plans: updatedPlans,
                                  });
                                }}
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
                                value={details.plans[2].revision}
                                onChange={(e) => {
                                  const updatedPlans = [...details.plans];
                                  updatedPlans[2] = {
                                    ...updatedPlans[2],
                                    revision: e.target.value,
                                  };
                                  setDetails({
                                    ...details,
                                    plans: updatedPlans,
                                  });
                                }}
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
            <Button variant="bordered" className="btn" onClick={handleEdit} onPress={onClose}>
              Edit
            </Button>
          </ModalFooter>
        </>
      )}
    </ModalContent>
  );
};
