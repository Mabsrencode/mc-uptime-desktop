"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/useAuthStore";

interface Monitor {
  id: string;
  url: string;
  createdAt: string;
  updatedAt: string;
  monitorType: string;
  interval: number;
}

const SystemStatusListTable = () => {
  const { data: authData } = useAuthStore();
  const userId = authData?.user?.userID;

  const fetchMonitors = async (): Promise<Monitor[]> => {
    try {
      const response = await fetch(`/api/monitor?userId=${userId}`);
      const data = await response.json();
      return data.data;
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
    queryKey: ["sites", userId],
    queryFn: fetchMonitors,
    refetchInterval: 10000,
    staleTime: 10000,
    retry: false,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading data.</div>;

  return (
    <div className=" text-white w-full mt-6">
      {monitors && monitors.length === 0 ? (
        <p className="text-gray-400">No monitors available.</p>
      ) : (
        monitors &&
        monitors.map((monitor) => (
          <div
            key={monitor.id}
            className="bg-green-950/90 py-3 px-4 rounded-lg border border-white/20 flex items-center justify-between mb-2"
          >
            <div className="flex items-center gap-4">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <div>
                <p className="text-sm font-semibold">{monitor.url}</p>
                <div className="text-gray-400 text-xs mt-1">
                  <p className="border border-white/20 inline py-[2px] px-[3px] rounded bg-black/40">
                    {monitor.monitorType}
                  </p>
                </div>
              </div>
            </div>

            <div>button</div>
          </div>
        ))
      )}
    </div>
  );
};

export default SystemStatusListTable;
