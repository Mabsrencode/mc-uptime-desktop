import React from "react";

const PingStatus: React.FC<{ up: boolean }> = ({ up }) => {
  return (
    <span className="relative flex h-5 w-5">
      <span
        className={`animate-ping absolute inline-flex h-full w-full rounded-full ${
          up ? "bg-white" : "bg-red-500"
        }  opacity-75`}
      ></span>
      <span
        className={`relative inline-flex rounded-full h-5 w-5 ${
          up ? "bg-green-500" : "bg-red-500/80"
        }`}
      ></span>
    </span>
  );
};

export default PingStatus;
