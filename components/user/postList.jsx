'use client'
import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Image,
} from "@nextui-org/react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure} from "@nextui-org/react";

import { FaRegComment, FaRegBookmark, FaBookmark } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import axiosInstance from "./axiosConfig";
import CommentComponent from "../../components/user/commentComponent";
import { IoMdMore } from "react-icons/io";
import { BiLike, BiSolidLike } from "react-icons/bi";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@nextui-org/react";
import { useDispatch, useSelector } from "react-redux";
import { updateUser } from "@/redux/reducers/user";
import { updateAllPosts } from "@/redux/reducers/post";

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [likes, setLikes] = useState({});
  const user = useSelector((state) => state.user.currentUser);
  const saved = user?.saved.map((post) => post._id);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axiosInstance.get(
          "http://localhost:4000/get-all-posts"
        );
        if (res.status === 200) {
          const postsWithBookmarks = res.data.posts.map((post) => ({
            ...post,
            bookmarked: saved.includes(post._id),
            likedByUser: post.likes.includes(user._id)
          }));
          setPosts(postsWithBookmarks);
          initializeLikesState(postsWithBookmarks);
        } else {
          handleApiError("Error in fetching posts");
        }
      } catch (error) {
        handleApiError("Error in fetching posts");
      }
    };
    fetchPosts();
  }, []); 
  const initializeLikesState = (posts) => {
    const initialLikes = {};
    posts.forEach((post) => {
      initialLikes[post._id] = post.likedByUser;
    });
    setLikes(initialLikes);
  };

  const handleApiError = (errorMessage) => {
    console.error(errorMessage);
    toast.error(errorMessage);
  };

  const toggleBookmark = async (postId) => {
    try {
      const postIndex = posts.findIndex((post) => post._id === postId);
      const currentBookmarked = posts[postIndex].bookmarked;
      const newBookmarked = !currentBookmarked; // Toggle the bookmarked status

      // Update the state immediately to reflect UI changes
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId ? { ...post, bookmarked: newBookmarked } : post
        )
      );

      // Now, based on the current bookmarked status, either save or remove the post
      if (newBookmarked) {
        await axiosInstance.post("http://localhost:4000/save-Post", {
          userId: user._id,
          postId: postId,
        });
        toast.success("Post saved");
      } else {
        await axiosInstance.post("http://localhost:4000/remove-save-Post", {
          userId: user._id,
          postId: postId,
        });
        toast.success("Post removed from saved");
      }

      // Update the user object after saving or removing the post
      const res = await axiosInstance.get(
        `http://localhost:4000/user-details?email=${user.email}`
      );
      dispatch(updateUser(res.data.user));
    } catch (error) {
      console.error(error);
      toast.error("Error in saving or removing post");
    }
  };

  const toggleLike = async (postId) => {
    try {
      const postIndex = posts.findIndex((post) => post._id === postId);
      const currentLiked = likes[postId];
      const newLiked = !currentLiked; // Toggle the liked status

      setLikes((prevLikes) => ({
        ...prevLikes,
        [postId]: newLiked,
      }));

      if (newLiked) {
        await axiosInstance.post("http://localhost:4000/like-post", {
          userId: user._id,
          postId: postId,
        });
        toast.success("Post liked");
      } else {
        await axiosInstance.post("http://localhost:4000/unlike-post", {
          userId: user._id,
          postId: postId,
        });
        toast.success("Post unliked");
      }

      const updatedPosts = [...posts];
      updatedPosts[postIndex].likes = newLiked
        ? updatedPosts[postIndex].likes + 1
        : updatedPosts[postIndex].likes - 1;
      setPosts(updatedPosts);
    } catch (error) {
      console.error(error);
      toast.error("Error in liking or unliking post");
    }
  };

  const toggleCommentVisibility = (postId) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post._id === postId
          ? { ...post, showComments: !post.showComments }
          : post
      )
    );
  };

  return (
    <>
      {posts.map((post) => (
        <div
          key={post._id}
          className="w-full h-auto gap-x-5 flex justify-evenly items-center rounded-lg mb-10 shadow-lg"
        >
          <Card className="w-full bg-semi">
            <CardHeader className="flex justify-between">
              <div className="flex gap-3">
                {post.userId && (
                  <Image
                    alt="nextui logo"
                    height={40}
                    radius="sm"
                    src={post.userId.profileImg}
                    width={40}
                  />
                )}
                <div className="flex flex-col">
                  <p className="text-md">{post.userId?.username}</p>
                  <p className="text-small text-default-500">
                    {post.uploadedDate}
                  </p>
                </div>
              </div>
              <div>
                <Dropdown>
                  <DropdownTrigger>
                    <Button isIconOnly  className="" variant="">
                      <IoMdMore size={25} />
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu aria-label="Static Actions">
                    <DropdownItem key="new">Report post</DropdownItem>
                    <DropdownItem key="edit">Unfollow</DropdownItem>
                    <DropdownItem
                      key="delete"
                      className="text-danger"
                      color="danger"
                    >
                      Cancel{" "}
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </div>
            </CardHeader>
            <Divider />
            <CardBody className="flex items-center gap-y-5">
              <Image
                classNames="w-full flex items-center"
                alt="Card background"
                className="object-cover rounded-xl"
                src={post.images}
              />
              <div className="flex px-2 justify-between w-full">
                <div className="flex gap-x-5">
                  {likes[post._id] ? (
                    <BiSolidLike
                      onClick={() => toggleLike(post._id)}
                      size={25}
                    />
                  ) : (
                    <BiLike onClick={() => toggleLike(post._id)} size={25} />
                  )}
                  {post.likes.length}
                  <FaRegComment
                    className="cursor-pointer"
                    size={25}
                    onClick={() => toggleCommentVisibility(post._id)}
                  />
                </div>
                <div>
                  {post.bookmarked ? (
                    <FaBookmark
                      onClick={() => toggleBookmark(post._id)}
                      size={25}
                    />
                  ) : (
                    <FaRegBookmark
                      onClick={() => toggleBookmark(post._id)}
                      size={25}
                    />
                  )}
                </div>
              </div>
              <div className="w-full">
                <p className="px-3 flex items-start justify-start">
                  <span className="mr-5 font-semibold">
                    {post.userId?.username}{" "}
                  </span>
                  {post?.caption}
                </p>
              </div>
            </CardBody>
            <Divider />
            <CardFooter>
              {post.showComments && <CommentComponent postId={post._id} />}
            </CardFooter>
          </Card>
        </div>
      ))}
    </>
  );
};

export default PostList;
