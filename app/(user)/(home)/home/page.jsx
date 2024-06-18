'use client'
import React, { useState, Suspense } from "react";
import UploadPost from "../../../../components/user/uploadPost";
import PostList from "../../../../components/user/postList";
import { Button } from "@nextui-org/react";
import Loading from "../../loading";
import { useRouter } from "next/navigation";
import NotificationComponent from '@/components/user/NotificationCommponent'
const Home = () => {
  const router = useRouter();
  const [updatePosts, setUpdatePosts] = useState(false);

  return (
    <div className="purple-dark flex h-lvh bg-background text-foreground overflow-hidden">
      <div className="w-full md:w-9/12 h-full flex flex-col items-center px-4 md:px-40 overflow-y-scroll overflow-x-hidden">
        <Suspense fallback={<Loading />}>
          <UploadPost updatePosts={updatePosts} setUpdatePosts={setUpdatePosts} />
          <PostList updatePosts={updatePosts} setUpdatePosts={setUpdatePosts} />
        </Suspense>
      </div>
      <div className="hidden md:flex md:w-4/12 h-auto gap-y-4 flex-col px-4 md:px-10">
        <Button className="btn "  variant="bordered" onClick={() => router.push('/hireFreelancer')}>
          Hire freelancer
        </Button>

        <div className="h-2/3 w-full rounded-lg py-4 flex justify-center">
          <NotificationComponent />
        </div>
        <div className="h-56 w-full bg-semiDark rounded-lg p-4 flex justify-center">
          Suggestions
        </div>
      </div>
    </div>
  );
};

export default Home;
