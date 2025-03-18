"use client";
import UptimeLoading from "@/components/reusable/UptimeLoading/UptimeLoading";
import { useQuery } from "@tanstack/react-query";
import React from "react";

const Content: React.FC<{ siteId: string }> = ({ siteId }) => {
  const handleGetMonitor = async () => {
    const response = await fetch(`/api/monitor/${siteId}`);
    if (!response.ok) throw new Error("Failed to fetch monitor status");
    const data = response.json();
    return data;
  };
  const { data, isLoading, error } = useQuery({
    queryKey: ["monitor-status", siteId],
    queryFn: handleGetMonitor,
  });
  if (isLoading) return <UptimeLoading />;
  if (error)
    return (
      <section className="text-white">
        <h1>Something went wrong from the server.</h1>
      </section>
    );
  return <div>Content</div>;
};

export default Content;
