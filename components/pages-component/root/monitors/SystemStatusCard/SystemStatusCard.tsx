"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/useAuthStore";
import { authFetch } from "@/lib/authFetch";
import { SiteStatus } from "../SystemStatusListTable/SystemStatusListTable";

interface DashboardStats {
  totalMonitors: number;
  upMonitors: number;
  downMonitors: number;
  uptimePercentage: string;
  totalIncidents24h: number;
  affectedMonitors24h: number;
  longestIncidentFreeMinutes: number;
}

interface SystemStatusCardProps {
  monitors: SiteStatus[];
}

function formatMinutes(totalMinutes: number): string {
  if (totalMinutes >= 1440) return "24h, 0m";
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours > 0) return `${hours}h, ${minutes}m`;
  return `${minutes}m`;
}

const SystemStatusCard: React.FC<SystemStatusCardProps> = ({ monitors }) => {
  const { data: authData } = useAuthStore();
  const userId = authData?.user?.userID;

  const { data: stats } = useQuery<DashboardStats>({
    queryKey: ["dashboard-stats", userId],
    queryFn: async () => {
      const res = await authFetch("/api/monitor/dashboard-stats");
      if (!res.ok) throw new Error("Failed to fetch stats");
      return res.json();
    },
    refetchInterval: 60000,
    enabled: !!userId,
  });

  const downCount = stats?.downMonitors ?? monitors.filter((s) => !s.up).length;
  const upCount = stats?.upMonitors ?? monitors.filter((s) => s.up).length;
  const totalMonitors = stats?.totalMonitors ?? monitors.length;
  const uptimePercentage = stats?.uptimePercentage ?? (
    totalMonitors > 0
      ? ((upCount / totalMonitors) * 100).toFixed(3)
      : "100.000"
  );
  const totalIncidents = stats?.totalIncidents24h ?? downCount;
  const affectedMonitors = stats?.affectedMonitors24h ?? (downCount > 0 ? downCount : 0);
  const withoutIncidentTime = formatMinutes(stats?.longestIncidentFreeMinutes ?? 1440);

  if (!monitors)
    return (
      <div className="flex flex-col gap-4 mt-6 w-[300px] sticky top-6 h-full">
        <div className="w-[300px] h-[120px] bg-gray-400 rounded flex flex-col gap-2 p-4">
          {Array.from({ length: 2 }).map((_, index) => (
            <div key={index} className="grid gap-2">
              <div className="w-[40%] h-[12px] bg-gray-500 rounded-full"></div>
              <div className="w-[20%] h-[12px] bg-gray-500 rounded-full"></div>
            </div>
          ))}
        </div>
        <div className="w-[300px] h-[190px] bg-gray-400 rounded flex flex-col gap-2 p-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="grid gap-2">
              <div className="w-[40%] h-[12px] bg-gray-500 rounded-full"></div>
              <div className="w-[20%] h-[12px] bg-gray-500 rounded-full"></div>
            </div>
          ))}
        </div>
      </div>
    );
  return (
    <div className="flex flex-col gap-4 mt-6 min-w-[300px] sticky top-6 h-full">
      <div className="bg-green-950/90 text-white p-4 rounded-lg ">
        <p className="font-semibold text-lg">Current status.</p>
        <div className="flex items-center justify-around my-4">
          <div
            className={`${
              downCount > 0 ? "text-red-500" : "text-gray-400"
            } text-xs font-bold flex flex-col items-center`}
          >
            <span className="text-xl">{downCount}</span>
            <p className="text-gray-400">Down</p>
          </div>
          <div className="text-green-500 text-xs font-bold flex flex-col items-center">
            <span className="text-xl">{upCount}</span>
            <p className="text-gray-400">Up</p>
          </div>
          <div className="text-xs font-bold flex flex-col items-center text-gray-400">
            <span className="text-xl">0</span>
            <p>Paused</p>
          </div>
        </div>
        <p className="text-gray-400 text-sm text-center">
          Using {totalMonitors} of 50 monitors.
        </p>
      </div>

      <div className="bg-green-950/90 text-white p-4 rounded-lg ">
        <p className="font-semibold text-lg">Last 24 hours.</p>
        <div className="flex flex-col mt-2 gap-2">
          <div className="flex items-center justify-between">
            <span
              className={`${
                uptimePercentage.toString().includes("100")
                  ? "text-green-500"
                  : "text-red-500"
              }  font-bold`}
            >
              {uptimePercentage}%
            </span>
            <span className="text-gray-400 text-sm">Overall uptime</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-white font-bold">{totalIncidents}</span>
            <span className="text-gray-400 text-sm">Incidents</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-white font-bold">{withoutIncidentTime}</span>
            <span className="text-gray-400 text-sm">Without incid.</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-white font-bold">{affectedMonitors}</span>
            <span className="text-gray-400 text-sm">Affected mon.</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemStatusCard;
