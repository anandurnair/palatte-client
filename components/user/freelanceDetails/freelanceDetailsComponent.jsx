"use client";
import React, { useEffect, useState } from "react";
import { Tabs, Tab, Divider } from "@nextui-org/react";
import { useParams } from "next/navigation";
import { useSearchParams } from "next/navigation";
import axiosInstance from "../axiosConfig";
import { Rating } from "primereact/rating";

import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Avatar,
  Button,
} from "@nextui-org/react";

const FreelanceDetailsComponent = () => {
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");
  const serviceId = searchParams.get("service");
  const [value, setValue] = useState(3);
  const [user, setUser] = useState();
  const [serviceDetails, setServiceDetails] = useState();

  useEffect(() => {
    try {
      const fetchUserData = async () => {
        const res = await axiosInstance.get(
          `http://localhost:4000/getUserById?userId=${userId}`
        );
        if (res.status === 200) {
          const userDetails = res.data.user;
          console.log("Suer :", userDetails);
          setUser(userDetails);
        }
      };

      fetchUserData();
    } catch (error) {
      toast.error(error);
    }
  }, []);

  return (
    <div className="w-full h-full flex items-center rounded-lg px-5 my-5 gap-x-4">
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
                >
                  See works
                </Button>
              </div>
            </CardHeader>
          </Card>
        </div>

        <div className="w-full overflow-auto">
          <div className="w-full h-auto p-10 flex flex-col">
            <div className="h-auto w-full">
              <h2 className="text-lg">
                I will create 3 modern minimalist business logo design
              </h2>
            </div>
          </div>

          <div className="w-full h-auto px-10 py flex flex-col justify-center ">
            <h2 className="text-2xl font-bold">Reviews</h2>
            <div className="w-full py-5  flex justify-between">
              <h2>123 reviews</h2>
              <div className="flex gap-5">
                <Rating
                  value={value}
                  className="flex gap-3 "
                  disabled
                  size={50}
                  cancel={false}
                />{" "}
                <p>{value}.0</p>
              </div>
            </div>
            <div className="w-full flex flex-col gap-y-4">
              <Card className="w-full">
                <CardHeader className="justify-between">
                  <div className="flex gap-5">
                    <Avatar
                      isBordered
                      radius="full"
                      size="md"
                      src="https://nextui.org/avatars/avatar-1.png"
                    />
                    <div className="flex flex-col gap-1 items-start justify-center">
                      <h4 className="text-small font-semibold leading-none text-default-600">
                        Zoey Lang
                      </h4>
                      <h5 className="text-small tracking-tight text-default-400">
                        @zoeylang
                      </h5>
                    </div>
                  </div>
                </CardHeader>
                <CardBody className="px-3 py-0 text-small text-default-400">
                  <p>
                    Frontend developer and UI/UX enthusiast. Join me on this
                    coding adventure!
                  </p>
                  <span className="pt-2">
                    #FrontendWithZoey
                    <span className="py-2" aria-label="computer" role="img">
                      💻
                    </span>
                  </span>
                </CardBody>
                <CardFooter className="gap-3">
                  <div className="flex gap-1">
                    <p className="font-semibold text-default-400 text-small">
                      4
                    </p>
                    <p className=" text-default-400 text-small">Following</p>
                  </div>
                  <div className="flex gap-1">
                    <p className="font-semibold text-default-400 text-small">
                      97.1K
                    </p>
                    <p className="text-default-400 text-small">Followers</p>
                  </div>
                </CardFooter>
              </Card>
              
              
              
            </div>
          </div>
        </div>
      </div>

      <div className="w-2/6 h-full   rounded-lg  z-10 shadow-2xl flex items-center justify-center">
        <div className="flex h-full w-full flex-col">
          <Tabs aria-label="Options" placement="top">
            <Tab key="basic" title="Basic">
              <Card>
                <CardBody className="h-96">
                  <div className="w-full h-full flex items-center justify-center">
                    <h2 className="text-2xl text-neutral-600">Basic </h2>
                  </div>
                </CardBody>
              </Card>
            </Tab>
            <Tab key="standard" title="Standard">
              <Card>
                <CardBody className="h-96">
                  <div className="w-full h-full flex items-center justify-center">
                    <h2 className="text-2xl text-neutral-600">Standard</h2>
                  </div>
                </CardBody>
              </Card>
            </Tab>
            <Tab key="premium" title="Premium">
              <Card>
                <CardBody className="h-96">
                  <div className="w-full h-full flex items-center justify-center">
                    <h2 className="text-2xl text-neutral-600">Premium</h2>
                  </div>
                </CardBody>
              </Card>
            </Tab>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default FreelanceDetailsComponent;
