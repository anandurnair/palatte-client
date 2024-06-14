import React, { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Scatter,
  ScatterChart,
  LineChart,
  PieChart,
  Pie,
  PolarAngleAxis,
  Radar,
  RadarChart,
  PolarGrid,
  PolarRadiusAxis,
} from "recharts";
import {Select, SelectItem} from "@nextui-org/react";

import axiosInstance from "../user/axiosConfig";
const GraphComponent = () => {
    const [update,setUpade] = useState(false)
    const [transactionData,setTransactionData] = useState([])
    const [serviceCounts,setServiceCounts] = useState([])
    const [selectedFilter,setSelectedFilter] = useState(new Set(["yearly"]))
    useEffect(()=>{
        const fetchData=async()=>{
            try {
                const res = await axiosInstance.get(`/get-service-counts`);
                setServiceCounts(res.data.serviceOrderCount)
            } catch (error) {
                console.log(error)
            }
        }
        fetchData()
    },[update])
    useEffect(()=>{
        const fetchData =async ()=>{
            try {
                const res = await axiosInstance.get(`/get-transactions?filter=${selectedFilter}`);
                const completedOrders = res.data.orders;
                let month ;
                if(selectedFilter == "monthly"){

                   months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
                }else if(selectedFilter === "yearly"){
                  months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

                }
                const aggregatedData = completedOrders.reduce((acc, order) => {
                    const date = new Date(order.createdAt);
                    const month = date.getMonth();
                    const amount = order.plan.price;
                
                    if (!acc[month]) {
                        acc[month] = {
                            month: months[month],
                            transactions: 0
                        };
                    }
                
                    acc[month].transactions += amount;
                
                    return acc;
                }, {});
                
                const data = Object.values(aggregatedData);
                console.log("Data : ",data)
                setTransactionData(data)
            } catch (error) {
                console.log(error)
            }
        }
        fetchData()
    },[update,selectedFilter])

  
   
  
  return (
    <div className="w-full h-auto bg-semiDark  flex flex-col items-center gap-10 p-10 rounded-lg">
      <div className="w-full flex flex-col gap-2 items-center">
        <h1 className="text-lg font-bold">Tranactions</h1> 
        <Select 
        label="select" 
        selectedKeys={selectedFilter}
        className="max-w-xs" 
        onSelectionChange={setSelectedFilter}
      >
       
          <SelectItem key="yearly">
            Yearly
          </SelectItem>
          <SelectItem key="monthly">
            Monthly 
          </SelectItem>
          <SelectItem key="weekly">
            Weekly
          </SelectItem>
       
      </Select>
        <LineChart width={1000} height={300} data={transactionData}>
          <CartesianGrid></CartesianGrid>
          <XAxis dataKey="month"></XAxis>
          <YAxis></YAxis>
          <Tooltip> </Tooltip>
          <Legend></Legend>
          <Line type="monotone" dataKey="transactions" stroke="#00B9AE" />
          {/* <Line type="monotone" dataKey="savings" stroke="red" /> */}
        </LineChart>
      </div>


      <div className="w-full flex flex-col items-center">
        <h1>Service order count</h1>
        <BarChart width={1000} height={300} data={serviceCounts}>
          <CartesianGrid></CartesianGrid>
          <XAxis dataKey="serviceName"></XAxis>
          <YAxis></YAxis>
          <Tooltip> </Tooltip>
          <Legend></Legend>
          {/* <Bar type="monotone" dataKey="savings" fill="blue" /> */}
          <Bar type="monotone" dataKey="orderCount" fill="#00B9AE" />
        </BarChart>
      </div>
      
    </div>
  );
};

export default GraphComponent;
