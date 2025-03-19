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

  const { data, isLoading, error } = useQuery({
    queryKey: ["incidents", userId],
    queryFn: handleGetAllIncidents,
    staleTime: 10 * 60 * 1000,
  });
  if (isLoading) return <UptimeLoading />;
  return (
    <section className="text-white w-full px-4 container mx-auto">
      <div className="mt-6 flex w-full justify-between mb-6">
        <div>
          <h1 className="text-4xl font-bold manrope">
            Incidents<span className="text-green-500">.</span>
          </h1>
        </div>
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
      </div>
      <TableStatus
        bgColored
        data={data}
        bordered
        showUrl
        handleNavigateIncident={handleNavigateIncident}
      />
    </section>
  );
};

export default Content;
