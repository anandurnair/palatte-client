import {Spinner} from "@nextui-org/react";

export default function Loading() {
    // You can add any UI inside Loading, including a Skeleton.
    return (
    <main className="h-lvh text-center flex justify-center items-center">
        <Spinner label="Loading..." color="default" />

    </main>
    )
  }