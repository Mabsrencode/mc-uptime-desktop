"use client";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/useAuthStore";

const SystemStatusListTable = () => {
  const { data: authData } = useAuthStore();
  const userId = authData?.user?.userID;

  const handleGetAllSystemStatus = async () => {
    try {
      const response = await fetch(`/api/monitor?userId=${userId}`);

      console.log(response);
      if (!response.ok) {
        throw new Error("Failed to fetch monitors");
      }
      return response.json();
    } catch (error) {
      console.error("Error fetching monitors:", error);
      throw error;
    }
  };

  const {
    data: monitors,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["monitors", userId],
    queryFn: handleGetAllSystemStatus,
    staleTime: 10000,
  });

  console.log(monitors);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return <div></div>;
};

export default SystemStatusListTable;
