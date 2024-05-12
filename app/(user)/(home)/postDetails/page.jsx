'use client'
import React from 'react'
import { useSearchParams } from "next/navigation";
import PostDetail from '@/components/user/postDetail'
const PostDetailPage = () => {
    const searchParams = useSearchParams();
    const postId = searchParams.get('postId'); 

  return (
    <div className='purple-dark h-full bg-background text-foreground  flex flex-col justify-center overflow-scroll'>
      <PostDetail postId={postId} />
    </div>
  )
}

export default PostDetailPage
