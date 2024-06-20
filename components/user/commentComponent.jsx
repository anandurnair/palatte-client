"use client";
import { Input, Button } from "@nextui-org/react";
import React, { useEffect, useRef, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axiosInstance from "./axiosConfig";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Avatar,
} from "@nextui-org/react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";
import { IoMdMore } from "react-icons/io";
import ReportedCommentModal from "../user/userModals/reportCommentModal";
import { FaShare } from "react-icons/fa";
import { useSelector } from "react-redux";
import {
  Modal,
  useDisclosure,
} from "@nextui-org/react";
import DeleteCommentModal from "../user/userModals/deleteCommentModal";
import { io } from "socket.io-client";

const CommentComponent = ({ setUpdateComment, postId ,userId}) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const socket = useRef(null);
  const [commentId, setCommentId] = useState();
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState([]);
  const [replyComments, setReplyComments] = useState({});
  const [showReply, setShowReply] = useState({});
  const currentUser = useSelector((state) => state.user.currentUser);
  const [modal, setModal] = useState("");
  const [update, setUpdate] = useState(false);
  socket.current = io(process.env.NEXT_PUBLIC_API_URL);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await axiosInstance.get(
          `/get-post-comment?postId=${postId}`
        );
        if (res.status === 200) {
          const showReplyState = {};
          res.data.comments.forEach((comment) => {
            showReplyState[comment._id] = false;
          });
          setShowReply(showReplyState);
          setComments(res.data.comments);
          console.log("data fetched")
        } else {
          toast.error("Error in fetching comments");
        }
      } catch (error) {
        toast.error(error.message);
      }
    };
    fetchComments();
  }, [postId, update]);

  const handleCommentPost = async () => {
    if (newComment.trim() === "") {
      toast.error("Invalid comment");
      return;
    }
    try {
      const res = await axiosInstance.post(
        "/add-comment",
        { userId: currentUser._id, postId, comment: newComment }
      );
      if (res.status === 200) {
        toast.success(res.data.message);
        setUpdateComment(prev => !prev)
        socket.current.emit("comment", currentUser,userId);

        setNewComment("");
        setUpdate(prev =>!prev);
      } else {
        toast.error("Error in posting comment");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleReplyPost = async (commentId) => {
    const replyComment = replyComments[commentId];
    if (!replyComment || replyComment.trim() === "") {
      toast.error("Invalid reply");
      return;
    }
    try {
      const res = await axiosInstance.post(
        "/add-reply",
        {
          userId: currentUser._id,
          postId,
          comment: replyComment,
          parentCommentId: commentId,
        }
      );
      if (res.status === 200) {
        toast.success(res.data.message);
        setReplyComments((prev) => ({ ...prev, [commentId]: "" }));
        setUpdate(!update);
      } else {
        toast.error("Error in posting reply");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const toggleReply = (commentId) => {
    setShowReply((prevState) => ({
      ...prevState,
      [commentId]: !prevState[commentId],
    }));
  };

  const handleModalClick = (key, commentId) => {
    setModal(key);
    setCommentId(commentId);
    onOpen();
  };

  return (
    <div className="w-full overflow-y-scroll">
      <ToastContainer
        toastStyle={{ backgroundColor: "#1d2028" }}
        position="bottom-right"
      />
      <div className="flex gap-x-3 px-4">
        <Input
          type="text"
          variant="bordered"
          value={newComment}
          placeholder="Add a comment"
          onChange={(e) => setNewComment(e.target.value)}
        />
        <Button className="btn" onClick={handleCommentPost} variant="bordered">
          Post
        </Button>
      </div>
      <div className="p-5">
        {comments.length === 0 ? (
          <h2>No comments</h2>
        ) : (
          <h2>Comments ({comments.length})</h2>
        )}
      </div>
      <div className="px-5 flex flex-col gap-y-5">
        {comments.map((comment) => (
          <div key={comment._id}>
            <Card className="w-full bg-semiDark">
              <CardHeader className="justify-between">
                <div className="flex gap-5">
                  <Avatar
                    isBordered
                    radius="full"
                    size="md"
                    src={comment?.userId.profileImg}
                  />
                  <div className="flex flex-col gap-1 items-start justify-center">
                    <h4 className="text-small font-semibold leading-none text-default-600">
                      {comment?.userId.username}
                    </h4>
                    <h5 className="text-small tracking-tight text-default-400">
                      {comment?.date}
                    </h5>
                  </div>
                </div>
                <div>
                  <Dropdown>
                    <DropdownTrigger>
                      <Button isIconOnly className="" variant="">
                        <IoMdMore size={25} />
                      </Button>
                    </DropdownTrigger>
                    {currentUser?._id === comment?.userId?._id ? (
                      <DropdownMenu aria-label="Static Actions">
                        <DropdownItem
                          key="delete"
                          onClick={() => handleModalClick("delete", comment._id)}
                        >
                          Delete
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
                          onClick={() =>
                            handleModalClick("report", comment._id)
                          }
                        >
                          Report
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
              <CardBody className="px-3 py-0 text-small">
                <p>{comment.comment}</p>
              </CardBody>
              <CardFooter className="gap-3">
                <div className="flex gap-1">
                  <p className="font-semibold text-default-400 text-small">
                    <FaShare />
                  </p>
                  <p
                    onClick={() => toggleReply(comment._id)}
                    className="text-default-400 text-small cursor-pointer"
                  >
                    {showReply[comment._id] ? "Hide reply" : "Reply"}
                  </p>
                </div>
              </CardFooter>
              {showReply[comment._id] && (
                <CardFooter className="gap-3 flex flex-col">
                  <div className="w-full flex gap-x-3 px-4">
                    <Input
                      type="text"
                      variant="bordered"
                      value={replyComments[comment._id] || ""}
                      placeholder="Add a reply"
                      onChange={(e) =>
                        setReplyComments((prev) => ({
                          ...prev,
                          [comment._id]: e.target.value,
                        }))
                      }
                    />
                    <Button
                      className="btn"
                      onClick={() => handleReplyPost(comment._id)}
                      variant="bordered"
                    >
                      Post
                    </Button>
                  </div>
                  <div className="p-5 bg5 rounded-lg flex justify-start">
        {comment.replies.length === 0 ? (
          <h2>No replies</h2>
        ) : (
          <h2>Replies ({comment.replies.length})</h2>
        )}
      </div>
                  <div className="w-full px-5 flex flex-col gap-y-5">
                    {comment.replies.slice().reverse().map((reply) => (
                      <Card key={reply._id} className="w-full p-3 bg-semiDark">
                        <CardHeader className="justify-between">
                          <div className="flex gap-5">
                            <Avatar
                              isBordered
                              radius="full"
                              size="md"
                              src={reply?.userId.profileImg}
                            />
                            <div className="flex flex-col gap-1 items-start justify-center">
                              <h4 className="text-small font-semibold leading-none text-default-600">
                                {reply?.userId.username}
                              </h4>
                              <h5 className="text-small tracking-tight text-default-400">
                                {reply?.date}
                              </h5>
                            </div>
                          </div>
                          <div>
                            <Dropdown>
                              <DropdownTrigger>
                                <Button isIconOnly className="" variant="">
                                  <IoMdMore size={25} />
                                </Button>
                              </DropdownTrigger>
                              {currentUser?._id === reply?.userId?._id ? (
                                <DropdownMenu aria-label="Static Actions">
                                  <DropdownItem
                                    key="delete"
                                    onClick={() =>
                                      handleModalClick("delete", reply._id)
                                    }
                                  >
                                    Delete
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
                                    onClick={() =>
                                      handleModalClick("report", reply._id)
                                    }
                                  >
                                    Report
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
                        <CardBody className="px-3 py-0 text-small">
                          <p>{reply.comment}</p>
                        </CardBody>
                      </Card>
                    ))}
                  </div>
                </CardFooter>
              )}
            </Card>
            <Modal key={commentId} isOpen={isOpen} onOpenChange={onOpenChange}>
              {modal === "report" ? (
                <ReportedCommentModal
                  commentId={commentId}
                  postId={postId}
                  userId={currentUser._id}
                />
              ) : (
                <DeleteCommentModal setUpdateComment={setUpdateComment} setUpdate={setUpdate} commentId={commentId} />
              )}
            </Modal>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentComponent;
