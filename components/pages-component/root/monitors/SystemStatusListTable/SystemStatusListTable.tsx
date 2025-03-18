import React, { FC, useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/useAuthStore";
import { BsThreeDots } from "react-icons/bs";
import { WiRefresh } from "react-icons/wi";
import TimeDelta from "@/components/reusable/TimeDelta/TimeDelta";
import Image from "next/image";
import toast from "react-hot-toast";
import { MdError } from "react-icons/md";
import Link from "next/link";
import MonitorForm from "@/components/reusable/MonitorForm/MonitorForm";
import { useStatusStore } from "@/stores/useStatusStore";
interface Checks {
  up: boolean;
}
interface Incident {
  id: string;
  startTime: string;
  endTime: string;
  resolved: boolean;
  error: string;
  details: string;
  up: boolean;
}
interface Monitor {
  id: string;
  url: string;
  createdAt: string;
  updatedAt: string;
  monitorType: string;
  interval: number;
  checks: Checks[];
  incident: Incident[];
}

export interface SiteStatus {
  id: number;
  up: boolean;
  checkedAt: string;
  error?: string;
  incidentId: string;
}

export interface SiteStatusData {
  sites: SiteStatus[];
}

const SystemStatusListTable: FC<{ handleShowForm: () => void }> = ({
  handleShowForm,
}) => {
  const { data: authData } = useAuthStore();
  const { setStatus } = useStatusStore();
  const userId = authData?.user?.userID;
  const queryClient = useQueryClient();
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [editingMonitor, setEditingMonitor] = useState<Monitor | null>(null);

  const fetchMonitors = async (): Promise<Monitor[]> => {
    if (!userId) return [];
    const response = await fetch(`/api/monitor?userId=${userId}`);
    if (!response.ok) throw new Error("Failed to fetch monitors");
    return (await response.json()).data;
  };

  const fetchStatus = async (): Promise<SiteStatusData> => {
    const response = await fetch(`/api/monitor/status`);
    if (!response.ok) throw new Error("Failed to fetch status");
    const data = await response.json();
    return data;
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ["sites", userId],
    queryFn: fetchMonitors,
    refetchInterval: 1000,
    retry: false,
    enabled: !!userId,
  });
  const { data: status } = useQuery({
    queryKey: ["status"],
    queryFn: fetchStatus,
    refetchInterval: 1000,
    retry: false,
  });
  useEffect(() => {
    if (status) {
      setStatus(status);
    }
  }, [status, setStatus]);

  const deleteMonitor = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch("/api/monitor", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });
      if (!response.ok) throw new Error("Failed to delete monitor");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sites"] });
      toast.success("Monitor deleted successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete monitor");
    },
  });

  const editMonitor = useMutation({
    mutationFn: async (updatedMonitor: Monitor) => {
      const response = await fetch("/api/monitor", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedMonitor),
      });
      if (!response.ok) throw new Error("Failed to update monitor");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sites"] });
      toast.success("Monitor updated successfully");
      setEditingMonitor(null);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update monitor");
    },
  });

  if (isLoading)
    return (
      <div className="flex flex-col gap-2 mt-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="h-[60px] w-full bg-gray-400 animate-pulse rounded border border-white/20 p-4"
          >
            <div className="flex flex-col gap-2">
              <div className="w-[40%] h-[12px] bg-gray-500 rounded-full"></div>
              <div className="w-[20%] h-[12px] bg-gray-500 rounded-full"></div>
            </div>
          </div>
        ))}
      </div>
    );

  if (error) return <div>Error loading data.</div>;
  return (
    <div className="text-white w-full mt-6">
      {data && data.length === 0 ? (
        <div className="relative w-full mt-24 overflow-hidden z-10">
          <div className="relative ">
            <div className="w-7/12">
              <h1 className="text-white manrope font-bold text-6xl">
                <span className="text-green-500">Monitor</span> your website in
                a click<span className="text-green-500">.</span>
              </h1>
              <p className="text-lg mt-6 inter">
                Keep an eye on your{" "}
                <span className="text-green-500">
                  website, API, email service, or any port or device on the
                  network
                </span>
                . Ping our servers to track cron jobs and stay on top of
                critical incidents.
              </p>
            </div>
            <div className="mt-12">
              <p className="text-lg inter">
                Get started now, all set up in under 30 seconds! ⚡
              </p>
              <button
                onClick={handleShowForm}
                className="bg-green-700 hover:bg-green-700/70 rounded cursor-pointer px-12 py-2 block mt-4"
              >
                Create your first monitor
              </button>
            </div>
          </div>
          <Image
            className="absolute top-0 -right-[500px]"
            src={"/assets/images/banner.png"}
            alt="banner"
            width={900}
            height={400}
          />
        </div>
      ) : (
        data?.map((monitor) => {
          const st = status?.sites.find((s) => s.id.toString() === monitor.id);
          const reverseIncidentData = monitor.incident.toReversed();
          return (
            <div key={monitor.id}>
              {editingMonitor?.id === monitor.id ? (
                <MonitorForm
                  initialValues={editingMonitor}
                  onSubmit={(values) => editMonitor.mutate(values)}
                  onCancel={() => setEditingMonitor(null)}
                />
              ) : (
                <div className="bg-green-950/90 py-3 px-4 rounded-lg border border-white/20 flex items-center justify-between mb-2">
                  <div className="flex items-center gap-4">
                    <span className="relative flex h-3 w-3">
                      <span
                        className={`animate-ping absolute inline-flex h-full w-full rounded-full ${
                          st?.up ? "bg-white" : "bg-red-500"
                        }  opacity-75`}
                      ></span>
                      <span
                        className={`relative inline-flex rounded-full h-3 w-3 ${
                          st?.up ? "bg-green-500" : "bg-red-500/80"
                        }`}
                      ></span>
                    </span>
                    <div>
                      <p className="text-sm font-semibold ">{monitor.url}</p>

                      <div className="text-gray-400 text-xs mt-1 flex gap-1 items-center">
                        <p className="border border-white/20 inline py-[2px] px-[3px] rounded bg-black/40">
                          {monitor.monitorType}
                        </p>
                        {st?.checkedAt ? (
                          <TimeDelta dt={st?.checkedAt} />
                        ) : (
                          <span className="h-[10px] w-[100px] bg-gray-500 animate-pulse rounded-full"></span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="relative flex items-center">
                    {st?.error && (
                      <div className="flex items-center gap-1">
                        <div>
                          <Link
                            className="text-xs text-nowrap bg-black/40 hover:bg-black/60 transition-all rounded py-1 px-2"
                            href={`/incidents/${reverseIncidentData[0].id}`}
                          >
                            View Incident
                          </Link>
                        </div>
                        <div className="flex gap-1">
                          <MdError className="text-red-700" />
                          <p className="text-xs text-gray-400">{st?.error}</p>
                        </div>
                      </div>
                    )}
                    <div className="flex items-center mr-12 text-gray-400">
                      <WiRefresh className="text-3xl" />
                      <p className="text-xs text-nowrap">
                        {monitor.interval}
                        <span> {monitor.interval >= 60 ? "hour" : "min"}</span>
                      </p>
                    </div>
                    <BsThreeDots
                      onClick={() =>
                        setOpenDropdownId((prev) =>
                          prev === monitor.id ? null : monitor.id
                        )
                      }
                      className="hover:bg-white/20 rounded-full cursor-pointer p-1 text-2xl"
                    />
                    {openDropdownId === monitor.id && (
                      <div className="absolute top-8 -right-12 z-10 bg-white text-black shadow-lg rounded-md p-2">
                        <button
                          onClick={() => setEditingMonitor(monitor)}
                          className="block w-full text-left px-2 py-1 hover:bg-gray-200 cursor-pointer"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteMonitor.mutate(monitor.id)}
                          className="block w-full text-left px-2 py-1 hover:bg-gray-200 cursor-pointer"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
};

export default SystemStatusListTable;
