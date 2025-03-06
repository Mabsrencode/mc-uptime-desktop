"use client";
import React from "react";
import { useQuery } from "@tanstack/react-query";
const handleGetAllSystemStatus = async () => {
  try {
    const response = await fetch("/api/monitor");
    return response.json();
  } catch (error) {
    console.log(error);
  }
};
const SystemStatusListTable = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["monitors"],
    queryFn: handleGetAllSystemStatus,
  });

  return <div>SystemStatusListTable</div>;
};

export default SystemStatusListTable;
