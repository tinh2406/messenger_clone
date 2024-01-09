"use client";
import { BarLoader } from "react-spinners";
import useLoading from "../hooks/useLoading";

export default () => {
  const { isLoading } = useLoading();
  
  if (isLoading)
    return (
      <div className="flex w-[100vw] fixed z-50 items-center justify-center text-center top-0">
        <BarLoader width={"100%"} color="#0284c7" loading speedMultiplier={0.5}/>
      </div>
    );
  return null;
};
