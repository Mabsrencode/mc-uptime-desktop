"use client";
import React, { useState } from "react";
import { useAuthStore } from "@/stores/useAuthStore";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import TableStatus from "@/components/reusable/TableStatus/TableStatus";
import UptimeLoading from "@/components/reusable/UptimeLoading/UptimeLoading";
import { GoFilter } from "react-icons/go";
import { IoIosArrowDown } from "react-icons/io";
import { FaTrash } from "react-icons/fa";
import Link from "next/link";
interface Incident {
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

interface GetIncidentsByUserResponse {
  data: Incident[] | null;
}
const Content = () => {
  const [openBulk, setOpenBulk] = useState<boolean>(false);
  const [openFilter, setOpenFilter] = useState<boolean>(false);
  const { data: user } = useAuthStore();
  const router = useRouter();
  const handleNavigateIncident = (id: string) => {
    router.push(`/incidents/${id}`);
  };
  const userId = user && user.user && user.user.userID;
  const handleGetAllIncidents = async () => {
    const response =
      userId && (await fetch(`/api/monitor/incidents?userId=${userId}`));
    if (!response) throw new Error("Something went wrong from the server.");
    if (!response.ok) throw new Error("Failed to fetch incidents");
    const data = await response.json();
    return data;
  };

  const { data, isLoading, error } =
    useQuery<GetIncidentsByUserResponse | null>({
      queryKey: ["incidents", userId],
      queryFn: handleGetAllIncidents,
      staleTime: 10 * 60 * 1000,
      retry: false,
    });
  console.log(data && data.data && data?.data?.length > 0);
  if (isLoading) return <UptimeLoading />;
  if (error)
    return (
      <div>
        <p>Something went wrong: {error.message}</p>
      </div>
    );
  return (
    <section className="text-white w-full px-4 container mx-auto">
      <div className="mt-6 flex w-full justify-between mb-6">
        <div>
          <h1 className="text-4xl font-bold manrope">
            Incidents<span className="text-green-500">.</span>
          </h1>
        </div>
        {data && data.data && data.data.length > 0 && (
          <div className="flex items-center gap-2 text-xs my-2 w-full justify-end">
            <div className="flex items-center">
              <input
                type="text"
                placeholder="Search by name or URL"
                className="border border-white/20 outline-none px-2 py-1 rounded"
              />
              <select className="border border-white/20 text-gray-400 outline-none px-2 py-1 ml-2 rounded">
                <option value="HTTP" className="bg-green-950">
                  HTTP
                </option>
                <option value="Ping" className="bg-green-950">
                  Ping
                </option>
                <option value="Port" className="bg-green-950">
                  Port
                </option>
                <option value="IP Address" className="bg-green-950">
                  IP Address
                </option>
              </select>
              <div className="border border-white/20 text-gray-400 outline-none px-2 py-1 ml-2 rounded">
                <span className="flex items-center gap-2">
                  <GoFilter className="inline" /> Filter
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
      {data && data.data && data.data.length > 0 ? (
        <TableStatus
          bgColored
          data={data}
          bordered
          showUrl
          handleNavigateIncident={handleNavigateIncident}
        />
      ) : (
        <div className="w-full mt-24 text-center  p-4 border border-white/20 border-dotted">
          <h1 className="text-white text-xl font-bold manrope">
            No incidents found.
          </h1>
          <p className="text-sm my-2 inter w-[500px] mx-auto">
            Keep an eye on your{" "}
            <span className="text-green-500">
              website, API, email service, or any port or device on the network
            </span>
            . Ping our servers to track cron jobs and stay on top of critical
            incidents.
          </p>
          <Link
            href={"/monitors"}
            className="bg-green-700 hover:bg-green-700/70 cursor-pointer px-3 py-1 rounded text-xs font-medium text-white inline"
          >
            Start creating your first monitor
          </Link>
        </div>
      )}
    </section>
  );
};

export default Content;
