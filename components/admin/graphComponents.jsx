'use client'

import React, { useEffect, useState } from "react";
import {
  LineChart,
  BarChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { Select, SelectItem } from "@nextui-org/react";

import axiosInstance from "../user/axiosConfig";

const GraphComponent = () => {
  const [transactionData, setTransactionData] = useState([]);
  const [serviceCounts, setServiceCounts] = useState([]);
  const [transactionFilter, setTransactionFilter] = useState(new Set(["yearly"]));
  const [serviceFilter, setServiceFilter] = useState(new Set(["yearly"]));

  useEffect(() => {
    const fetchServiceData = async () => {
      try {
        const res = await axiosInstance.get(`/get-service-counts`);
        setServiceCounts(res.data.serviceOrderCount);
      } catch (error) {
        console.log(error);
      }
    };
    fetchServiceData();
  }, [serviceFilter]);

  useEffect(() => {
    const fetchTransactionData = async () => {
      try {
        const filter = Array.from(transactionFilter).join("");
        const res = await axiosInstance.get(`/get-transactions?filter=${filter}`);
        const completedOrders = res.data.orders;
        console.log("Orders  : ", completedOrders);

        let aggregatedData;
        if (filter === "monthly") {
          aggregatedData = aggregateData(completedOrders, "month");
        } else if (filter === "yearly") {
          aggregatedData = aggregateData(completedOrders, "year");
        } else if (filter === "weekly") {
          aggregatedData = aggregateData(completedOrders, "week");
        }

        setTransactionData(aggregatedData);
      } catch (error) {
        console.log(error);
      }
    };
    fetchTransactionData();
  }, [transactionFilter]);

  const aggregateData = (orders, type) => {
    const result = [];
    if (type === "month") {
      const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
      const aggregatedData = orders.reduce((acc, order) => {
        const date = new Date(order.createdAt);
        const month = date.getMonth();
        const amount = order.plan.price;

        if (!acc[month]) {
          acc[month] = { month: months[month], transactions: 0 };
        }

        acc[month].transactions += amount;
        return acc;
      }, {});

      result.push(...Object.values(aggregatedData));
    } else if (type === "year") {
      const aggregatedData = orders.reduce((acc, order) => {
        const date = new Date(order.createdAt);
        const year = date.getFullYear();
        const amount = order.plan.price;

        if (!acc[year]) {
          acc[year] = { year, transactions: 0 };
        }

        acc[year].transactions += amount;
        return acc;
      }, {});

      result.push(...Object.values(aggregatedData));
    } else if (type === "week") {
      const aggregatedData = orders.reduce((acc, order) => {
        const date = new Date(order.createdAt);
        const week = getWeekNumber(date);
        const amount = order.plan.price;

        if (!acc[week]) {
          acc[week] = { week: `Week ${week}`, transactions: 0 };
        }

        acc[week].transactions += amount;
        return acc;
      }, {});

      result.push(...Object.values(aggregatedData));
    }

    return result;
  };

  const getWeekNumber = (date) => {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  };

  return (
    <div className="w-full h-auto bg-semiDark flex flex-col items-center gap-10 p-10 rounded-lg">
      <div className="w-full flex flex-col gap-2 items-center">
        <h1 className="text-lg font-bold">Transactions</h1>
        <Select
          label="Select"
          selectedKeys={transactionFilter}
          className="max-w-xs"
          onSelectionChange={(keys) => setTransactionFilter(new Set(keys))}
        >
          <SelectItem key="yearly">Yearly</SelectItem>
          <SelectItem key="monthly">Monthly</SelectItem>
          <SelectItem key="weekly">Weekly</SelectItem>
        </Select>
        <LineChart width={1000} height={300} data={transactionData}>
          <CartesianGrid />
          <XAxis dataKey={Array.from(transactionFilter).join("") === "yearly" ? "year" : Array.from(transactionFilter).join("") === "monthly" ? "month" : "week"} />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="transactions" stroke="#00B9AE" />
        </LineChart>
      </div>

      <div className="w-full flex flex-col items-center">
        <h1>Service Order Count</h1>
        {/* <Select
          label="Select"
          selectedKeys={serviceFilter}
          className="max-w-xs"
          onSelectionChange={(keys) => setServiceFilter(new Set(keys))}
        >
          <SelectItem key="yearly">Yearly</SelectItem>
          <SelectItem key="monthly">Monthly</SelectItem>
          <SelectItem key="weekly">Weekly</SelectItem>
        </Select> */}
        <BarChart width={1000} height={300} data={serviceCounts}>
          <CartesianGrid />
          <XAxis dataKey="serviceName" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar type="monotone" dataKey="orderCount" fill="#00B9AE" />
        </BarChart>
      </div>
    </div>
  );
};

export default GraphComponent;
