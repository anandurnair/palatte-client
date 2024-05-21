"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import { Avatar, Textarea } from "@nextui-org/react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import CropModal from "./postCropModal";
import getCroppedImg from "../../helpers/croppedImage";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axiosInstance from "./axiosConfig";
import { useDispatch, useSelector } from "react-redux";
import { updateAllPosts } from "@/redux/reducers/post";
import SimpleImageSlider from "react-simple-image-slider";

const UploadPost = () => {
  const inputRef = useRef(null);
  const dispatch = useDispatch();
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const currentUser = useSelector((state) => state.user.currentUser);

  useEffect(() => {
    setUser(currentUser);
  }, [currentUser]);

  const [user, setUser] = useState();
  const [images, setImages] = useState([]);
  const [caption, setCaption] = useState("");
  const [crop, setCrop] = useState({ x: 0, y: 0, width: 100, height: 100 });
  const [croppedImages, setCroppedImages] = useState([]);
  const [preview, setPreview] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [imgErr, setImgErr] = useState(false);
  const [video, setVideo] = useState("");
  const [isVideo, setIsVideo] = useState(false);
  const [selected, setSelected] = useState("");

  
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

  const convertToBase64 = (blobUrl) => {
    return new Promise((resolve, reject) => {
      blobUrlToBase64(blobUrl, (result) => {
        if (result) {
          resolve(result);
        } else {
          reject(new Error("Conversion to base64 failed"));
        }
      });
    });
  };

  const handleSubmit = async () => {
    try {
      if (isVideo) {
        const base64Data = await convertToBase64(video);
        const data = {
          userId: user._id,
          images: [base64Data],
          caption,
        };

        await postToDatabase(data);
        return;
      }

      const base64Images = await Promise.all(images.map(convertToBase64));
      const data = {
        userId: user._id,
        images: base64Images,
        caption,
      };

      await postToDatabase(data);
    } catch (error) {
      toast.error("Error in converting images to base64");
      console.error(error);
    }
  };

  async function postToDatabase(data) {
    try {
      const res = await axiosInstance.post("http://localhost:4000/add-post", data);

      if (res.status === 200) {
        dispatch(updateAllPosts(res.data.posts));
        setCroppedImages([]);
        setVideo("");
        setSelected("");
        setIsVideo(false);
        toast.success("Uploaded Successfully");
      } else {
        console.log(res.data);
        toast.error(res.data.error);
      }
    } catch (error) {
      toast.error("Error in Updating");
      console.error(error);
    }
  }

  const onCropChange = (crop, croppedAreaPixels) => {
    setCrop(crop);
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleCloseModal = () => {
    setShowModal(false);
    setImages([]);
    setCrop({ x: 0, y: 0, width: 1, height: 1 });
    setCroppedAreaPixels(null);
    setPreview(true);
    console.log("preview working");
    onOpen();
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files);
      const validImages = selectedFiles.filter(
        (file) => file.type === "image/png" || file.type === "image/jpeg"
      );
      const videoFile = selectedFiles.find((file) => file.type === "video/mp4");

      if (videoFile) {
        const videoURL = URL.createObjectURL(videoFile);
        setVideo(videoURL);
        setIsVideo(true);
        console.log("video file", videoURL);
        return;
      }

      if (validImages.length > 0) {
        setIsVideo(false);
        setImages(validImages);
        setCurrentImageIndex(0);
        setShowModal(true);
        onClose();
      } else {
        toast.error("Only PNG and JPEG image files are allowed.");
      }
    }
  };

  const handleCropImage = async (e) => {
    e.preventDefault();
    try {
      if (croppedAreaPixels && images.length > 0) {
        const croppedImageBase64 = await getCroppedImg(images[currentImageIndex], croppedAreaPixels);
        setCroppedImages((prev) => [...prev, croppedImageBase64]);

        if (currentImageIndex < images.length - 1) {
          setCurrentImageIndex((prevIndex) => prevIndex + 1);
        } else {
          setShowModal(false);
          setPreview(false);
          onOpen();
        }
      }
    } catch (error) {
      console.error("Error cropping image:", error);
    }
  };

  const handleModalClose = () => {
    setCroppedImages([]);
    setVideo("");
    setIsVideo(false);
    setSelected("");
    onClose();
  };

 


  return (
    <>
      <ToastContainer toastStyle={{ backgroundColor: "#1d2028" }} position="bottom-center" />

      <Modal isOpen={isOpen} onOpenChange={onOpenChange} isDismissable={false} isKeyboardDismissDisabled={true} className="z-0">
        <ModalContent>
          {(onClose) => (
            <div className="flex flex-col justify-center">
              <ModalHeader className="flex flex-col gap-1">Add Post</ModalHeader>
              <ModalBody>
                <input
                  ref={inputRef}
                  onChange={handleFileChange}
                  onClick={() => setPreview(true)}
                  accept="image/*,video/*"
                  className="my-2 block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                  type="file"
                  multiple
                />
                {croppedImages.length > 0 && (
                  <SimpleImageSlider
                    width={380}
                    height={280}
                    images={croppedImages.map((img) => ({ url: img }))}
                    showBullets={true}
                    showNavs={true}
                  />
                )}
                {isVideo && video && (
                  <video width="750" height="500" controls>
                    <source src={video} type="video/mp4" />
                  </video>
                )}
                <Textarea
                  label="Caption"
                  placeholder="Enter caption for this post"
                  className="w-full"
                  onChange={(e) => setCaption(e.target.value)}
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={handleModalClose}>
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
        <Button className="btn-full" onPress={onOpen}>
          Add Post
        </Button>
      </div>

      {showModal && currentImageIndex < images.length && (
        <CropModal
          image={URL.createObjectURL(images[currentImageIndex])}
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
