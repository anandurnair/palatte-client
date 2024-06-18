import {createClient,createMicrophoneAndCameraTracks,createScreenVideoTrack} from "agora-rtc-react"

import AgoraRTM from 'agora-rtc-sdk';

const appId = "d9735ac5ad074e11bd286d96d9797c72";
const token = null;
export const config = {mode : "rtc" , codec : "vp8", appId : appId , token : token};
export const useClient = createClient(config)
export const useMicrophoneAndCameraTracks = createMicrophoneAndCameraTracks();
