"use client";
import React, { useEffect, useState } from "react";
import {
  Input,
  RadioGroup,
  Radio,
  Button,
  Textarea,
  Listbox,
  ListboxItem,
} from "@nextui-org/react";
import "../style.css";
// import AvatarEditor from 'react-avatar-editor'
// import { tree } from "next/dist/build/templates/app-page";

const CreateProfileForm = () => {
  const [selectedKeys, setSelectedKeys] =  useState(new Set([]));
  const [fullname, setFullname] = useState('');
  useEffect( () => {
    const storedUser = localStorage.getItem("currentUser");
    const user = JSON.parse(storedUser);

    console.log('curent  :',user.fullname)
    setFullname(user.fullname);
    setEmail(user.email)
    console.log('User name : ',fullname)
  }, [fullname]);
  const [email,setEmail] =useState()
  const [phone,setPhone]= useState()
  const [place,setPlace] = useState()
  const [username, setUsername] = useState();
  const [bio, setBio] = useState();
  const [isFreelance, setFreelance] = useState("no");

  const selectedValue = React.useMemo(
    () => Array.from(selectedKeys).join(", "),
    [selectedKeys]
  );


  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Working");
    console.log(email,fullname,username, bio,isFreelance,[...selectedKeys] );
    const res = await fetch("http://localhost:4000/create-profile", {
      method: "POST", // Set method to POST
      body: JSON.stringify({email,fullname, username, bio, phone,country:place, isFreelance, selectedKeys }), // Add data to the body
      headers: {
        "Content-Type": "application/json", // Set content type header
      },
    });
    const data = await res.json();
    if (res.ok) {
      alert(data.message)      
    } else {
      alert(data.error);
    }
  };
  return (
    <div className=" w-full h-full flex justify-center items-center p-5">
      <div className="w-2/5 h-full bg rounded-md bg3 shadow-lg flex flex-col justify-center items-center p-10 ">
        <div className="h-full w-full flex flex-col items-center px-16 gap-y-6">
          <h2 className="text-2xl font-bold">Create Profile</h2>

          <Input

            type="file"
            size="sm"
            // onChange={(e) => setFullname(e.target.value)}
            className="w-full"
          />
          <Input
            type="text"
            defaultValue={fullname}
            labelPlacement="inside"
            variant="bordered"
            size="sm"
            onChange={(e) => setFullname(e.target.value)}
            className="w-full"
          />
          <Input type="text"
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

            // placeholder="Enter your description (Default autosize)"
          />
           <Input type="number"
            label="Phone"
            labelPlacement="inside"
            variant="bordered"
            size="sm"
            onChange={(e) => setPhone(e.target.value)}
            className="w-full"
          />
          <Input type="text"
            label="Place"
            labelPlacement="inside"
            variant="bordered"
            size="sm"
            onChange={(e) => setPlace(e.target.value)}
            className="w-full"
          />
          <RadioGroup
            label="Do you want to offer your services as a freelancer?      "
            orientation="horizontal"
          >
            <Radio value="yes" onClick={() => setFreelance("yes")}>
              Yes
            </Radio>
            <Radio value="no" onClick={() => setFreelance("no")}>
              No
            </Radio>
          </RadioGroup>

          {isFreelance === "yes" ? (
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
                Selected value: {selectedKeys}
              </p>
            </div>
          ) : (
            ""
          )}

          <Button className="w-full" onClick={handleSubmit}>Create</Button>
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
