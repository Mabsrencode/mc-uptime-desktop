"use client";

import React from "react";
import { SiteStatus } from "../SystemStatusListTable/SystemStatusListTable";

interface SystemStatusCardProps {
  monitors: SiteStatus[];
}

const SystemStatusCard: React.FC<SystemStatusCardProps> = ({ monitors }) => {
  const downSites = monitors.filter((site) => !site.up);
  const upSites = monitors.filter((site) => site.up);

  const totalMonitors = monitors.length;
  const uptimePercentage =
    totalMonitors > 0
      ? ((upSites.length / totalMonitors) * 100).toFixed(3)
      : "0.000";
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
              downSites.length > 0 ? "text-red-500" : "text-gray-400"
            } text-xs font-bold flex flex-col items-center`}
          >
            <span className="text-xl">{downSites.length}</span>
            <p className="text-gray-400">Down</p>
          </div>
          <div className="text-green-500 text-xs font-bold flex flex-col items-center">
            <span className="text-xl">{upSites.length}</span>
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
