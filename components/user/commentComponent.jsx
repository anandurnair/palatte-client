import { Input, Button } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
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
import { FaShare } from "react-icons/fa";

const CommentComponent = ({ postId }) => {
  const [isFollowed, setIsFollowed] = React.useState(false);
  const [replyComment, setReplayComment] = useState("");
  const [showReply, setShowReply] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState([]);
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await axiosInstance.get(
          `http://localhost:4000/get-post-comment?postId=${postId}`
        );
        if (res.status === 200) {
          // Initialize showReply state for each comment to false
          const showReplyState = {};
          res.data.comments.forEach(comment => {
            showReplyState[comment._id] = false;
          });
          setShowReply(showReplyState);
          setComments(res.data.comments);
        } else {
          toast.error("Error in posting comment");
        }
      } catch (error) {
        toast.error(error);
      }
    };
    fetchComments();
  }, []);

  const handleCommentPost = async () => {
    if (newComment === "") {
      toast.error("Invalid comment");
      return;
    }
    try {
      const res = await axiosInstance.post(
        "http://localhost:4000/add-comment",
        { userId: currentUser._id, postId, comment: newComment }
      );
      if (res.status === 200) {
        toast.success(res.data.message);
      } else {
        toast.error("Error in posting comment");
      }
    } catch (error) {
      toast.error(error);
    }
  };

  // Function to toggle reply input for a comment
  const toggleReply = (commentId) => {
    setShowReply(prevState => ({
      ...prevState,
      [commentId]: !prevState[commentId]
    }));
  };

  return (
    <div className="w-full">
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
          <h2>Comments({comments.length})</h2>
        )}
      </div>
      <div className="px-5 flex flex-col gap-y-5">
        {comments.map((comment) => {
          return (
            <Card key={comment._id} className="w-full bg-semiDark">
              <CardHeader className="justify-between">
                <div className="flex gap-5">
                  <Avatar
                    isBordered
                    radius="full"
                    size="md"
                    src={comment.userId.profileImg}
                  />
                  <div className="flex flex-col gap-1 items-start justify-center">
                    <h4 className="text-small font-semibold leading-none text-default-600">
                      {comment.userId.username}
                    </h4>
                    <h5 className="text-small tracking-tight text-default-400">
                      {comment.date}
                    </h5>
                  </div>
                </div>
                <Button
                  className={
                    isFollowed
                      ? "bg-transparent text-foreground border-default-200"
                      : ""
                  }
                  color="primary"
                  radius="full"
                  size="sm"
                  variant={isFollowed ? "bordered" : "solid"}
                  onPress={() => setIsFollowed(!isFollowed)}
                >
                  {isFollowed ? "Unfollow" : "Follow"}
                </Button>
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
                    className=" text-default-400 text-small cursor-pointer"
                  >
                    {showReply[comment._id] ? 'Hide reply' :'Reply'}
                  </p>
                </div>
              </CardFooter>
              {showReply[comment._id] && (
                <CardFooter className="gap-3">
                  <div className=" w-full flex gap-x-3 px-4">
                    <Input
                      type="text"
                      variant="bordered"
                      value={replyComment}
                      placeholder="Add a reply"
                      onChange={(e) => setReplayComment(e.target.value)}
                    />
                    <Button className="btn" variant="bordered">
                      Post
                    </Button>
                  </div>
                </CardFooter>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default CommentComponent;
