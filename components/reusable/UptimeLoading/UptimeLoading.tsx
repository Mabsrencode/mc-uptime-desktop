import React from "react";

const UptimeLoading = () => {
  return (
    <div className="flex justify-center items-center w-full">
      <span className="relative flex h-20 w-20">
        <span
          className={`animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75`}
        ></span>
        <span
          className={`relative inline-flex rounded-full h-20 w-20 bg-green-500`}
        ></span>
      </span>
    </div>
  );
};

export default UptimeLoading;
