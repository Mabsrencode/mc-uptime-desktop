"use client";
import React from "react";
import { useAuthStore } from "@/stores/useAuthStore";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import TableStatus from "@/components/reusable/TableStatus/TableStatus";
import UptimeLoading from "@/components/reusable/UptimeLoading/UptimeLoading";
const Content = () => {
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
        <div></div>
      </div>
      <TableStatus
        data={data}
        bordered
        showUrl
        handleNavigateIncident={handleNavigateIncident}
      />
    </section>
  );
};

export default Content;
