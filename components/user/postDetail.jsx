"use client";

import React, { useEffect, useState, useRef } from "react";
import axiosInstance from "./axiosConfig";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CommentComponent from "../../components/user/commentComponent";
import { IoMdMore } from "react-icons/io";
import DeletePostModal from "./userModals/deletePostModal";
import EditPostModal from "../../components/user/userModals/editPostModal";
import SaveModal from "./userModals/savePostModal";
import ReportModal from "@/components/user/userModals/reportModal";
import SimpleImageSlider from "react-simple-image-slider";
import { Card, CardHeader, CardBody, CardFooter, Divider, Image } from "@nextui-org/react";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button } from "@nextui-org/react";
import { BiLike, BiSolidLike } from "react-icons/bi";
import { FaRegComment, FaRegBookmark, FaBookmark } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { Modal, useDisclosure } from "@nextui-org/react";
import { updateUser } from "@/redux/reducers/user";
import { io } from "socket.io-client";

const isVideo = (url) => {
  return /\.(mp4|webm|ogg)$/i.test(url);
};

const PostDetail = ({ postId }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const current = useSelector((state) => state.user.currentUser);
  const [currentUser, setCurrentUser] = useState(current);
  const dispatch = useDispatch();
  const [post, setPost] = useState();
  const [likes, setLikes] = useState(0);
  const [bookmarked, setBookmarked] = useState(false);
  const [isUser, setIsUser] = useState(false);
  const url = process.env.NEXT_PUBLIC_API_URL;
  const [modal, setModal] = useState("");
  const [update, setUpdate] = useState(false);
  const socket = useRef(null);

  useEffect(() => {
    socket.current = io(process.env.NEXT_PUBLIC_API_URL);
  }, []);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axiosInstance.get(`${url}/get-post-details?postId=${postId}`);
        if (res.status === 200) {
          const userId = res.data.post.userId?._id;
          if (currentUser && currentUser?._id === userId) {
            setIsUser(true);
          }
          setPost(res.data.post);
          setLikes(res.data.post.likes.length);
          setBookmarked(currentUser?.allSaved?.includes(postId));
        }
      } catch (error) {
        toast.error(error.message);
      }
    };
    fetchPost();
  }, [currentUser, postId, url, update]);

  const toggleLike = async () => {
    if (!post || !currentUser) {
      return;
    }

    try {
      const postUser = post.userId;
      const currentLiked = post.likes.includes(currentUser._id);
      const newLiked = !currentLiked;

      if (newLiked) {
        await axiosInstance.post("/like-post", {
          userId: currentUser._id,
          postId: postId,
        });
        socket.current.emit("like", currentUser, postUser);
      } else {
        await axiosInstance.post("/unlike-post", {
          userId: currentUser._id,
          postId: postId,
        });
      }

      setLikes(newLiked ? likes + 1 : likes - 1);
      setPost((prevPost) => ({
        ...prevPost,
        likes: newLiked
          ? [...prevPost.likes, currentUser._id]
          : prevPost.likes.filter((id) => id !== currentUser._id),
      }));
    } catch (error) {
      console.error(error);
      toast.error("Error in liking or unliking post");
    }
  };

  const toggleBookmark = async () => {
    try {
      const newBookmarked = !bookmarked;
      setBookmarked(newBookmarked);

      if (newBookmarked) {
        setModal("save");
        onOpen();
      } else {
        await axiosInstance.post(`${url}/remove-save-post`, {
          userId: currentUser._id,
          postId: postId,
        });

        toast.success("Post removed from Saved");
      }

      const res = await axiosInstance.get(`${url}/user-details?email=${currentUser.email}`);
      dispatch(updateUser(res.data.user));
      setCurrentUser(res.data.user);
    } catch (error) {
      console.error(error);
      toast.error("Error saving or removing post. Please try again.");
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
          {post?.images ? (
            isVideo(post?.images[0]) ? (
              <video
                controls
                className="w-full h-full flex items-center object-cover rounded-xl"
              >
                <source src={post?.images[0]} type="video/mp4" />
              </video>
            ) : post?.images.length === 1 ? (
              <Image
                className="w-full flex items-center object-cover rounded-xl"
                alt="Card background"
                src={post?.images[0]}
              />
            ) : (
              <SimpleImageSlider
                width={380}
                height={280}
                images={post.images.map((img) => ({ url: img }))}
                showBullets={true}
                showNavs={true}
              />
            )
          ) : (
            <p>Loading post...</p>
          )}
          <div className="flex px-2 justify-between w-full">
            <div className="flex gap-x-5">
              {post?.likes.includes(currentUser?._id) ? (
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
          <div className="mt-4 w-full">
            <h4 className="text-lg">{post?.title}</h4>
            <p className="text-md">{post?.description}</p>
          </div>
        </CardBody>
        <Divider />
        <CardFooter>

          {post?.showComments && (
            <CommentComponent postId={postId} currentUser={currentUser} />
          )}
        </CardFooter>
      </Card>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <div>
          {modal === "delete" && (
            <DeletePostModal postId={postId} onOpenChange={onOpenChange} />
          )}
          {modal === "edit" && (
            <EditPostModal
              postId={postId}
              onOpenChange={onOpenChange}
              post={post}
              setUpdate={setUpdate}
              update={update}
            />
          )}
          {modal === "save" && (
            <SaveModal postId={postId} setUpdate={setUpdate} onOpenChange={onOpenChange}  userId={currentUser?._id}/>
          )}
          {modal === "report" && (
            <ReportModal
              reportedUser={post?.userId}
              reportedPost={postId}
              onOpenChange={onOpenChange}
            />
          )}
        </div>
      </Modal>
    </div>
  );
};

export default PostDetail;
