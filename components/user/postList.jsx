"use client";
import React, { useEffect, useState, useMemo, useRef } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Image,
  Modal,
  useDisclosure,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@nextui-org/react";
import { ToastContainer, toast } from "react-toastify";
import axiosInstance from "./axiosConfig";
import CommentComponent from "../../components/user/commentComponent";
import { IoMdMore } from "react-icons/io";
import { BiLike, BiSolidLike } from "react-icons/bi";
import { FaRegComment, FaRegBookmark, FaBookmark } from "react-icons/fa";
import DeletePostModal from "@/components/user/userModals/deletePostModal";
import ReportModal from "./userModals/reportModal";
import SaveModal from "./userModals/savePostModal";
import EditPostModal from "../../components/user/userModals/editPostModal";
import { io } from "socket.io-client";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { updateUser } from "@/redux/reducers/user";
import SimpleImageSlider from "react-simple-image-slider";

const isVideo = (url) => {
  return /\.(mp4|webm|ogg)$/i.test(url);
};

const PostList = ({ updatePosts, setUpdatePosts }) => {
  const socket = useRef(null);

  const router = useRouter();
  const dispatch = useDispatch();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const currentUser = useSelector((state) => state.user.currentUser);
  const currentUserId = currentUser?._id;
  const [posts, setPosts] = useState([]);
  const [likes, setLikes] = useState({});
  const [user, setUser] = useState(currentUser);
  const [update, setUpdate] = useState(false);
  const [updateComment, setUpdateComment] = useState(false);

  socket.current = io(process.env.NEXT_PUBLIC_API_URL);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const res = await axiosInstance.get(
          `http://localhost:4000/user-details?email=${user.email}`
        );
        if (res.status === 200) {
          dispatch(updateUser(res.data.user));
          setUser(res.data.user);
        } else {
          console.error("Error in verification");
          toast.error(res.data.error);
        }
      } catch (error) {
        toast.error(error.message);
      }
    };
    fetchUserDetails();
  }, [update]);

  const savedPosts = useMemo(() => user?.allSaved || [], [user?.allSaved]);
  const [modal, setModal] = useState("");
  const [modalOpenStates, setModalOpenStates] = useState({});

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axiosInstance.get("http://localhost:4000/get-all-posts");
        if (res.status === 200) {
          const postsWithBookmarks = res.data.posts.map((post) => ({
            ...post,
            bookmarked: savedPosts.includes(post._id),
            likedByUser: post.likes.includes(user._id),
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

    if (user) {
      fetchPosts();
    }
  }, [update, updatePosts, updateComment]);

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

  const toggleModal = (postId, modalType = "") => {
    setModal(modalType);
    setModalOpenStates((prevState) => ({
      ...prevState,
      [postId]: !prevState[postId],
    }));
  };

  const toggleBookmark = async (postId) => {
    setModal("save");
    onOpen();

    try {
      const postIndex = posts.findIndex((post) => post._id === postId);
      const currentBookmarked = posts[postIndex].bookmarked;
      const newBookmarked = !currentBookmarked;

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId ? { ...post, bookmarked: newBookmarked } : post
        )
      );

      if (newBookmarked) {
        toggleModal(postId, "save");
      } else {
        await axiosInstance.post("http://localhost:4000/remove-save-post", {
          userId: user._id,
          postId: postId,
        });
        toast.success("Post removed from saved");
      }

      const res = await axiosInstance.get(
        `http://localhost:4000/user-details?email=${user.email}`
      );
      dispatch(updateUser(res.data.user));
    } catch (error) {
      console.error(error);
      toast.error("Error in saving or removing post");
    }
  };

  const toggleLike = async (postId, postUser) => {
    try {
      const postIndex = posts.findIndex((post) => post._id === postId);
      const currentLiked = likes[postId];
      const newLiked = !currentLiked;

      setLikes((prevLikes) => ({
        ...prevLikes,
        [postId]: newLiked,
      }));

      if (newLiked) {
        await axiosInstance.post("http://localhost:4000/like-post", {
          userId: user._id,
          postId: postId,
        });
        socket.current.emit("like", currentUser, postUser);
        console.log("LIked")
      } else {
        await axiosInstance.post("http://localhost:4000/unlike-post", {
          userId: user._id,
          postId: postId,
        });
        console.log("Unliked")
      }

      const updatedPosts = [...posts];
      updatedPosts[postIndex].likes = newLiked
        ? [...updatedPosts[postIndex].likes, user._id]
        : updatedPosts[postIndex].likes.filter((id) => id !== user._id);
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
      <ToastContainer
        containerId="a"
        toastStyle={{ backgroundColor: "#1d2028" }}
        position="bottom-right"
      />
      {posts.map(
        (post) =>
          !post.unListed && (
            <div
              key={post._id}
              className="w-full h-auto gap-x-5 flex justify-evenly items-center rounded-lg mb-10 shadow-lg"
            >
              <Card className="w-full bg3">
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
                        <Button isIconOnly variant="">
                          <IoMdMore size={25} />
                        </Button>
                      </DropdownTrigger>
                      {currentUserId === post?.userId?._id ? (
                        <DropdownMenu aria-label="Static Actions">
                          <DropdownItem
                            key="new"
                            onPress={() =>
                              router.push(`/postDetails?postId=${post._id}`)
                            }
                          >
                            Go to Post
                          </DropdownItem>
                          <DropdownItem
                            key="edit"
                            onPress={() => toggleModal(post._id, "edit")}
                          >
                            Edit Post
                          </DropdownItem>
                          <DropdownItem
                            key="delete"
                            onPress={() => toggleModal(post._id, "delete")}
                          >
                            Delete Post
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
                            onPress={() => toggleModal(post._id, "report")}
                          >
                            Report post
                          </DropdownItem>
                          <DropdownItem
                            key="new"
                            onPress={() =>
                              router.push(`/postDetails?postId=${post._id}`)
                            }
                          >
                            Go to Post
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
                  {isVideo(post.images) ? (
                    <video
                      width="750"
                      height="500"
                      className="w-full flex items-center object-cover rounded-xl"
                      controls
                    >
                      <source src={post.images} type="video/mp4" />
                    </video>
                  ) : post.images.length === 1 ? (
                    <Image
                      className="w-full flex items-center object-cover rounded-xl"
                      alt="Card background"
                      src={post.images[0]}
                    />
                  ) : (
                    <SimpleImageSlider
                      width={380}
                      height={280}
                      images={post.images.map((img) => ({ url: img }))}
                      showBullets={true}
                      showNavs={true}
                    />
                  )}
                  <div className="flex px-2 justify-between w-full">
                    <div className="flex gap-x-5">
                      {likes[post._id] ? (
                        <BiSolidLike
                          className="cursor-pointer"
                          onClick={() => toggleLike(post._id, post.userId)}
                          size={25}
                        />
                      ) : (
                        <BiLike
                          className="cursor-pointer"
                          onClick={() => toggleLike(post._id, post.userId)}
                          size={25}
                        />
                      )}
                      {post.likes.length} {/* Display likes count */}
                      <FaRegComment
                        className="cursor-pointer"
                        size={25}
                        onClick={() => toggleCommentVisibility(post._id)}
                      />
                      {post.commentCount}
                    </div>
                    <div className="cursor-pointer">
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
                        {post.userId?.username}
                      </span>
                      {post?.caption}
                    </p>
                  </div>
                </CardBody>
                <Divider />
                <CardFooter>
                  {post.showComments && (
                    <CommentComponent
                      setUpdateComment={setUpdateComment}
                      postId={post._id}
                      userId={post.userId}
                    />
                  )}
                </CardFooter>
              </Card>
              <Modal
                key={post._id}
                isOpen={modalOpenStates[post._id] || false}
                onOpenChange={() => toggleModal(post._id)}
              >
                {modal === "report" && (
                  <ReportModal postId={post._id} userId={currentUserId} />
                )}
                {modal === "edit" && (
                  <EditPostModal
                    key="editModal"
                    postId={post._id}
                    setUpdate={setUpdate}
                  />
                )}
                {modal === "delete" && (
                  <DeletePostModal postId={post._id} setUpdate={setUpdate} />
                )}
                {modal === "save" && (
                  <SaveModal setUpdate={setUpdate} postId={post._id} userId={user._id} />
                )}
              </Modal>
            </div>
          )
      )}
    </>
  );
};

export default PostList;
