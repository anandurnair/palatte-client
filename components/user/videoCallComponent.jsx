import React from 'react'
import {ZegoUIKitPrebuilt} from '@zegocloud/zego-uikit-prebuilt'
const VideoCallComponent = ({currentUser,receiverId}) => {
    const roomId = (parseInt(currentUser)._id + parseInt(receiverId).toString());

    const myMeeting = async(element)=>{
        const appID = 1322934761;
        const serverSecret ='d3b5bee370671b8225976dd15bd6066e';
        const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(appID,serverSecret,roomId,Date.now().toString(),currentUser.fullname)
        const zc  = ZegoUIKitPrebuilt.create(kitToken)
        zc.joinRoom({
            container:element,
            
            scenario:{
                mode :ZegoUIKitPrebuilt.OneONoneCall
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

export default VideoCallComponent
