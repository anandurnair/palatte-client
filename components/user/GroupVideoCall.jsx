import React from 'react'
import {ZegoUIKitPrebuilt} from '@zegocloud/zego-uikit-prebuilt'

const GroupVideoCall = ({members,currentUser}) => {
    console.log("Users  8 : ",parseInt(members[0]))
    const roomId = members.reduce((sum,e)=>{
        return sum + parseInt(e)
    },0)
    console.log("Room :",roomId)
    const myMeeting = async(element)=>{
        const appID = 1322934761;
        const serverSecret ='d3b5bee370671b8225976dd15bd6066e';
        const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(appID,serverSecret,roomId.toString(),Date.now().toString(),currentUser.fullname)
        const zc  = ZegoUIKitPrebuilt.create(kitToken)
        zc.joinRoom({
            container:element,
            sharedLinks:[
                {
                    name:"Copy link",
                    url :`http://localhost:3000/inbox/${roomId}`
                }
            ],
            scenario:{
                mode :ZegoUIKitPrebuilt.GroupCall
            },
            showScreenSharingButton:false
        })
    }
  return (
    <div className="w-full h-5/6 bg-white p-4 overflow-y-auto">     
    <div className='' ref={myMeeting}/>
    </div>
  )
}

export default GroupVideoCall
