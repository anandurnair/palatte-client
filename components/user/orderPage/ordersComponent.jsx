"use client";

import React from "react";
import ProtectedRoute from "../../user/ProtectedRoute";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Tabs,
  Tab,
  Card,
  CardBody,
  RadioGroup,
  Radio,
} from "@nextui-org/react";

const OrdersComponent = () => {
  return (
    <ProtectedRoute>
      <div className="w-full h-full flex flex-col  items-center rounded-lg px-20 my-5">
       
          <div className="flex w-full flex-col">
            <Tabs aria-label="Options" placement="top" className="w-full">
              <Tab key="latest-order" title="New Orders" className="w-full">
                <Card>
                  <CardBody className="h-96">
                    <div className="w-full h-full flex items-center justify-center">
                        <h2 className="text-2xl text-neutral-600">New orders</h2>
                    </div>
                  </CardBody>
                </Card>
              </Tab>
              <Tab key="order-history" title="Order history">
                <Card>
                  <CardBody className="h-96">
                  <div className="w-full h-full flex items-center justify-center">
                        <h2 className="text-2xl text-neutral-600">Order history</h2>
                    </div>
                  </CardBody>
                </Card>
              </Tab>
            </Tabs>
          </div>
        </div>
      
    </ProtectedRoute>
  );
};

export default OrdersComponent;
