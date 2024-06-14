"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaUsers } from "react-icons/fa";
import { IoIosImages } from "react-icons/io";
import { FaComments } from "react-icons/fa6";
import { MdBorderColor  } from "react-icons/md";
import {Card, CardBody} from "@nextui-org/react";
import GraphComponent from '@/components/admin/graphComponents'
const AdminDashboardComponent = () => {
  const [counts, setCounts] = useState({});

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const res = await axios.get("http://localhost:4000/list-counts");
        setCounts(res.data);
      } catch (error) {
        alert(error);
      }
    };
    fetchCounts();
  }, []);

  return (
    <div className="w-full h-auto p-5 flex flex-col gap-y-5  ">
      <div className="w-full h-auto bg-semiDark text-cyan-500 flex gap-x-6 p-10 rounded-lg">
        <CardComponent
          icon={<FaUsers size={35} />}
          name={"Users"}
          counts={counts.usersCount}
        />
        <CardComponent
          icon={<IoIosImages size={35} />}
          name={"Posts"}
          counts={counts.postCount}
        />
        <CardComponent icon={<FaComments size={35} />} name={"Comments"} counts={counts.commentCount} />
        <CardComponent icon={<MdBorderColor  size={35} />} name={"Orders"} counts={counts.orderCount} />
      </div>

     <GraphComponent/>
    </div>
  );
};

export default AdminDashboardComponent;

const CardComponent = ({ icon, name, counts }) => {
  return (
    <Card  className="w-4/12 h-auto bg-lightDark  rounded-lg p-4 transform transition duration-1000 hover:scale-105 cursor-pointer">
      <CardBody className="flex flex-col justify-between items-center ">
      <div className="flex flex-col items-center ">
        {icon}
        <h1 className="text-lg mt-2">{name}</h1>
      </div>
      <h2 className="text-lg">{counts}</h2>
      </CardBody>
    </Card>
   
  );
};

