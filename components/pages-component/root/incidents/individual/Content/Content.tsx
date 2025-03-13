"use client";
import PingStatus from "@/components/reusable/PingStatus/PingStatus";
import UptimeLoading from "@/components/reusable/UptimeLoading/UptimeLoading";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import React from "react";
import { IoChevronBack } from "react-icons/io5";
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
  mobile_number?: string | null;
}
const Content: React.FC<{ incidentId: string; siteId: string }> = ({
  incidentId,
  siteId,
}) => {
  const handleGetIncident = async () => {
    const response = await fetch(
      `/api/monitor/incident?incidentId=${incidentId}&siteId=${siteId}`
    );

    if (!response.ok) throw new Error("Failed to fetch monitors");
    const data = await response.json();
    return data;
  };
  const { data, isLoading, error } = useQuery<IncidentI>({
    queryKey: ["incident", incidentId, siteId],
    queryFn: handleGetIncident,
    staleTime: 50000,
  });
  if (isLoading) return <UptimeLoading />;
  return (
    <section className="py-3 px-4 container mx-auto w-full mt-6">
      <Link
        href={"/incidents"}
        className="inline bg-green-700 hover:bg-green-700/70 cursor-pointer px-3 py-2 rounded text-sm font-medium text-white"
      >
        <IoChevronBack className="inline" />
        Incidents
      </Link>
      <div className="w-full flex items-center justify-between gap-6 mt-12">
        <div className="flex items-center gap-2">
          <div>
            <PingStatus up={data?.up ?? false} />
          </div>
          <div></div>
        </div>
        <div></div>
      </div>
    </section>
  );
};

export default Content;
