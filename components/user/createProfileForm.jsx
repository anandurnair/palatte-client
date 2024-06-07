"use client";

import React, { useEffect, useCallback, useRef, useState } from "react";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import Cropper from "react-easy-crop";
import axiosInstance from "../user/axiosConfig";
import ProtectedRoute from "../../components/user/ProtectedRoute";
import CropModal from "./cropModal";
import getCroppedImg from "../../helpers/croppedImage";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  Input,
  RadioGroup,
  Radio,
  Button,
  Textarea,
  Listbox,
  ListboxItem,
  Image, // Corrected import
} from "@nextui-org/react";
import "../style.css";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { updateUser } from "../../redux/reducers/user";
const CreateProfileForm = () => {
  const [isLoading, setIsLoading] = useState(true); // Initially set to true

  const inputRef = useRef(null);
  const dispatch = useDispatch();
  const router = useRouter();
  const [selectedKeys, setSelectedKeys] = useState(new Set([]));
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [place, setPlace] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [isFreelance, setFreelance] = useState("no");
  const [image, setImage] = useState();
  const [crop, setCrop] = useState({ x: 0, y: 0, width: 100, height: 100 });
  const [croppedImage, setCroppedImage] = useState();
  const [preview, setPreview] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [phoneErr, setPhoneErr] = useState("");
  const user = useSelector((state) => state.user.tempUser);
  useEffect(() => {
    setFullname(user?.fullname);
    setEmail(user?.email);

    const fetchData = async () => {
      try {
        const res = await axiosInstance.get(
          "http://localhost:4000/getServices"
        );
        if (res.status === 200) {
          setServices(res.data.services);
        }
      } catch (error) {
        toast.error(error);
      }
    };
    fetchData();
  }, [user]);

  // const handleProfilePhoto = (e) => {
  //   const file = e.target.files[0];
  //   if (file && file.type.startsWith("image")) {
  //     previewFile(file);
  //   } else {
  //     alert("Please select an image file.");
  //   }
  // };

  // const previewFile = (file) => {
  //   const reader = new FileReader();
  //   reader.readAsDataURL(file);
  //   reader.onload = () => {
  //     setPreviewSource(reader.result);
  //   };
  // };
  const onCropChange = (crop, croppedAreaPixels) => {
    setCrop(crop);
    setCroppedAreaPixels(croppedAreaPixels);
  };
  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleCloseModal = () => {
    setShowModal(false);
    setImage(null);
    setCrop({ x: 0, y: 0, width: 1, height: 1 });
    setCroppedAreaPixels(null);
    setPreview(true);
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedImage = e.target.files[0];
      if (
        selectedImage.type === "image/png" ||
        selectedImage.type === "image/jpeg"
      ) {
        setImage(selectedImage);
        setShowModal(true);
      } else {
        toast.error(
          "Only PNG and JPEG image files are allowed for the Profile image."
        );
      }
    }
  };
  const handleCropImage = async (e) => {
    e.preventDefault();
    try {
      if (croppedAreaPixels && image) {
        const croppedImageBase64 = await getCroppedImg(
          image,
          croppedAreaPixels
        );
        setCroppedImage(croppedImageBase64);
        setShowModal(false);
        setPreview(false);
      }
    } catch (error) {
      console.error("Error cropping image:", error);
    }
  };

  const handleSubmit = async (e) => {
    if (
      phoneErr ||
      fullname == "" ||
      username == "" ||
      bio === "" ||
      place === "" ||
      croppedImage == undefined
    ) {
      toast.error("Fill the form");
      return;
    }
    if (croppedAreaPixels && image) {
      const croppedImageBase64 = await getCroppedImg(image, croppedAreaPixels);
      setShowModal(false);
      setPreview(false);

      blobUrlToBase64(croppedImageBase64, function (base64Data) {
        setCroppedImage(base64Data);

        // Data posting logic
        const data = {
          profilePic: base64Data, // Use base64Data here
          email,
          fullname,
          username,
          bio,
          phone,
          country: place,
          
        };

        postToDatabase(data);
      });
    }
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
      console.log("data : ",data)
      const res = await axiosInstance.post(
        "http://localhost:4000/create-profile",
        data
      );

      if (res.status === 200) {
        dispatch(updateUser(res.data.updatedUser));
        toast.success(res.data.message);
        router.push("/home");
      } else {
        toast.error(res.data.error || "Unknown error occurred");
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error("Error in profile creation");
      }
    }
  }

  function validatePhoneNumber(phoneNumber) {
    var phoneRegex = /^\d{10}$/;
    if (phoneRegex.test(phoneNumber)) {
      return true;
    } else {
      return false;
    }
  }
  const hanldePhone = (e) => {
    if (validatePhoneNumber(e.target.value)) {
      setPhone(e.target.value);
      setPhoneErr(false);
    } else {
      setPhoneErr(true);
    }
  };

  return (
    <ProtectedRoute>
      <ToastContainer
        toastStyle={{ backgroundColor: "#1d2028" }}
        position="bottom-right"
      />
      <div className="w-full h-auto flex justify-center items-center p-5">
        <div className="w-2/5 h-auto  rounded-md bg-semi shadow-lg flex flex-col justify-center items-center p-10">
          <div className="h-full w-full flex flex-col items-center px-16 gap-y-6">
            <h2 className="text-2xl font-bold">Create Profile</h2>

            <input
              ref={inputRef}
              onChange={handleFileChange}
              onClick={() => setPreview(true)}
              accept="image/*"
              className=" my-2 block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
              type="file"
            />
            <div className="bg-blue-400 w-32 h-32 border rounded-full">
              <img
                src={
                  croppedImage
                    ? croppedImage
                    : "https://upload.wikimedia.org/wikipedia/commons/b/b5/Windows_10_Default_Profile_Picture.svg"
                }
                alt="Cropped"
                className="rounded-full"
              />
            </div>

            <Input
              type="text"
              value={fullname}
              label="Fullname"
              labelPlacement="inside"
              variant="bordered"
              size="sm"
              onChange={(e) => {
                setFullname(e.target.value);
              }}
              className="w-full"
            />
            <Input
              type="text"
              label="Username"
              labelPlacement="inside"
              variant="bordered"
              size="sm"
              onChange={(e) => setUsername(e.target.value)}
              className="w-full"
            />
            <Textarea
              variant="bordered"
              label="Add bio"
              onChange={(e) => setBio(e.target.value)}
            />
            <Input
              type="number"
              label="Phone"
              labelPlacement="inside"
              variant="bordered"
              size="sm"
              onChange={hanldePhone}
              className="w-full"
              isInvalid={phoneErr}
              errorMessage={"Invalid phone"}
            />
            <Input
              type="text"
              label="Place"
              labelPlacement="inside"
              variant="bordered"
              size="sm"
              onChange={(e) => setPlace(e.target.value)}
              className="w-full"
            />
           

           
              <Button className="w-full" onClick={handleSubmit}>
                Create
              </Button>
         
          </div>
        </div>
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
    </ProtectedRoute>
  );
};

export default CreateProfileForm;

const ListboxWrapper = ({ children }) => (
  <div className="w-full border-small px-1 py-2 rounded-small border-default-200 dark:border-default-100">
    {children}
  </div>
);
