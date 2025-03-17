"use client";
import PingStatus from "@/components/reusable/PingStatus/PingStatus";
import UptimeLoading from "@/components/reusable/UptimeLoading/UptimeLoading";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import React from "react";
import { IoChevronBack } from "react-icons/io5";
import { MdOutlineMonitor } from "react-icons/md";
import { useRouter } from "next/navigation";
import {
  format,
  formatDistanceToNow,
  differenceInMinutes,
  differenceInSeconds,
  differenceInHours,
} from "date-fns";
import { TZDate } from "@date-fns/tz";
interface IncidentLogsData {
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
}

interface IncidentLogsResponse {
  data: IncidentLogsData[];
}
const Content: React.FC<{ siteId: string; incidentId: string }> = ({
  siteId,
  incidentId,
}) => {
  const router = useRouter();
  const handleNavigateIncident = (id: string) => {
    router.push(`/incident/${id}`);
  };
  const handleGetIncident = async () => {
    const response = await fetch(
      `/api/monitor/incidents?siteId=${siteId}&incidentId=${incidentId}`
    );

    if (!response.ok) throw new Error("Failed to fetch monitors");
    const data = await response.json();
    return data;
  };
  const { data, isLoading } = useQuery<IncidentLogsResponse>({
    queryKey: ["incident", siteId],
    queryFn: handleGetIncident,
    staleTime: 50000,
  });
  if (isLoading) return <UptimeLoading />;
  console.log(data);
  return (
    <section className="py-3 px-4 container mx-auto w-full mt-6 text-white">
      <Link
        href={"/incidents"}
        className="inline bg-green-700 hover:bg-green-700/70 cursor-pointer px-3 py-2 rounded text-sm font-medium text-white"
      >
        <IoChevronBack className="inline" />
        Incidents
      </Link>
      <div className="w-full flex items-center justify-between gap-6 mt-12">
        <div className="flex items-center gap-4">
          <div>
            <PingStatus up={data?.data[0]?.up ?? false} />
          </div>
          <div>
            <h1 className="text-xl manrope font-bold">
              Ongoing incident on {data?.data[0].url.split("//")[1]}
            </h1>
            <p className="text-gray-400 mt-1 text-xs">
              {data?.data[0].monitorType === "HTTP" ? "HTTP/S" : "HTTP"} monitor
              for {data?.data[0].url}
            </p>
          </div>
        </div>
        <div>
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 py-2 px-3 bg-green-700 rounded text-xs cursor-pointer"
          >
            <MdOutlineMonitor />
            Go to Monitor
          </button>
        </div>
      </div>
      <div className="p-6 bg-green-950/90 rounded mt-6 manrope font-bold">
        <span className="text-xs">Root cause</span>
        <h2>{data?.data[0]?.error}</h2>
      </div>
      <div className="flex justify-between gap-6">
        <div className="flex-1 p-6 bg-green-950/90 rounded mt-6 manrope font-bold">
          <span className="text-xs">Status</span>
          <h2
            className={`${
              data?.data[0].up ? "text-green-500" : "text-red-500"
            } text-xl`}
          >
            {!data?.data[0].up ? "Ongoing" : "Resolved"}
          </h2>
          <p className="mt-1 text-gray-400 text-xs">
            Started at{" "}
            {data && format(new TZDate(data?.data[0].startTime), "PPpp")}
          </p>
        </div>
        <div className="flex-1 p-6 bg-green-950/90 rounded mt-6 manrope font-bold">
          <span className="text-xs">Duration</span>
          <h2 className="text-xl">
            {data &&
              formatDistanceToNow(
                new Date(
                  data?.data[0].endTime
                    ? data?.data[0].endTime
                    : data?.data[0].startTime
                )
              )}
          </h2>
        </div>
      </div>
      <div className="p-6 bg-green-950/90 rounded mt-6 manrope">
        <span className="font-bold text-xl">
          Response details<span className="text-2xl text-green-500">.</span>
        </span>
        <p className="mt-1 p-2 bg-[#000d07]/70 border border-white/20 rounded text-gray-400 text-sm">
          {data?.data[0]?.details}
        </p>
      </div>
      <div className="w-full py-6 bg-green-950/90 rounded mt-6">
        <h3 className="manrope font-bold text-xl mx-6">
          Latest Incidents
          <span className="text-green-500">.</span>
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-white/20 text-gray-400 text-sm manrope">
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Root Cause</th>
                <th className="px-6 py-3">Started</th>
                <th className="px-6 py-3">Duration</th>
              </tr>
            </thead>
            <tbody>
              {data &&
                data?.data?.length > 0 &&
                data.data.map((log) => {
                  const startedDate = new Date(log.startTime);
                  const resolvedDate = log.resolved
                    ? new Date(log.endTime ?? "")
                    : new Date();

                  const formattedStarted = format(
                    startedDate,
                    "MMM d, yyyy, hh:mm a"
                  );

                  const hours = differenceInHours(resolvedDate, startedDate);
                  const minutes =
                    differenceInMinutes(resolvedDate, startedDate) % 60;
                  const seconds =
                    differenceInSeconds(resolvedDate, startedDate) % 60;

                  const formattedDuration = `${hours}h ${minutes}m ${seconds}s`;
                  return (
                    <tr
                      onClick={() => handleNavigateIncident(log.id)}
                      key={log.id}
                      className="border-b border-white/20 hover:bg-green-900/40 text-white text-xs cursor-pointer"
                    >
                      <td className="px-6 py-4 flex items-center gap-2">
                        <div
                          className={`h-3 w-3 rounded-full ${
                            log.resolved ? "bg-green-500" : "bg-red-500"
                          }`}
                        ></div>
                        <span
                          className={`${
                            log.resolved ? "text-green-500" : "text-red-500"
                          } font-bold`}
                        >
                          {log.resolved ? "Resolved" : "Ongoing"}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <span className="bg-red-500/50 text-white px-2 py-1 rounded-md text-xs">
                          {log.error}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-gray-400">
                        {formattedStarted}
                      </td>

                      <td className="px-6 py-4 text-gray-400">
                        {formattedDuration}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
        <div className="flex justify-center mt-4 w-full p-6">
          <button className="bg-black/60 text-white px-4 py-2 rounded-lg hover:bg-black/50 cursor-pointer text-xs w-full shadow">
            Load more incidents
          </button>
        </div>
      </div>
    </section>
  );
};

export default Content;
