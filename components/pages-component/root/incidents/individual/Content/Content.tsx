"use client";
import UptimeLoading from "@/components/reusable/UptimeLoading/UptimeLoading";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import React from "react";
import { IoChevronBack } from "react-icons/io5";
interface IncidentI {
  checkAt: string;
  details: string;
  error: string;
  id: string;
  up: string;
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
  console.log(data);
  return (
    <section className="py-3 px-4 container mx-auto w-full mt-6">
      <Link
        href={"/incidents"}
        className="inline bg-green-700 hover:bg-green-700/70 cursor-pointer px-3 py-2 rounded text-sm font-medium text-white"
      >
        <IoChevronBack className="inline" />
        Incidents
      </Link>
      <div className="w-full">
        <div></div>
        <div></div>
      </div>
    </section>
  );
};

export default Content;
