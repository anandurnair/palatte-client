"use client";
import React, { useEffect, useState } from "react";
import ReactCrop from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import Cropper from "react-easy-crop";

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
import axios from "axios";





const CreateProfileForm = () => {
  const router = useRouter();
  const [selectedKeys, setSelectedKeys] = useState(new Set([]));
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [place, setPlace] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [isFreelance, setFreelance] = useState("no");
  const [crop, setCrop] = useState({  unit: '%', // Can be 'px' or '%'
  x: 25,
  y: 25,
  width: 50,
  height: 50 });
  const [zoom, setZoom] = useState(1);
  const [previewSource, setPreviewSource] = useState(null);
  const [aspect, setAspect] = useState(4 / 3); // Dynamic aspect ratio

  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    const user = JSON.parse(storedUser);
    setFullname(user?.fullname);
    setEmail(user?.email);  
  }, []);

  const handleProfilePhoto = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image")) {
      previewFile(file);
    } else {
      alert("Please select an image file.");
    }
  };

  const previewFile = (file) => { 
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setPreviewSource(reader.result);
    };
  };

  const onCropComplete = (croppedArea, croppedAreaPixels) => {
    console.log(croppedArea, croppedAreaPixels);
  };

  const handleSubmit = async (e) => {
    console.log("Crop :",email)
    e.preventDefault();
    const data = {
      profilePic: previewSource,  
      email,
      fullname,
      username,
      bio,
      phone,
      country: place,
      isFreelance,
      selectedKeys: [...selectedKeys],
    };

    try {
      const res = await axios.post("http://localhost:4000/create-profile", data)

      if (res.status === 200) {
        localStorage.setItem('currentUser',JSON.stringify(res.data.updatedUser))
        alert(res.data.message);
          console.log('New user',res.data.updatedUser)
          router.push('/home');
      } else {
        alert(res.data.error);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="w-full h-auto flex justify-center items-center p-5">
      <div className="w-2/5 h-auto bg rounded-md bg3 shadow-lg flex flex-col justify-center items-center p-10">
        <div className="h-full w-full flex flex-col items-center px-16 gap-y-6">
          <h2 className="text-2xl font-bold">Create Profile</h2>

          <Input
            type="file"
            size="sm"
            name="image"
            onChange={handleProfilePhoto}
            className="w-full"
          />
          {
            previewSource && (
              <ReactCrop crop={crop} onChange={c => setCrop(c)}>
              <img src={previewSource } />
            </ReactCrop>
             
            )
          }
         
          <Input
            type="text"
            value={fullname}
            label="Fullname"
            labelPlacement="inside"
            variant="bordered"
            size="sm"
            onChange={(e) => setFullname(e.target.value)}
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
            onChange={(e) => setPhone(e.target.value)}
            className="w-full"
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
          <RadioGroup
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
                  <ListboxItem key="Graphic design">Graphic design</ListboxItem>
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
          )}

          <Button className="w-full" onClick={handleSubmit}>
            Create
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateProfileForm;

const ListboxWrapper = ({ children }) => (
  <div className="w-full border-small px-1 py-2 rounded-small border-default-200 dark:border-default-100">
    {children}
  </div>
);
