"use client";
import React, { useEffect, useRef, useState ,useCallback} from "react";
import { Avatar, Input,CardBody, Image, Textarea } from "@nextui-org/react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Card
} from "@nextui-org/react";
import CropModal from "./postCropModal";
import getCroppedImg from "../../helpers/croppedImage";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axiosInstance from "./axiosConfig";
import { useDispatch, useSelector } from "react-redux";
import { updateAllPosts } from "@/redux/reducers/post";
const UploadPost = () => {
    const inputRef = useRef(null);
  const dispatch = useDispatch()
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const currentUser = useSelector(state => state.user.currentUser);
  useEffect(() => {

    setUser(currentUser);
  }, [currentUser]);

  const [user, setUser] = useState();
  const [image, setImage] = useState();
  const [caption,setCaption] = useState()
  const [crop, setCrop] = useState({ x: 0, y: 0, width: 100, height: 100 });
  const [croppedImage, setCroppedImage] = useState();
  const [preview, setPreview] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
   const [imgErr,setImgErr] = useState(false)
  const handleFileChange = (e) => {
    const file = e.target.files[0]; 

    if (file) {
        const imageUrl = URL.createObjectURL(file); 
    }
}

const handleSubmit = async () => {
    
  
      blobUrlToBase64(croppedImage, function (base64Data) {
        setCroppedImage(base64Data);
        console.log("img", base64Data);
  
        const data = {
            userId:user._id,
            images : base64Data,
            caption
        };
  
        postToDatabase(data); 
      });
    
   
   
  };
  function blobUrlToBase64(blobUrl, callback) {
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
      var reader = new FileReader();
      reader.onloadend = function () {
        callback(reader.result);
      };
      reader.readAsDataURL(xhr.response);
    };
    xhr.open("GET", blobUrl);
    xhr.responseType = "blob";
    xhr.send();
  }

  async function postToDatabase(data) {
    try {
      const res = await axiosInstance.post(
        "http://localhost:4000/add-post",
        data
      );

      if (res.status === 200) {
        dispatch(updateAllPosts(res.data.posts))
        toast.success("Uploaded Successfully")
       } else {
         console.log(res.data);
         toast.error(res.data.error);
       }
    } catch (error) {
      toast.error("Error in Updating");
    }
  }

//   const onCropChange = (crop, croppedAreaPixels) => {
//     setCrop(crop);
//     setCroppedAreaPixels(croppedAreaPixels);
//   };
//   const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
//     setCroppedAreaPixels(croppedAreaPixels);
//   }, []);

//   const handleCloseModal = () => {
//     setShowModal(false);
//     setImage(null);
//     setCrop({ x: 0, y: 0, width: 1, height: 1 });
//     setCroppedAreaPixels(null);
//     setPreview(true);
//   };

//   const handleFileChange = (e) => {
//     if (e.target.files && e.target.files.length > 0) {
//       const selectedImage = e.target.files[0];
//       if (
//         selectedImage.type === "image/png" ||
//         selectedImage.type === "image/jpeg"
//       ) {
//         setImage(selectedImage);
//         setShowModal(true);
//       } else {
//         toast.error(
//           "Only PNG and JPEG image files are allowed for the Profile image."
//         );
//       }
//     }
//   };
//   const handleCropImage = async (e) => {
//     e.preventDefault();
//     try {
//       if (croppedAreaPixels && image) {
//         const croppedImageBase64 = await getCroppedImg(
//           image,
//           croppedAreaPixels
//         );
//         setCroppedImage(croppedImageBase64);
//         setShowModal(false);
//         setPreview(false);
//       }
//     } catch (error) {
//       console.error("Error cropping image:", error);
//     }
//   };

  return (
    <>
      <ToastContainer
        toastStyle={{ backgroundColor: "#1d2028" }}
        position="bottom-center"
      />

      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        isDismissable={false}
        isKeyboardDismissDisabled={true}
        className="z-0"
      >
        <ModalContent>
          {(onClose) => (
            <div className="flex flex-col justify-center">
              <ModalHeader className="flex flex-col gap-1">
                Add Post{" "}
              </ModalHeader>
              <ModalBody>
              <input
            //   ref={inputRef}
              onChange={handleFileChange}
            //   onClick={() => setPreview(true)}
              accept="image/*"
              className=" my-2 block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
              type="file"
            />
                <Image
                  className="w-full"
                  alt="NextUI hero Image"
                  src={croppedImage}
                />
                <Textarea
                  label="Caption"
                  placeholder="Enter caption for this post"
                  className="w-full"
                  onChange={(e)=>setCaption(e.target.value)}
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="default" onClick={handleSubmit} onPress={onClose}>
                  Publish
                </Button>
              </ModalFooter>
            </div>
          )}
          
        </ModalContent>
      </Modal>
      
      <div className="w-full m-5 bg-semiDark h-20 gap-x-5 flex justify-between items-center p-4 rounded-lg">
      <Avatar isBordered color="default" src={user?.profileImg} />
        <Button className="btn-full" onPress={onOpen}>Add Post</Button>
      </div>
      {showModal && (
            <CropModal
              image={URL.createObjectURL(image)}
              crop={crop}
              setCroppedAreaPixels={setCroppedAreaPixels}
              onCropChange={onCropChange}
              onCropComplete={onCropComplete}
              onClose={handleCloseModal}
              onCropImage={handleCropImage}
              
            />
          )}
    </>
  );
};

export default UploadPost;
