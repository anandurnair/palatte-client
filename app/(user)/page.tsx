import Image from "next/image";
import { Button } from "@nextui-org/react";
import Login from '../../components/user/loginForm'
export default function Home() {
  return (
<div className="purple-dark h-lvh bg-background text-foreground flex flex-col gap-11 items-center"> 
      <Login/>
    </div>
  );
}
