"use client";
import React, { useEffect, useState, useCallback } from "react";
import axiosInstance from "./axiosConfig";
import { Tabs, Tab, CardHeader } from "@nextui-org/react";

import { Card, CardBody, Image } from "@nextui-org/react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";

const isVideo = (url) => {
  return /\.(mp4|webm|ogg)$/i.test(url);
};

const UserPosts = () => {
  const router = useRouter();
  const [posts, setPosts] = useState([]);
  const [selected, setSelected] = useState("myPosts");
  const user = useSelector((state) => state.user.currentUser);
  const [collections, setCollections] = useState([]);
  const [currentCollection, setCurrentCollection] = useState("");
  const [savedPosts, setSavedPosts] = useState([]);

  const handleCollection = (name) => {
    setCurrentCollection(name);
    const res = collections.filter((item) => item.name === name);
    setSavedPosts(res[0].posts.reverse());
  };

  const fetchSavedPosts = useCallback(async () => {
    try {
      const res = await axiosInstance.get(
        `http://localhost:4000/get-all-saved-posts?userId=${user?._id}`
      );
      if (res.status === 200) {
        setCollections(res.data.savedPosts);
      } else {
        console.log("Cannot fetch posts");
        alert(res.data.error);
      }
    } catch (error) {
      console.log(error);
      alert(error);
    }
  }, [user]);

  const fetchPosts = useCallback(async () => {
    try {
      if (user) {
        const res = await axiosInstance.get(
          `http://localhost:4000/get-user-posts?userId=${user?._id}`
        );
        if (res.status === 200) {
          setPosts(res.data.posts);
        } else {
          console.log("Cannot fetch posts");
          console.log(res.data.error);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchSavedPosts();
      fetchPosts();
    }
  }, [user, fetchSavedPosts, fetchPosts]);

  const handleClick = (postId) => {
    router.push(`/postDetails?postId=${postId}`);
  };

  return (
    <div
      id="myPosts"
      className="w-full min-h-96 flex flex-col items-center rounded-lg px-4 md:px-0"
    >
      <div className="w-full md:w-4/5 h-full mt-3 rounded-lg p-4 md:p-10 z-10 shadow-2xl">
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
                            <source src={item.images[0]} type="video/mp4" />
                          </video>
                        ) : (
                          <Image
                            className="w-full flex items-center object-cover rounded-xl"
                            alt="Card background"
                            src={item.images[0]}
                          />
                        )}
                      </CardBody>
                    </Card>
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
                          className="justify-self-start bg-lightDark w-40 h-30"
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
                      <div className="flex gap-x-5 col-span-full">
                        <p
                          className="underline cursor-pointer"
                          onClick={() => setCurrentCollection("")}
                        >
                          back
                        </p>
                        <h2>{currentCollection}</h2>
                      </div>

                      {savedPosts.map((item, index) => (
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
                                <source src={item.images[0]} type="video/mp4" />
                              </video>
                            ) : (
                              <Image
                                className="w-full flex items-center object-cover rounded-xl"
                                alt="Card background"
                                src={item.images[0]}
                              />
                            )}
                          </CardBody>
                        </Card>
                      ))}
                    </>
                  )}
                </div>
              </CardBody>
            </Card>
          </Tab>
        </Tabs>
      </div>
     
    </div>
  );
};

export default UserPosts;
