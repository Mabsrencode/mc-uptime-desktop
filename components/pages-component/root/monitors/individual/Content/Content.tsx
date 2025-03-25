"use client";
import ResponseTimeGraph from "@/components/reusable/ResponseTimeGraph/ResponseTimeGraph";
import UptimeLoading from "@/components/reusable/UptimeLoading/UptimeLoading";
import { useQuery } from "@tanstack/react-query";
import { subDays, startOfDay, endOfDay } from "date-fns";
import {
  MdOutlineFileDownload,
  MdOutlineFileUpload,
  MdOutlineMonitor,
} from "react-icons/md";
import { GoGraph } from "react-icons/go";
import React from "react";
import Link from "next/link";
import PingStatus from "@/components/reusable/PingStatus/PingStatus";
import { useRouter } from "next/navigation";
import TableStatus from "@/components/reusable/TableStatus/TableStatus";
export interface IncidentsI {
  id: string;
  siteId: string;
  startTime: string;
  endTime: string | null;
  resolved: boolean;
  error?: string | null;
  details?: string | null;
  url: string;
  email: string;
  monitorType: string;
  interval: number;
  up: boolean;
  notifications: NotificationsData[] | null;
}
export interface NotificationI {
  type: string;
  sentAt: string;
}
export interface ChecksI {
  id: string;
  up: boolean;
  checkedAt: string;
  error?: string | null;
  details?: string | null;
  average_response: number | null;
  max_response?: number | null;
  min_response?: number | null;
}
export interface SiteStatus {
  id: string;
  url: string;
  email: string;
  interval: number;
  monitorType: string;
  userId: string;
  checks: ChecksI[] | null;
  incident: IncidentsI[] | null;
  notification: NotificationI[] | null;
}
const Content: React.FC<{ siteId: string }> = ({ siteId }) => {
  const router = useRouter();
  const handleGetMonitor = async () => {
    const response = await fetch(
      `/api/monitor/monitor-status?siteId=${siteId}`
    );
    if (!response.ok) throw new Error("Failed to fetch monitor status");
    const data = response.json();
    return data;
  };
  const { data, isLoading, error } = useQuery<SiteStatus>({
    queryKey: ["monitor-status", siteId],
    queryFn: handleGetMonitor,
    staleTime: 6000,
    refetchInterval: 6000,
  });
  const handleNavigateIncident = (id: string) => {
    router.push(`/incidents/${id}`);
  };
  if (isLoading) return <UptimeLoading />;
  if (error)
    return (
      <div className="text-white">
        <h1>Something went wrong from the server.</h1>
      </div>
    );
  const yesterdayStart = startOfDay(subDays(new Date(), 1)).getTime();
  const todayEnd = endOfDay(new Date()).getTime();
  const filteredChecks =
    data?.checks?.filter((check) => {
      const checkTime = new Date(check.checkedAt).getTime();
      return checkTime >= yesterdayStart && checkTime <= todayEnd;
    }) || [];
  console.log(data);
  const reversedChecksData = data?.checks ? data.checks.toReversed() : [];
  return (
    <section className="py-3 px-4 container mx-auto w-full mt-6 text-white">
      <div className="w-full flex items-center justify-between gap-6 mt-12">
        <div className="flex items-center gap-4">
          <PingStatus up={reversedChecksData[0].up ?? false} />
          <div>
            <h1 className="text-xl manrope font-bold">
              Ongoing incident on {data?.url.split("//")[1]}
            </h1>
            <p className="text-gray-400 mt-1 text-xs">
              {data?.monitorType === "HTTP" ? "HTTP/S" : "HTTP"} monitor for{" "}
              {data?.url}
            </p>
          </div>
        </div>
        <div>
          <Link
            href={"/monitors"}
            className="flex items-center gap-2 py-2 px-3 bg-green-700 rounded text-xs cursor-pointer"
          >
            <MdOutlineMonitor />
            Go to Monitor
          </Link>
        </div>
      </div>
      <div className="bg-green-950 p-8 rounded w-full mt-6">
        <h2 className="text-white text-2xl font-bold manrope mb-2">
          Response Time
        </h2>
        <ResponseTimeGraph data={filteredChecks} />
        {reversedChecksData && (
          <div className="flex items-center justify-between mt-4 text-white">
            <div className="flex-1">
              <div className="flex items-center gap-2 text-2xl">
                <GoGraph className="text-gray-400" />{" "}
                <h3>
                  {reversedChecksData[0].average_response
                    ? reversedChecksData[0].average_response + " ms"
                    : "N/A"}
                </h3>
              </div>
              <span className="text-sm manrope">Average</span>
            </div>
            <div className="border-x border-white/20 flex-1 pl-8">
              <div className="flex items-center gap-2 text-2xl">
                <MdOutlineFileDownload className="text-green-500" />{" "}
                <h3>
                  {reversedChecksData[0].min_response
                    ? reversedChecksData[0].min_response + " ms"
                    : "N/A"}
                </h3>
              </div>
              <span className="text-sm manrope">Minimum</span>
            </div>
            <div className="flex-1 pl-8">
              <div className="flex items-center gap-2 text-2xl">
                <MdOutlineFileUpload className="text-red-400" />{" "}
                <h3>
                  {reversedChecksData[0].max_response
                    ? reversedChecksData[0].max_response + " ms"
                    : "N/A"}
                </h3>
              </div>
              <span className="text-sm manrope">Maximum</span>
            </div>
          </div>
        )}
      </div>
      <div className="w-full py-6 bg-green-950/90 rounded mt-6">
        <h3 className="manrope font-bold text-xl mx-6">
          Latest Incidents<span className="text-green-500">.</span>
        </h3>
        {data && data.incident && data.incident.length > 0 ? (
          <>
            <TableStatus
              bgColored={false}
              data={{ data: data.incident }}
              handleNavigateIncident={handleNavigateIncident}
              bordered={false}
              showUrl={false}
            />
            <div className="flex justify-center mt-4 w-full px-6">
              <button className="bg-[#000d07]/70 text-white px-4 py-2 rounded-lg hover:bg-black/50 cursor-pointer text-xs w-full shadow">
                Load more incidents
              </button>
            </div>
          </>
        ) : (
          <p className="text-center text-gray-400 mt-4">
            No other incidents found.
          </p>
        )}
      </div>
    </section>
  );
};

export default Content;
