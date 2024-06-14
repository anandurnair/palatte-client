"use client";
import React, { useEffect, useState } from "react";
import ProtectedRoute from "../../components/user/ProtectedRoute";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { RadioGroup, Input, Radio, cn } from "@nextui-org/react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Avatar,
} from "@nextui-org/react";
import { Rating } from "primereact/rating";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import SelectServiceModal from "./userModals/selectServiceModal";
import axiosInstance from "./axiosConfig";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { Select, SelectItem } from "@nextui-org/react";

const SelectFreelancerComponent = () => {
  const router = useRouter();
  const currentUser = useSelector((state) => state.user.currentUser);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [modal, setModal] = useState();
  const [services, setServices] = useState([]);
  const [freelancers, setFreelancers] = useState([]);
  const [sortedFreelancers, setSortedFreelancers] = useState([]);
  const [isFollowed, setIsFollowed] = React.useState(false);
  const [serviceName, setServiceName] = useState();
  const [username, setUsername] = useState();
  const [sort, setSort] = useState(new Set(["highToLow"]));

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await axiosInstance.get(
          "http://localhost:4000/getServices"
        );

        setServices(res.data.services);
      } catch (error) {
        toast.error(error.message);
      }
    };
    fetchServices();
    setModal("select");
    onOpen();
  }, []);

  useEffect(() => {
    if (serviceName) {
      handleSearch();
    }
  }, [serviceName]);

  useEffect(() => {
    sortFreelancers();
  }, [sort, freelancers]);

  const sortFreelancers = () => {
    const sorted = [...freelancers].sort((a, b) => {
      if (sort.has("highToLow")) {
        return b.avgRating - a.avgRating;
      } else if (sort.has("lowToHigh")) {
        return a.avgRating - b.avgRating;
      }
      return 0;
    });
    setSortedFreelancers(sorted);
  };

  const handleSearch = async () => {
    try {
      const res = await axiosInstance.get(
        `/getUsersByServiceAndUsername?serviceName=${serviceName}&userName=${username}`
      );
      setFreelancers(res.data.freelancers ?? []);
      setSortedFreelancers(res.data.freelancers ?? []);
    } catch (error) {
      console.log(error);
      toast.error("Error in searching");
    }
  };

  return (
    <ProtectedRoute>
      <ToastContainer
        toastStyle={{ backgroundColor: "#20222b", color: "#fff" }}
        position="bottom-right"
      />
      <div className="w-full h-full flex flex-col items-center rounded-lg mb-5 gap-y-5 mr-4">
        <>
          <div className="w-full h-auto bg-semi py-2 px-4 rounded-lg flex border-2 border-neutral-800 justify-between items-center">
            <h2>
              Selected service : {serviceName ?? "No services selected"}
            </h2>
            <div className="flex gap-3">
              <Input
                radius="full"
                type="text"
                placeholder="Search user"
                className="w-full"
                variant="bordered"
                onChange={(e) => setUsername(e.target.value)}
              />
              <Button
                radius="full"
                className="btn"
                variant="bordered"
                onClick={handleSearch}
              >
                search
              </Button>
            </div>

            <Button className="btn border-1 bg-semi" onPress={onOpen}>
              Select a service
            </Button>
          </div>
          <div className="w-full h-auto py-2 px-4 rounded-lg flex gap-2">
            <Select
              label="Sort by rating"
              className="w-40"
              size="sm"
              selectedKeys={sort}
              onSelectionChange={setSort}
            >
              <SelectItem key={"highToLow"}>High to low</SelectItem>
              <SelectItem key={"lowToHigh"}>Low to high</SelectItem>
            </Select>
          </div>
          <div className="w-full h-auto py-2 px-4 rounded-lg flex gap-2">
            {sortedFreelancers.length === 0 && (
              <p className="text-center">No freelancers found</p>
            )}
            {sortedFreelancers.map((freelance) => (
              <Card className="min-w-[340px] p-3" key={freelance._id}>
                <CardHeader
                  className="justify-between cursor-pointer"
                  onClick={() => {
                    router.push(
                      `/serviceDetails?userId=${freelance._id}&&service=${serviceName}`
                    );
                  }}
                >
                  <div className="flex gap-5">
                    <Avatar
                      isBordered
                      radius="full"
                      size="md"
                      src={freelance.profileImg}
                    />
                    <div className="flex flex-col gap-1 items-start justify-center">
                      <h4 className="text-small font-semibold leading-none text-default-600">
                        {freelance.fullname}
                      </h4>
                      <h5 className="text-small tracking-tight text-default-400">
                        @{freelance.username}
                      </h5>
                    </div>
                  </div>
                  {currentUser._id !== freelance._id && (
                    <Button
                      className={
                        isFollowed
                          ? "bg-transparent text-foreground border-default-200"
                          : ""
                      }
                      color="primary"
                      radius="full"
                      size="sm"
                      variant={"bordered"}
                      onClick={() => {
                        router.push(
                          `/serviceDetails?userId=${freelance._id}&&service=${serviceName}`
                        );
                      }}
                    >
                      Hire
                    </Button>
                  )}
                </CardHeader>
                <CardBody className="px-3 py-0 text-small text-default-400">
                  <p>{freelance.bio}</p>
                  <span className="pt-2"></span>
                </CardBody>
                <CardFooter className="gap-3">
                  <div className="flex gap-1">
                    <Rating
                      value={freelance.avgRating}
                      className="flex gap-3 text-teal-500"
                      disabled
                      size={50}
                      cancel={false}
                    />
                    <p>({freelance.avgRating})</p>
                  </div>
                  <div className="flex gap-1">
                    <p className="font-semibold text-default-400 text-small">
                      Reviews
                    </p>
                    <p className="text-default-400 text-small">
                      {freelance.reviews}
                    </p>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
          <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
            {modal === "select" && (
              <SelectServiceModal
                services={services}
                setFreelancers={setFreelancers}
                serviceName={serviceName}
                setServiceName={setServiceName}
              />
            )}
          </Modal>
        </>
      </div>
    </ProtectedRoute>
  );
};

export default SelectFreelancerComponent;

const confirmModal = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Confirm Hire
            </ModalHeader>
            <ModalBody>
              <h2>Are you sure you want to hire?</h2>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Close
              </Button>
              <Button color="primary" onClick={handleConfirm} onPress={onClose}>
                Confirm
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </>
  );
};
