import React from "react";
import SystemStatusList from "../SystemStatusList/SystemStatusList";
import SystemStatusCard from "../SystemStatusCard/SystemStatusCard";

const Content = () => {
  return (
    <div className="flex pr-4 h-full">
      <SystemStatusList />
      <SystemStatusCard />
    </div>
  );
};

export default Content;
