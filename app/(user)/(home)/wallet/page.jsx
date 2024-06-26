import React from "react";
import WalletComponent from "@/components/user/wallet/walletComponent";
const WalletPage = () => {
  return (
    <div className=" purple-dark h-full bg-background text-foreground  flex flex-col justify-center overflow-scroll">
      <WalletComponent />
    </div>
  );
};

export default WalletPage;
