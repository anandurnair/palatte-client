'use client'
import React from "react";
import { Card, CardHeader, CardBody, Avatar, Badge } from "@nextui-org/react";

const GroupChatListComponent = ({ groupConversations, setCurrentChat }) => {
  return (
    <div>
      {groupConversations.map((group) => (
        <div key={group._id} onClick={() => setCurrentChat(group)}>
          <Card className="w-full mb-3 cursor-pointer">
            <CardHeader className="justify-between">
              <div className="flex gap-5">
               
                  <Avatar
                    isBordered
                    radius="full"
                    size="md"
                    src="https://cdn2.iconfinder.com/data/icons/user-actions-solid/24/group_team_friends-512.png" // Update the src if you have a source URL
                  />
             

                <div className="flex flex-col gap-1 items-start justify-center">
                  <h4 className="text-small font-semibold leading-none text-default-600">
                    {group.groupName}
                  </h4>
                </div>
              </div>

              <p className="text-xs font-thin">click to chat</p>
            </CardHeader>
            <CardBody className="px-3 py-0 text-small text-default-400"></CardBody>
          </Card>
        </div>
      ))}
    </div>
  );
};

export default GroupChatListComponent;
