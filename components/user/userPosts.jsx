"use client";
import React, { useEffect, useState } from "react";
import axiosInstance from "./axiosConfig";
import { Tabs, Tab, CardHeader } from "@nextui-org/react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";

import { Card, CardBody, CardFooter, Image } from "@nextui-org/react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
const isVideo = (url) => {
  return /\.(mp4|webm|ogg)$/i.test(url);
};
const UserPosts = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const router = useRouter();
  const [posts, setPosts] = useState([]);
  const [selected, setSelected] = React.useState("myPosts");
  const user = useSelector((state) => state.user.currentUser);
  const [collections, setCollections] = useState([]);
  const [currentCollection, setCurrentCollection] = useState("");
  const [savedPosts, setSavedPosts] = useState([]);
  const handleCollection = (name) => {
    setCurrentCollection(name);
    console.log(name);
    const res = collections.filter((item) => item.name === name);
    console.log("collection posts", res[0].posts);
    setSavedPosts(res[0].posts);
  };

  useEffect(() => {
    fetchSavedPosts();
    fetchPosts();
  }, [user]);
  const fetchSavedPosts = async () => {
    try {
      console.log("saved psot fetching", user);
      const res = await axiosInstance.get(
        `http://localhost:4000/get-all-saved-posts?userId=${user?._id}`
      );
      if (res.status == 200) {
        console.log("posts:", res.data.savedPosts);
        setCollections(res.data.savedPosts);
      } else {
        console.log("Cannot fetch posts");
        alert(res.data.error);
      }
    } catch (error) {
      console.log(error);
      alert(error);
    }
  };
  const fetchPosts = async () => {
    try {
      if (user) {
        const res = await axiosInstance.get(
          `http://localhost:4000/get-user-posts?userId=${user?._id}`
        );
        if (res.status == 200) {
          console.log("posts:", res.data.posts);
          setPosts(res.data.posts);
        } else {
          console.log("Cannot fetch posts");
          alert(res.data.error);
        }
      }
    } catch (error) {
      console.log(error);
      alert(error);
    }
  };

  const handleClick = (postId) => {
    router.push(`/postDetails?postId=${postId}`);
  };

  return (
    <div
      id="myPosts"
      className="w-full  min-h-96 flex flex-col items-center rounded-lg "
    >
      <div className="w-4/5 h-full  mt-3 rounded-lg p- z-10 shadow-2xl">
        <Tabs
          aria-label="Options"
          selectedKey={selected}
          onSelectionChange={setSelected}
        >
          <Tab key="myPosts" title="My Posts">
            <Card>
              <CardBody>
                <div className="gap-2 grid grid-cols-2 sm:grid-cols-4">
                  <h1 className="col-span-full">
                    {posts.length === 0 ? "No Posts" : ""}
                  </h1>
                  {posts.map((item, index) => (
                    <>
                      <Card
                        key={index}
                        shadow="sm"
                        isPressable
                        className="justify-self-start"
                        onPress={() => handleClick(item._id)}
                      >
                        <CardBody className="overflow-visible p-0">
                          {isVideo(item.images) ? (
                            <video className="w-full h-full flex items-center object-cover rounded-xl">
                              <source src={item.images} type="video/mp4" />
                            </video>
                          ) : (
                            <Image
                              className="w-full flex items-center object-cover rounded-xl"
                              alt="Card background"
                              src={item.images}
                            />
                          )}
                        </CardBody>
                        {/* <CardFooter className="text-small justify-between">
            <b>{item.title}</b>
            <p className="text-default-500">{item.price}</p>
          </CardFooter> */}
                      </Card>
                    </>
                  ))}
                </div>
              </CardBody>
            </Card>
          </Tab>

          <Tab key="saved" title="Saved">
            <Card>
              <CardBody>
                <div className="w-full gap-x-6 grid grid-cols-2 sm:grid-cols-4">
                  <h1 className="col-span-full">
                    {collections && collections.length === 0
                      ? "No saved posts"
                      : ""}
                  </h1>
                  {currentCollection === "" &&
                    collections &&
                    collections.map((item, index) =>
                      item.posts.length !== 0 ? (
                        <Card
                          key={index}
                          shadow="lg"
                          isPressable
                          onPress={() => handleCollection(item.name)}
                          className="justify-self-start  bg-lightDark w-40 h-30"
                        >
                          <CardBody className="overflow-visible text-center font-bold">
                            <h2>{item.name}</h2>
                          </CardBody>
                        </Card>
                      ) : (
                        ""
                      )
                    )}
                </div>
                <div className="gap-2 grid grid-cols-2 sm:grid-cols-4">
                {currentCollection !== "" && (
                  <>
                    <div className="flex gap-x-5 ">
                      <p
                        className="underline cursor-pointer"
                        onClick={() => setCurrentCollection("")}
                      >
                        back
                      </p>
                      <h2>{currentCollection}</h2>
                    </div>

                    {savedPosts.map((item, index) => (
                      <>
                        <Card
                          key={index}
                          shadow="sm"
                          isPressable
                          className="justify-self-start"
                          onPress={() => handleClick(item._id)}
                        >
                          <CardBody className="overflow-visible p-0">
                            {isVideo(item.images) ? (
                              <video className="w-full h-full flex items-center object-cover rounded-xl">
                                <source src={item.images} type="video/mp4" />
                              </video>
                            ) : (
                              <Image
                                className="w-full flex items-center object-cover rounded-xl"
                                alt="Card background"
                                src={item.images}
                              />
                            )}
                          </CardBody>
                          {/* <CardFooter className="text-small justify-between">
<b>{item.title}</b>
<p className="text-default-500">{item.price}</p>
</CardFooter> */}
                        </Card>
                      </>
                    ))}
                  </>
                )}
                </div>
                
              </CardBody>
            </Card>
          </Tab>
          {/* <Tab key="videos" title="Videos">
              <Card>
                <CardBody>
                  Excepteur sint occaecat cupidatat non proident, sunt in culpa
                  qui officia deserunt mollit anim id est laborum.
                </CardBody>
              </Card>
            </Tab> */}
        </Tabs>
      </div>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Modal Title
              </ModalHeader>
              <ModalBody>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Nullam pulvinar risus non risus hendrerit venenatis.
                  Pellentesque sit amet hendrerit risus, sed porttitor quam.
                </p>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Nullam pulvinar risus non risus hendrerit venenatis.
                  Pellentesque sit amet hendrerit risus, sed porttitor quam.
                </p>
                <p>
                  Magna exercitation reprehenderit magna aute tempor cupidatat
                  consequat elit dolor adipisicing. Mollit dolor eiusmod sunt ex
                  incididunt cillum quis. Velit duis sit officia eiusmod Lorem
                  aliqua enim laboris do dolor eiusmod. Et mollit incididunt
                  nisi consectetur esse laborum eiusmod pariatur proident Lorem
                  eiusmod et. Culpa deserunt nostrud ad veniam.
                </p>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={onClose}>
                  Action
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default UserPosts;
