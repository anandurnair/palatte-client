"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import ProtectedRoute from "../../components/user/ProtectedRoute";
import {
  Input,
  RadioGroup,
  Radio,
  Button,
  Textarea,
  Listbox,
  ListboxItem,
  Image,
  Avatar, // Corrected import
} from "@nextui-org/react";
import "../style.css";
import { useRouter } from "next/navigation";
import axiosInstance from "../user/axiosConfig";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CropModal from "./cropModal";
import getCroppedImg from "../../helpers/croppedImage";
import { useSelector } from "react-redux";

const EditProfile = () => {
  const inputRef = useRef(null);

  const router = useRouter();
  const user = useSelector(state => state.user.currentUser);

  const [fullname, setFullname] = useState(user.fullname);
  const [username, setUsername] = useState(user.username);
  const [phone, setPhone] = useState(user.phone);
  const [bio, setBio] = useState(user.bio);
  const [place, setPlace] = useState(user.country);
  const [image, setImage] = useState();
  const [crop, setCrop] = useState({ x: 0, y: 0, width: 100, height: 100 }); // Initial crop with default values
  const [croppedImage, setCroppedImage] = useState(user.profileImg);
  const [preview, setPreview] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

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
  const handleSubmit = async () => {
    if (croppedAreaPixels && image) {
      const croppedImageBase64 = await getCroppedImg(image, croppedAreaPixels);
      setShowModal(false);
      setPreview(false);
  
      // Call the function to convert blob URL to Base64 Data URI
      blobUrlToBase64(croppedImageBase64, function (base64Data) {
        setCroppedImage(base64Data);
        console.log("img", base64Data);
  
        // Data posting logic
        const data = {
          profilePic: base64Data,
          email: user.email,
          fullname,
          username,
          bio,
          phone,
          country: place,
        };
  
        postToDatabase(data); // Call function to post data to database
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
      const res = await axiosInstance.post(
        "http://localhost:4000/edit-profile",
        data
      );

      if (res.status === 200) {
        localStorage.setItem(
          "currentUser",
          JSON.stringify(res.data?.updatedUser)
        );
        toast.success(res.data.message);
        router.push("/profile");
      } else {
        toast.error(res.data.error);
      }
    } catch (error) {
      toast.error("Error in Updating");
    }
  }


  const handleCancel = () => {
    router.push("/profile");
  };
  return (
    <ProtectedRoute>
      <ToastContainer
        toastStyle={{ backgroundColor: "#1d2028" }}
        position="bottom-right"
      />

      <div className="w-full h-auto flex justify-center items-center p-5">
        <div className="w-3/5 h-auto bg rounded-md bg-semi shadow-lg flex flex-col justify-center items-center p-10">
          <div className="h-full w-full flex flex-col items-center px-16 gap-y-6">
            <h2 className="text-2xl font-bold pt-16">Edit Profile</h2>
            <Avatar src={croppedImage} className="rounded-full w-20 h-20" />
            <Input
            ref={inputRef}
            onChange={handleFileChange}
            type="file"
              size="sm"
              name="image"
              className="w-full"
              onClick={() => setPreview(true)}

            />
            {/* {previewSource && (
              <ReactCrop crop={crop} onChange={(c) => setCrop(c)}>
                <img src={previewSource} />
              </ReactCrop>
            )} */}

            <Input
              type="text"
              value={fullname}
              label="Fullname"
              labelPlacement="inside"
              variant="bordered"
              size="sm"
              className="w-full"
              onChange={(e) => setFullname(e.target.value)}
            />
            <Input
              type="text"
              label="Username"
              value={username}
              labelPlacement="inside"
              variant="bordered"
              size="sm"
              className="w-full"
              onChange={(e) => setUsername(e.target.value)}
            />
            <Textarea
              value={bio}
              variant="bordered"
              label="Add bio"
              onChange={(e) => setBio(e.target.value)}
            />
            <Input
              value={phone}
              type="number"
              label="Phone"
              labelPlacement="inside"
              variant="bordered"
              size="sm"
              className="w-full"
              onChange={(e) => setPhone(e.target.value)}
            />
            <Input
              value={place}
              type="text"
              label="Place"
              labelPlacement="inside"
              variant="bordered"
              size="sm"
              className="w-full"
              onChange={(e) => setPlace(e.target.value)}
            />
            {/* <RadioGroup
              label="Do you want to offer your services as a freelancer?"
              orientation="horizontal"
            >
              <Radio value="yes" onClick={() => setFreelance("yes")}>
                Yes
              </Radio>
              <Radio value="no" onClick={() => setFreelance("no")}>
                No
              </Radio>
            </RadioGroup>

            {isFreelance === "yes" && (
              <div className="flex flex-col items-center  gap-y-6 w-full">
                <p>Select a service</p>
                <ListboxWrapper>
                  <Listbox
                    aria-label="Multiple selection example"
                    variant="flat"
                    disallowEmptySelection
                    selectionMode="multiple"
                    selectedKeys={selectedKeys}
                    onSelectionChange={setSelectedKeys}
                  >
                    <ListboxItem key=" Custom artwork commissions">
                      Custom artwork commissions
                    </ListboxItem>
                    <ListboxItem key="Graphic design">
                      Graphic design
                    </ListboxItem>
                    <ListboxItem key="Handmade crafts">
                      Handmade crafts
                    </ListboxItem>
                    <ListboxItem key="Crafting tutorials or workshops">
                      Crafting tutorials or workshops
                    </ListboxItem>
                  </Listbox>
                </ListboxWrapper>
                <p className="text-small text-default-500">
                  Selected value: {Array.from(selectedKeys).join(", ")}
                </p>
              </div>
            )} */}
            <div className="w-full flex gap-x-4">
              <Button className="w-1/2" onClick={handleCancel}>
                Cancel
              </Button>
              <Button className="w-1/2" onClick={handleSubmit}>
                Edit
              </Button>
            </div>
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

export default EditProfile;
