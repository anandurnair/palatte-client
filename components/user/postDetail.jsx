"use client";
import React, { useEffect, useState } from "react";
import axiosInstance from "./axiosConfig";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CommentComponent from "../../components/user/commentComponent";
import { IoMdMore } from "react-icons/io";
import DeletePostModal from "./userModals/deletePostModal";
import EditPostModal from "../../components/user/userModals/editPostModal";
import SaveModal from "./userModals/savePostModal";
import ReportModal from "@/components/user/userModals/reportModal";

import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Image,
} from "@nextui-org/react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@nextui-org/react";
import { BiLike, BiSolidLike } from "react-icons/bi";
import { FaRegComment, FaRegBookmark, FaBookmark } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { Modal, useDisclosure } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { updateUser } from "@/redux/reducers/user";


const isVideo = (url) => {
  return /\.(mp4|webm|ogg)$/i.test(url);
};

const PostDetail = ({ postId }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const current = useSelector((state) => state.user.currentUser);
  const [currentUser,setCurrentUser] = useState(current)
  const dispatch = useDispatch();
  const [post, setPost] = useState(null);
  const [likes, setLikes] = useState(0);
  const [bookmarked, setBookmarked] = useState(false);
  const [isUser, setIsUser] = useState(false);
  const url = process.env.NEXT_PUBLIC_API_URL;
  const [modal, setModal] = useState("");
  const [update, setUpdate] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axiosInstance.get(
          `${url}/get-post-details?postId=${postId}`
        );
        if (res.status === 200) {
          const userId = res.data.post.userId._id;
          if (currentUser && currentUser._id === userId) {
            setIsUser(true);
          }
          setPost(res.data.post);
          setLikes(res.data.post.likes.length);
          // Check if the post is bookmarked by the current user
          setBookmarked(currentUser?.allSaved?.includes(postId));
        }
      } catch (error) {
        toast.error(error.message);
      }
    };
    fetchPost();
  }, [currentUser, postId, url, update]);

  const toggleLike = async () => {
    try {
      const newLikes = likes + (likes ? -1 : 1);
      setLikes(newLikes);

      await axiosInstance.post(`${url}/like-post?postId=${postId}`);
      toast.success(likes ? "Post unliked" : "Post liked");
    } catch (error) {
      console.error(error);
      toast.error("Error in liking or unliking post");
    }
  };

  const toggleBookmark = async () => {
    try {
      
      const newBookmarked = !bookmarked;
      newBookmarked ? setModal("save") : "";
      setBookmarked(!bookmarked)
      if (newBookmarked) {
        setModal("save");
        console.log("Save modal");
        onOpen();
      } else {
        try {
          await axiosInstance.post(`${url}/remove-save-post`, {
            userId: currentUser._id,
            postId: postId,
          });
          
            toast.success("Post removed from Saved");
          
        } catch (error) {
          toast.error(error);
        }
      }

      const res = await axiosInstance.get(
        `${url}/user-details?email=${currentUser.email}`
      );
      console.log("Saved user : ",res.data.user)
      dispatch(updateUser(res.data.user));
      setCurrentUser(res.data.user)
    } catch (error) {
      console.error(error);
      toast.error("Error saving or removing post. Please try again."); // More specific message
    }
  };

  const toggleCommentVisibility = () => {
    setPost((prevPost) => ({
      ...prevPost,
      showComments: !prevPost.showComments,
    }));
  };

  const handleModalOpen = (key) => {
    setModal(key);
    onOpen();
  };

  return (
    <div className="w-full overflow-y-scroll flex flex-col items-center rounded-lg my-5">
      <ToastContainer
        toastStyle={{ backgroundColor: "#20222b", color: "#fff" }}
        position="bottom-right"
      />
      <Card className="w-3/5 bg-semi mt-3 rounded-lg">
        <CardHeader className="flex justify-between">
          <div className="flex gap-3">
            {post && (
              <Image
                alt="nextui logo"
                height={40}
                radius="sm"
                src={post.userId.profileImg}
                width={40}
              />
            )}
            <div className="flex flex-col">
              <p className="text-md">{post?.userId?.username}</p>
              <p className="text-small text-default-500">
                {post?.uploadedDate}
              </p>
            </div>
          </div>
          <div>
            <Dropdown>
              <DropdownTrigger>
                <Button isIconOnly className="" variant="">
                  <IoMdMore size={25} />
                </Button>
              </DropdownTrigger>
              {isUser ? (
                <DropdownMenu aria-label="Static Actions">
                  <DropdownItem
                    key="edit"
                    onClick={() => handleModalOpen("edit")}
                  >
                    Edit post
                  </DropdownItem>
                  <DropdownItem
                    key="delete"
                    onClick={() => handleModalOpen("delete")}
                  >
                    Delete post
                  </DropdownItem>
                  <DropdownItem
                    key="cancel"
                    className="text-danger"
                    color="danger"
                  >
                    Cancel
                  </DropdownItem>
                </DropdownMenu>
              ) : (
                <DropdownMenu aria-label="Static Actions">
                  <DropdownItem
                    key="report"
                    onPress={() => handleModalOpen("report")}
                  >
                    Report post
                  </DropdownItem>
                  <DropdownItem
                    key="cancel"
                    className="text-danger"
                    color="danger"
                  >
                    Cancel
                  </DropdownItem>
                </DropdownMenu>
              )}
            </Dropdown>
          </div>
        </CardHeader>
        <Divider />
        <CardBody className="flex items-center gap-y-5">
        {isVideo(post?.images)?(
                <video   className="w-full h-full flex items-center object-cover rounded-xl"  controls>
                <source src={post?.images} type="video/mp4"/>
               </video>
              ):(
                <Image
                className="w-full flex items-center object-cover rounded-xl"
                alt="Card background"
                src={post?.images}
              />
              )}
          <div className="flex px-2 justify-between w-full">
            <div className="flex gap-x-5">
              {likes ? (
                <BiSolidLike onClick={toggleLike} size={25} />
              ) : (
                <BiLike onClick={toggleLike} size={25} />
              )}
              {likes}
              <FaRegComment
                className="cursor-pointer"
                size={25}
                onClick={toggleCommentVisibility}
              />
            </div>
            <div className="cursor-pointer">
              {bookmarked ? (
                <FaBookmark onClick={toggleBookmark} size={25} />
              ) : (
                <FaRegBookmark onClick={toggleBookmark} size={25} />
              )}
            </div>
          </div>
          <div className="w-full">
            <p className="px-3 flex items-start justify-start">
              <span className="mr-5 font-semibold">
                {post?.userId?.username}
              </span>
              {post?.caption}
            </p>
          </div>
        </CardBody>
        <Divider />
        <CardFooter className="pt-10">
          {post?.showComments && <CommentComponent postId={post._id} />}
        </CardFooter>
      </Card>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        {modal === "save" && (
          <SaveModal
            setUpdate={setUpdate}
            postId={post._id}
            userId={currentUser?._id}
          />
        )}
        {isUser && modal === "delete" && (
          <DeletePostModal key="deleteModal" postId={postId} />
        )}

        {isUser && modal === "edit" && (
          <EditPostModal
            key="editModal"
            postId={postId}
            setUpdate={setUpdate}
          />
        )}
        {!isUser && modal === "report" && (
          <ReportModal postId={postId} userId={currentUser?._id} />
        )}
      </Modal>
    </div>
  );
};

export default PostDetail;
