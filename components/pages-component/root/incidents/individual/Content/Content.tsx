"use client";
import PingStatus from "@/components/reusable/PingStatus/PingStatus";
import UptimeLoading from "@/components/reusable/UptimeLoading/UptimeLoading";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import React from "react";
import { IoChevronBack } from "react-icons/io5";
import { MdOutlineMonitor } from "react-icons/md";
import { useRouter } from "next/navigation";
import { format, formatDistanceToNow } from "date-fns";
import { TZDate } from "@date-fns/tz";
interface IncidentI {
  id: string;
  up: boolean;
  checkedAt: string;
  error: string | null;
  details: string | null;
  siteId: string;
  url: string;
  monitorType: string;
  interval: number;
  email: string;
}
const Content: React.FC<{ incidentId: string }> = ({ incidentId }) => {
  const router = useRouter();
  const handleGetIncident = async () => {
    const response = await fetch(
      `/api/monitor/incident?incidentId=${incidentId}`
    );

    if (!response.ok) throw new Error("Failed to fetch monitors");
    const data = await response.json();
    return data;
  };
  const { data, isLoading } = useQuery<IncidentI>({
    queryKey: ["incident", incidentId],
    queryFn: handleGetIncident,
    staleTime: 50000,
  });
  if (isLoading) return <UptimeLoading />;
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
            <PingStatus up={data?.up ?? false} />
          </div>
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
        <h2>{data?.error}</h2>
      </div>
      <div className="flex justify-between gap-6">
        <div className="flex-1 p-6 bg-green-950/90 rounded mt-6 manrope font-bold">
          <span className="text-xs">Status</span>
          <h2
            className={`${
              data?.up ? "text-green-500" : "text-red-500"
            } text-xl`}
          >
            {!data?.up ? "Ongoing" : "Resolved"}
          </h2>
          <p className="mt-1 text-gray-400 text-xs">
            Started at {data && format(new TZDate(data.checkedAt), "PPpp")}
          </p>
        </div>
        <div className="flex-1 p-6 bg-green-950/90 rounded mt-6 manrope font-bold">
          <span className="text-xs">Duration</span>
          <h2 className="text-xl">
            {data && formatDistanceToNow(new Date(data?.checkedAt))}
          </h2>
        </div>
      </div>
      <div className="p-6 bg-green-950/90 rounded mt-6 manrope">
        <span className="font-bold text-xl">
          Response details<span className="text-2xl text-green-500">.</span>
        </span>
        <p className="mt-1 p-2 bg-[#000d07]/70 border border-white/20 rounded text-gray-400 text-sm">
          {data?.details}
        </p>
      </div>
    </section>
  );
};

export default Content;
