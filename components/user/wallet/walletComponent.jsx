"use client";
import React, { useEffect, useState } from "react";
import ProtectedRoute from "../ProtectedRoute";
import { Card, CardBody, Divider, Input } from "@nextui-org/react";
import { MdCurrencyRupee } from "react-icons/md";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { loadStripe } from "@stripe/stripe-js";
import axiosInstance from "../axiosConfig";
import { useDispatch, useSelector } from "react-redux";

const WalletComponent = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.user.currentUser);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [addAmount, setAddAmount] = useState("");
  const [wallet, setWallet] = useState();
  const [update, setUpdate] = useState(false);
  const stripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  );

  useEffect(() => {
    const fetchWalletData = async () => {
      try {
        const res = await axiosInstance.get(
          `/get-wallet-by-userId?userId=${currentUser._id}`
        );
        setWallet(res.data.wallet);
        console.log("wallet :", res.data.wallet);
      } catch (error) {
        alert(error);
      }
    };
    fetchWalletData();
  }, [currentUser, update]);

  const handleAddMoney = async () => {
    try {
      const amount = parseFloat(addAmount);
      console.log("amount ", amount);
      if (isNaN(amount) || amount <= 0) {
        toast.error("Please enter a valid amount");
        return;
      }

      const res = await axiosInstance.post("/add-wallet-amount", {
        addAmount: amount,
        userId: currentUser._id,
      });

      const stripe = await stripePromise;
      const { error } = await stripe.redirectToCheckout({
        sessionId: res.data.id,
      });

      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Successfully added");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <ProtectedRoute>
      <ToastContainer
        toastStyle={{ backgroundColor: "#1d2028" }}
        position="bottom-center"
      />
      <div className="w-full h-auto flex flex-col items-center rounded-lg my-5">
        <div className="w-3/5 h-auto bg-semi flex flex-col items-center rounded-lg z-10 shadow-2xl">
          <Card className="w-full py-2">
            <CardBody className="w-full flex items-center justify-center">
              <p className="text-2xl font-semibold">Wallet</p>
            </CardBody>
          </Card>
          <div className="w-full flex flex-col p-5 gap-3 items-center">
            <h2>Balance</h2>
            <div className="flex">
              <MdCurrencyRupee size={30} />
              <h2 className="text-3xl font-semibold items-center justify-center">
                {wallet?.balance}.00
              </h2>
            </div>
            <div>
              <Button variant="bordered" className="btn" onPress={onOpen}>
                Add money
              </Button>
            </div>
          </div>
          <Card className="w-full py-2">
            <CardBody className="w-full flex items-center justify-center">
              <p className="text-lg font-semibold">Transactions</p>
            </CardBody>
          </Card>
          <div className="w-full h-72 p-5 overflow-y-auto">
            {wallet?.transactions.length === 0 ? (
              <p>No transactions yet</p>
            ) : (
              wallet?.transactions
                .slice()
                .reverse()
                .map((transaction, index) => (
                  <div
                    key={index}
                    className={`w-full py-2 px-10 ${
                      transaction.type == "credit"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    <div className="w-full flex justify-between ">
                      <p className="text-lg text-neutral-300">
                        {transaction.payer?.fullname ?? "Bank"}
                      </p>
                      <div className="flex justify-center items-center">
                        <MdCurrencyRupee size={20} />
                        <p className="text-lg font-semibold">
                          {" "}
                          {transaction?.amount}.00
                        </p>
                      </div>
                    </div>
                    <div className="w-full flex justify-between ">
                      <p className="text-neutral-400 text-sm">
                        {transaction?.type}
                      </p>
                      <p className="text-sm text-neutral-400">
                        {transaction?.date}
                      </p>
                    </div>
                    <Divider className="my-4" />
                  </div>
                ))
            )}
          </div>
        </div>
      </div>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Add money
              </ModalHeader>
              <ModalBody>
                <Input
                  type="number"
                  label="Enter Amount"
                  value={addAmount}
                  onChange={(e) => setAddAmount(e.target.value)}
                  placeholder="0.00"
                  labelPlacement="outside"
                  startContent={
                    <div className="pointer-events-none flex items-center">
                      <span className="text-default-400 text-small">
                        <MdCurrencyRupee size={16} />
                      </span>
                    </div>
                  }
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  color=""
                  variant="bordered"
                  onPress={onClose}
                  onClick={handleAddMoney}
                >
                  Continue
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </ProtectedRoute>
  );
};

export default WalletComponent;

const AddMoneyModal = () => {
  return <></>;
};
