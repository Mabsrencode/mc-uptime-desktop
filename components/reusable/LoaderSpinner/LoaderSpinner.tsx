import React from "react";

const LoaderSpinner: React.FC<{ bigger: boolean }> = ({ bigger }) => {
  return (
    <div
      className={`${
        bigger
          ? "h-[24px] w-[24px] border-[3px]"
          : "h-[16px] w-[16px] border-[2px]"
      } mx-auto border-white border-r-transparent rounded-full animate-spin`}
    ></div>
  );
};

export default LoaderSpinner;
