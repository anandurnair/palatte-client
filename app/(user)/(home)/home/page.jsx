import React from "react";
import UploadPost from "../../../../components/user/uploadPost";
import PostList from "../../../../components/user/postList";
import { Button } from "@nextui-org/react";
import { Suspense } from "react";
import Loading from "../../loading";
const Home = () => {
  return (
    <div className="purple-dark flex h-lvh bg-background text-foreground overflow-hidden ">
      <div className="w-9/12 h-full  flex flex-col items-center px-40 overflow-y-scroll overflow-x-hidden">
        <Suspense fallback={<Loading />}>
          <UploadPost />
          <PostList />
        </Suspense>
      </div>
      <div className="w-4/12  h-auto flex gap-y-4 flex-col px-10 ">
        <Button className="btn" variant="bordered">
          Hire freelancer
        </Button>

        <div className="h-96 w-full bg-semiDark rounded-lg p-4 flex justify-center">
          Chats
        </div>
        <div className="h-56 w-full bg-semiDark rounded-lg p-4 flex justify-center">
          Suggestions
        </div>
      </div>
    </div>
  );
};

export default Home;
