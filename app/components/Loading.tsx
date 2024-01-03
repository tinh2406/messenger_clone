import { memo } from "react";
import { ClipLoader } from "react-spinners";

export default memo(() => {
  return (
    <div className="flex min-h-full items-center justify-center p-4 text-center">
      <ClipLoader size={40} color="#0284c7" />
    </div>
  );
});
