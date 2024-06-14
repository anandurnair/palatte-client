'use client'
import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Avatar,
} from "@nextui-org/react";
import { MdCallMade, MdCallReceived } from "react-icons/md";
import { parseISO, format } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';
import axiosInstance from "@/components/user/axiosConfig";
import { useSelector } from "react-redux";

const CallHistoryPage = () => {
  const currentUser = useSelector(state => state.user.currentUser);
  const [calls, setCalls] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (currentUser?._id) {
          const res = await axiosInstance.get(`/get-call-history?userId=${currentUser._id}`);
          setCalls(res.data.calls ?? []);
          console.log("Calls:", res.data.calls);
        }
      } catch (error) {
        console.error("Error fetching call history:", error);
        // Implement proper error handling, e.g., show an error message to the user
      }
    };

    fetchData();
  }, [currentUser]);

  function convertISOToCustomString(isoString) {
    // Parse the ISO date string to a JavaScript Date object
    const date = parseISO(isoString);
  
    // Format the date to the desired string format
    const formattedDate = format(date, "d MMMM yyyy h:mm a");
  
    return formattedDate;
  }

  return (
    <div className="purple-dark h-full bg-background text-foreground flex gap-x-4 overflow-y-scroll">
      <div className="h-full bg-semi w-2/6 shadow-lg rounded-lg p-4">
        <h2 className="font-semibold text-lg">Call history</h2>
        <div className="w-full mt-4 h-full overflow-y-auto">
          {calls.slice().reverse().map(call => (
            <Card key={call._id} className="mt-2">
              <CardHeader className="justify-between">
                <div className="flex gap-5">
                  <Avatar
                    isBordered
                    radius="full"
                    size="md"
                    src={call.members[0]._id === currentUser._id ? call.members[1].profileImg : call.members[0].profileImg}
                  />
                  <div className="flex flex-col gap-1 items-start justify-center">
                    <h4 className="text-small font-semibold leading-none text-default-600">
                      {call.members[0]._id === currentUser._id ? call.members[1].fullname : call.members[0].fullname}
                    </h4>
                    <h5 className="text-small tracking-tight text-default-400">
                      {call.members[0]._id === currentUser._id ? call.members[1].username : call.members[0].username}
                    </h5>
                  </div>
                </div>
                <p className="text-neutral-400">
                  {call.members[0]._id === currentUser._id ? <MdCallMade size={25} /> : <MdCallReceived size={25} />}
                </p>
              </CardHeader>
              
              <CardFooter className="flex gap-3 justify-end text-neutral-400 ">
                <p className="text-xs">{convertISOToCustomString(call.callAt)}</p>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CallHistoryPage;
