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
  formatDuration,
  intervalToDuration,
} from "date-fns";
import { TZDate } from "@date-fns/tz";
import TableStatus from "@/components/reusable/TableStatus/TableStatus";

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
  data: {
    incident: IncidentLogsData;
    relatedIncidents: IncidentLogsData[];
  };
}

const Content: React.FC<{ incidentId: string }> = ({ incidentId }) => {
  const router = useRouter();

  const handleNavigateIncident = (id: string) => {
    router.push(`/incidents/${id}`);
  };

  const handleGetIncident = async () => {
    const response = await fetch(
      `/api/monitor/incident?incidentId=${incidentId}`
    );

    if (!response.ok) throw new Error("Failed to fetch monitors");
    const data = await response.json();
    return data;
  };

  const { data, isLoading } = useQuery<IncidentLogsResponse>({
    queryKey: ["incident", incidentId],
    queryFn: handleGetIncident,
    staleTime: 50000,
  });

  if (isLoading) return <UptimeLoading />;

  const incident = data?.data.incident;
  const relatedIncidents = data?.data.relatedIncidents || [];
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
          <PingStatus up={incident?.up ?? false} />
          <div>
            <h1 className="text-xl manrope font-bold">
              Ongoing incident on {incident?.url.split("//")[1]}
            </h1>
            <p className="text-gray-400 mt-1 text-xs">
              {incident?.monitorType === "HTTP" ? "HTTP/S" : "HTTP"} monitor for{" "}
              {incident?.url}
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
      <div className="p-6 bg-green-950/90 rounded mt-6 manrope font-bold">
        <span className="text-xs">Root cause</span>
        <h2>{incident?.error || "N/A"}</h2>
      </div>
      <div className="flex justify-between gap-6">
        <div className="flex-1 p-6 bg-green-950/90 rounded mt-6 manrope font-bold">
          <span className="text-xs">Status</span>
          <h2 className={incident?.up ? "text-green-500" : "text-red-500"}>
            {!incident?.up ? "Ongoing" : "Resolved"}
          </h2>
          <p className="mt-1 text-gray-400 text-xs">
            Started at{" "}
            {incident && format(new TZDate(incident.startTime), "PPpp")}
          </p>
        </div>
        <div className="flex-1 p-6 bg-green-950/90 rounded mt-6 manrope font-bold">
          <span className="text-xs">Duration</span>
          <h2 className="text-xl">
            {incident?.startTime && incident?.endTime
              ? formatDuration(
                  intervalToDuration({
                    start: new Date(incident.startTime),
                    end: new Date(incident.endTime),
                  })
                )
              : incident && formatDistanceToNow(new Date(incident.startTime))}
          </h2>
        </div>
      </div>
      <div className="p-6 bg-green-950/90 rounded mt-6 manrope">
        <span className="font-bold text-xl">
          Response details<span className="text-2xl text-green-500">.</span>
        </span>
        <p className="mt-1 p-2 bg-[#000d07]/70 border border-white/20 rounded text-gray-400 text-sm">
          {incident?.details || "No details available"}
        </p>
      </div>
      <div className="w-full py-6 bg-green-950/90 rounded mt-6">
        <h3 className="manrope font-bold text-xl mx-6">
          Latest Incidents<span className="text-green-500">.</span>
        </h3>
        {relatedIncidents.length > 0 ? (
          <>
            <TableStatus
              data={{ data: relatedIncidents }}
              handleNavigateIncident={handleNavigateIncident}
              bordered={false}
              showUrl={false}
            />
            <div className="flex justify-center mt-4 w-full px-6">
              <button className="bg-black/60 text-white px-4 py-2 rounded-lg hover:bg-black/50 cursor-pointer text-xs w-full shadow">
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
