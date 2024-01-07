'use client'
import { BarLoader } from "react-spinners";

export default () => {
  return (
    <div className="flex min-h-full items-center justify-center text-center">
      <BarLoader width={"100%"} color="#0284c7" loading />
    </div>
  );
};
