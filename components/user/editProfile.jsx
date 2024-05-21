'use client'
import React, { useCallback, useState, useRef, useEffect } from "react";
import ProtectedRoute from "../../components/user/ProtectedRoute";
import { Input, Textarea, Button, Chip, Avatar } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import axiosInstance from "../user/axiosConfig";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CropModal from "./cropModal";
import getCroppedImg from "../../helpers/croppedImage";
import { useDispatch, useSelector } from "react-redux";
import {
  RadioGroup,
  Radio,
  Listbox,
  ListboxItem,
  Image, // Corrected import
} from "@nextui-org/react";
import { updateUser } from "../../redux/reducers/user";

const EditProfile = () => {
  const dispatch = useDispatch();
  const inputRef = useRef(null);
  const router = useRouter();
  const currentUser = useSelector(state => state.user.currentUser);
  const [user, setUser] = useState(currentUser); // Moved setUser inside component
  const [allServices, setAllServices] = useState([]);
  const [fullname, setFullname] = useState(currentUser?.fullname);
  const [username, setUsername] = useState(currentUser?.username);
  const [phone, setPhone] = useState(currentUser?.phone);
  const [services, setServices] = useState(currentUser?.services);
  const [selectedKeys, setSelectedKeys] = useState(new Set(services.map(service => service._id))); 
  const [bio, setBio] = useState(currentUser?.bio);
  const [place, setPlace] = useState(currentUser?.country);
  const [image, setImage] = useState();
  const [crop, setCrop] = useState({ aspect: 1 / 1 });
  const [croppedImage, setCroppedImage] = useState(currentUser?.profileImg);
  const [showModal, setShowModal] = useState(false);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axiosInstance.get("http://localhost:4000/getServices");
        if (res.status === 200) {
          setAllServices(res.data.services);
        } 
      } catch (error) {
        toast.error(error);
      }
    };
    fetchData();
  }, []);

  const handleClose = (serviceToRemove) => {
    setServices(services.filter((service) => service !== serviceToRemove));
    setSelectedKeys(new Set(services.map(service => service._id)))
  };

  const onCropChange = useCallback((crop, croppedAreaPixels) => {
    setCrop(crop);
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleCloseModal = () => {
    setShowModal(false);
    setImage(null);
    setCrop({ aspect: 1 / 1 });
    setCroppedAreaPixels(null);
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedImage = e.target.files[0];
      if (selectedImage.type === "image/png" || selectedImage.type === "image/jpeg") {
        setImage(selectedImage);
        setShowModal(true);
      } else {
        toast.error("Only PNG and JPEG image files are allowed for the Profile image.");
      }
    }
  };

  const handleCropImage = async (e) => {
    e.preventDefault();
    try {
      if (croppedAreaPixels && image) {
        const croppedImageBase64 = await getCroppedImg(image, croppedAreaPixels);
        setCroppedImage(croppedImageBase64);
        setShowModal(false);
      }
    } catch (error) {
      console.error("Error cropping image:", error);
    }
  };

  const handleSubmit = async () => {
    const data = {
      profilePic: croppedImage,
      email: user.email,
      fullname,
      username,
      bio,
      phone,
      country: place,
      updatedServices: [...selectedKeys],
    };

    try {
      const res = await axiosInstance.post("http://localhost:4000/edit-profile", data);

      if (res.status === 200) {
        console.log("updated user :",res.data.updatedUser)
        dispatch(updateUser(res.data.updatedUser))
        // localStorage.setItem("currentUser", JSON.stringify(res.data?.updatedUser));
        toast.success(res.data.message);
        router.push("/profile");
      } else {
        toast.error(res.data.error);
      }
    } catch (error) {
      toast.error("Error in Updating");
    }
  };

  return (
    <ProtectedRoute>
      <ToastContainer toastStyle={{ backgroundColor: "#1d2028" }} position="bottom-right" />
      <div className="w-full h-auto flex justify-center items-center p-5 ">
        <div className="mt-36 w-3/5 h-auto bg rounded-md bg-semi shadow-lg flex flex-col justify-center items-center p-10 ">
          <div className="h-full w-full flex flex-col items-center px-16 gap-y-6 ">
            <h2 className="text-2xl font-bold pt-16">Edit Profile</h2>
            <Avatar src={croppedImage} className="rounded-full w-20 h-20" />
            <Input
              ref={inputRef}
              onChange={handleFileChange}
              type="file"
              size="sm"
              name="image"
              className="w-full"
              onClick={() => setShowModal(true)}
            />
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
            <div className="flex gap-2">
              <p>Services : </p>
              {services.map((service, index) => (
                <Chip key={index} onClose={() => handleClose(service)} variant="flat">
                  {service.serviceName}
                </Chip>
              ))}
               
            </div>
            <div className="flex flex-col items-center  gap-y-6 w-full">
                <p>Add service </p>
                <ListboxWrapper>
                  <Listbox
                    aria-label="Multiple selection example"
                    variant="flat"
                    disallowEmptySelection
                    selectionMode="multiple"
                    selectedKeys={selectedKeys}
                    onSelectionChange={setSelectedKeys}
                  >
                    {allServices.map((service)=>(
                      <ListboxItem key={service._id}>
                    { service.serviceName}
                    </ListboxItem>
                    ))}
                   
                  </Listbox>
                </ListboxWrapper>
                {/* <p className="text-small text-default-500">
                  Selected Service: {...selectedKeys}
                </p> */}
              </div>
            <div className="w-full flex gap-x-4">
              <Button className="w-1/2" onClick={() => router.push("/profile")}>Cancel</Button>
              <Button className="w-1/2" onClick={handleSubmit}>Submit</Button>
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
          onClose={handleCloseModal}
          onCropImage={handleCropImage}
        />
      )}
    </ProtectedRoute>
  );
};

export default EditProfile;

const ListboxWrapper = ({ children }) => (
  <div className="w-full border-small px-1 py-2 rounded-small border-default-200 dark:border-default-100">
    {children}
  </div>
);