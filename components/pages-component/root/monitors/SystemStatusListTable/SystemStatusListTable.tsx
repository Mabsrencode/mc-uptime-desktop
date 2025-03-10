"use client";

import React, { FC, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/useAuthStore";
import { BsThreeDots } from "react-icons/bs";
import { WiRefresh } from "react-icons/wi";

import TimeDelta from "@/components/reusable/TimeDelta/TimeDelta";
import Image from "next/image";

interface Monitor {
  id: string;
  url: string;
  createdAt: string;
  updatedAt: string;
  monitorType: string;
  interval: number;
}
interface SiteStatus {
  id: number;
  up: boolean;
  checkedAt: string;
}
interface SiteStatusData {
  sites: SiteStatus[];
}

const SystemStatusListTable: FC<{ handleShowForm: () => void }> = ({
  handleShowForm,
}) => {
  const { data: authData } = useAuthStore();
  const userId = authData?.user?.userID;

  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  const fetchMonitors = async (): Promise<Monitor[]> => {
    if (!userId) return [];
    const response = await fetch(`/api/monitor?userId=${userId}`);
    if (!response.ok) throw new Error("Failed to fetch monitors");
    return (await response.json()).data;
  };

  const fetchStatus = async (): Promise<SiteStatusData> => {
    const response = await fetch(`/api/monitor/status`);
    if (!response.ok) throw new Error("Failed to fetch status");
    const data = await response.json();
    return data;
  };
  const { data, isLoading, isFetching, error } = useQuery({
    queryKey: ["sites", userId],
    queryFn: fetchMonitors,
    refetchInterval: 10000,
    retry: false,
    enabled: !!userId,
  });

  const { data: status } = useQuery({
    queryKey: ["status"],
    queryFn: fetchStatus,
    refetchInterval: 1000,
    retry: false,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading data.</div>;

  return (
    <div className="text-white w-full mt-6">
      {data && data.length === 0 ? (
        <div className="relative w-full mt-24 overflow-hidden">
          <div className="relative ">
            <div className="w-7/12">
              <h1 className="text-white manrope font-bold text-6xl">
                <span className="text-green-500">Monitor</span> your website in
                a click<span className="text-green-500">.</span>
              </h1>
              <p className="text-lg mt-6 inter">
                Keep an eye on your website, API, email service, or any port or
                device on the network. Ping our servers to track cron jobs and
                stay on top of critical incidents.
              </p>
            </div>
            <div className="mt-12">
              <p className="text-lg inter">
                Get started now, all set up in under 30 seconds! ⚡
              </p>
              <button
                onClick={handleShowForm}
                className="bg-green-700 hover:bg-green-700/70 rounded cursor-pointer px-12 py-2 block mt-4"
              >
                Create your first monitor
              </button>
            </div>
          </div>
          <Image
            className="absolute top-0 -right-[500px]"
            src={"/assets/images/banner.png"}
            alt="banner"
            width={900}
            height={400}
          />
        </div>
      ) : (
        data?.map((monitor) => {
          const st = status?.sites.find((s) => s.id.toString() === monitor.id);
          return (
            <div
              key={monitor.id}
              className="bg-green-950/90 py-3 px-4 rounded-lg border border-white/20 flex items-center justify-between mb-2"
            >
              <div className="flex items-center gap-4">
                <span className="relative flex h-3 w-3">
                  <span
                    className={`animate-ping absolute inline-flex h-full w-full rounded-full ${
                      st?.up ? "bg-white" : "bg-red-500"
                    }  opacity-75`}
                  ></span>
                  <span
                    className={`relative inline-flex rounded-full h-3 w-3 ${
                      st?.up ? "bg-green-500" : "bg-red-500/80"
                    }`}
                  ></span>
                </span>
                <div>
                  <p className="text-sm font-semibold">{monitor.url}</p>
                  <div className="text-gray-400 text-xs mt-1 flex gap-1 items-center">
                    <p className="border border-white/20 inline py-[2px] px-[3px] rounded bg-black/40">
                      {monitor.monitorType}
                    </p>
                    {st?.checkedAt ? (
                      <TimeDelta dt={st?.checkedAt} />
                    ) : (
                      <span className="h-[10px] w-[100px] bg-gray-500 animate-pulse rounded-full"></span>
                    )}
                  </div>
                </div>
              </div>

              <div className="relative flex items-center">
                <div className="flex items-center mr-12 text-gray-400">
                  <WiRefresh className="text-3xl" />
                  <p className="text-xs">
                    {monitor.interval}
                    <span> {monitor.interval >= 60 ? "hour" : "min"}</span>
                  </p>
                </div>
                <BsThreeDots
                  onClick={() =>
                    setOpenDropdownId((prev) =>
                      prev === monitor.id ? null : monitor.id
                    )
                  }
                  className="hover:bg-white/20 rounded-full cursor-pointer p-1 text-3xl"
                />
                {openDropdownId === monitor.id && (
                  <div className="absolute top-8 -right-16 z-10 bg-white text-black shadow-lg rounded-md p-2">
                    <button className="block w-full text-left px-2 py-1 hover:bg-gray-200 cursor-pointer">
                      Edit
                    </button>
                    <button className="block w-full text-left px-2 py-1 hover:bg-gray-200 cursor-pointer">
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default SystemStatusListTable;
