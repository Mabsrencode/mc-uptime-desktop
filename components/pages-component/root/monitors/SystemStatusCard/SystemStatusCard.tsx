"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { MdError } from "react-icons/md";

interface SiteStatus {
  id: string;
  up: boolean;
  checkedAt: string;
  error?: string;
}

interface SiteStatusData {
  sites: SiteStatus[];
}

const fetchMonitorStatus = async (): Promise<SiteStatus[]> => {
  const response = await fetch("/api/monitor/status");
  if (!response.ok) throw new Error("Failed to fetch monitor status");

  const data: SiteStatusData = await response.json();

  return Array.isArray(data.sites) ? data.sites : [];
};

const SystemStatusCard: React.FC = () => {
  const {
    data: monitors,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["monitorStatus"],
    queryFn: fetchMonitorStatus,
    refetchInterval: 10000,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading data</div>;
  if (!monitors || monitors.length === 0)
    return <div>No monitors available.</div>;

  const downSites = monitors.filter((site) => !site.up);
  const upSites = monitors.filter((site) => site.up);

  const totalMonitors = monitors.length;
  const uptimePercentage =
    totalMonitors > 0
      ? ((upSites.length / totalMonitors) * 100).toFixed(3)
      : "0.000";

  return (
    <div className="flex flex-col gap-4 mt-6 w-[300px] sticky top-6 h-full">
      <div className="bg-green-950/90 text-white p-4 rounded-lg ">
        <p className="font-semibold text-lg">Current status.</p>
        <div className="flex items-center justify-between mt-2">
          <div className="text-red-500 text-xl font-bold">
            {downSites.length}
          </div>
          <div className="text-green-500 text-xl font-bold">
            {upSites.length}
          </div>
          <div className="text-gray-400 text-xl font-bold">0</div>
        </div>
        <p className="text-gray-400 text-sm">
          Using {totalMonitors} of 50 monitors.
        </p>
      </div>

      <div className="bg-green-950/90 text-white p-4 rounded-lg ">
        <p className="font-semibold text-lg">Last 24 hours.</p>
        <div className="flex flex-col mt-2 gap-2">
          <div className="flex items-center justify-between">
            <span
              className={`${
                uptimePercentage.includes("100")
                  ? "text-green-500"
                  : "text-red-500"
              }  font-bold`}
            >
              {uptimePercentage}%
            </span>
            <span className="text-gray-400 text-sm">Overall uptime</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-white font-bold">{downSites.length}</span>
            <span className="text-gray-400 text-sm">Incidents</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-white font-bold">22h, 15m</span>
            <span className="text-gray-400 text-sm">Without incid.</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-white font-bold">1</span>
            <span className="text-gray-400 text-sm">Affected mon.</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemStatusCard;
