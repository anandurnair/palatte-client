'use client'
import React, { useEffect, useState } from 'react'
import ProtectedRoute from "../../components/user/ProtectedRoute";
import axiosInstance from './axiosConfig';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const PostDetail = ({postId}) => {
    const [post, setPost] = useState();
    const [comments, setComments] = useState([])
    useEffect(()=>{
        const fetchPost = async()=>{
            try {
                console.log('work');
                const res = await axiosInstance.get(`http://localhost:4000/get-post-details?postId=${postId}`)
                if(res.status === 200){
                    toast.success(res.data.message)
                    setPost(res.data.post)
                    setComments(res.data.comments)
                    console.log(res.data.post)
                    console.log(res.data.comments)

                }
            } catch (error) {
                toast.error(error)
            }
        }
        fetchPost()
    },[])
  return (
    <div className="w-full h-full  flex flex-col items-center rounded-lg my-5">
        <ToastContainer
        toastStyle={{ backgroundColor: "#20222b", color: "#fff" }}
        position="bottom-right"
      />
              <div className="w-4/5 h-full bg-semi mt-3 rounded-lg p-20 z-10 shadow-2xl">
                <h2>post id :{postId}</h2>
</div>
    </div>
  )
}

export default PostDetail
