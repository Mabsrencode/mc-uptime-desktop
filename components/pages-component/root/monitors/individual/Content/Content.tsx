"use client";
import ResponseTimeGraph from "@/components/reusable/ResponseTimeGraph/ResponseTimeGraph";
import UptimeLoading from "@/components/reusable/UptimeLoading/UptimeLoading";
import { useQuery } from "@tanstack/react-query";
import { subDays, startOfDay, endOfDay } from "date-fns";
import { BsThreeDots } from "react-icons/bs";
import {
  MdEmail,
  MdOutlineFileDownload,
  MdOutlineFileUpload,
  MdOutlineMonitor,
} from "react-icons/md";
import { GoGraph } from "react-icons/go";
import React, { useState } from "react";
import Link from "next/link";
import PingStatus from "@/components/reusable/PingStatus/PingStatus";
import { useRouter } from "next/navigation";
import TableStatus from "@/components/reusable/TableStatus/TableStatus";
import { IoChevronBack } from "react-icons/io5";
import { BiBell } from "react-icons/bi";
import { IoIosSettings, IoIosClose } from "react-icons/io";
import { FaTrash } from "react-icons/fa";
import { TbSeo } from "react-icons/tb";
import { PiSpeedometerFill } from "react-icons/pi";
import toast from "react-hot-toast";
import LoaderSpinner from "@/components/reusable/LoaderSpinner/LoaderSpinner";
export interface IncidentsI {
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
  notifications: NotificationsData[] | null;
}
export interface NotificationI {
  type: string;
  sentAt: string;
}
export interface ChecksI {
  id: string;
  up: boolean;
  checkedAt: string;
  error?: string | null;
  details?: string | null;
  average_response: number | null;
  max_response?: number | null;
  min_response?: number | null;
}
export interface SiteStatus {
  id: string;
  url: string;
  email: string;
  interval: number;
  monitorType: string;
  userId: string;
  checks: ChecksI[] | null;
  incident: IncidentsI[] | null;
  notification: NotificationI[] | null;
}
const Content: React.FC<{ siteId: string }> = ({ siteId }) => {
  const [incidentsLimit, setIncidentsLimit] = useState(5);
  const [openTestNotifContainer, setOpenTestNotifContainer] = useState(false);
  const [isSendingNotification, setIsSendingNotification] = useState(false);
  const router = useRouter();
  const handleGetMonitor = async () => {
    const response = await fetch(
      `/api/monitor/monitor-status?siteId=${siteId}`
    );
    if (!response.ok) throw new Error("Failed to fetch monitor status");
    const data = response.json();
    return data;
  };
  const handleTestNotification = async () => {
    if (!data) return;
    const reversedChecksData = data?.checks ? data.checks.toReversed() : [];
    try {
      setIsSendingNotification(true);
      const response = await fetch("/api/monitor/monitor-status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: data.url,
          email: data.email,
          type: reversedChecksData[0].up ? "UP" : "DOWN",
          error: "This is a test error notification",
          details:
            "This is a test notification to verify email alerts are working",
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to send test notification");
      }

      const result = await response.json();
      toast.success(result.message);

      setOpenTestNotifContainer(false);
    } catch (error) {
      console.error("Error sending test notification:", error);
    } finally {
      setIsSendingNotification(false);
    }
  };
  const { data, isLoading, error } = useQuery<SiteStatus>({
    queryKey: ["monitor-status", siteId],
    queryFn: handleGetMonitor,
    staleTime: 6000,
    refetchInterval: 6000,
  });
  const handleNavigateIncident = (id: string) => {
    router.push(`/incidents/${id}`);
  };
  const loadMoreIncidents = () => {
    setIncidentsLimit((prev) => prev + 5);
  };
  if (isLoading) return <UptimeLoading />;
  if (error)
    return (
      <div className="text-white">
        <h1>Something went wrong from the server.</h1>
      </div>
    );
  const yesterdayStart = startOfDay(subDays(new Date(), 1)).getTime();
  const todayEnd = endOfDay(new Date()).getTime();
  const filteredChecks =
    data?.checks?.filter((check) => {
      const checkTime = new Date(check.checkedAt).getTime();
      return checkTime >= yesterdayStart && checkTime <= todayEnd;
    }) || [];
  const reversedChecksData = data?.checks ? data.checks.toReversed() : [];
  return (
    <section className="py-3 px-4 container mx-auto w-full mt-6 text-white">
      <Link
        href={"/monitors"}
        className="inline transition-all bg-green-700 hover:bg-green-700/70 cursor-pointer px-3 py-2 rounded text-sm font-medium text-white"
      >
        <IoChevronBack className="inline" />
        Monitors
      </Link>
      <div className="w-full flex items-center justify-between gap-6 mt-12">
        <div className="flex items-center gap-4">
          <PingStatus up={reversedChecksData[0].up ?? false} />
          <div>
            <h1 className="text-xl manrope font-bold">
              {data?.url.split("//")[1]}
            </h1>
            <p className="text-gray-400 mt-1 text-xs">
              {data?.monitorType === "HTTP" ? "HTTP/S" : "HTTP"} monitor for{" "}
              {data?.url}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <button
              onClick={() => setOpenTestNotifContainer(!openTestNotifContainer)}
              className="transition-all flex items-center gap-2 py-2 px-3 bg-green-700 hover:bg-green-700/70 rounded text-xs cursor-pointer"
            >
              <BiBell />
              Test Notification
            </button>
            {openTestNotifContainer && (
              <div className="absolute w-[400px] shadow p-2 top-10 rounded right-0 bg-green-950 border border-white/20 overflow-hidden z-[500]">
                <div className="relative">
                  <IoIosClose
                    onClick={() =>
                      setOpenTestNotifContainer(!openTestNotifContainer)
                    }
                    className="absolute top-0 right-0 text-2xl  hover:bg-white/20 rounded-full cursor-pointer transition-all"
                  />
                  <h3 className="text-sm manrope font-bold">
                    Send test notifications.
                  </h3>
                  <div className="mt-2">
                    <span className="text-gray-400 text-xs">
                      Attached people and integrations
                    </span>
                    <div className="mt-2 border-y border-white/20 my-8 p-2">
                      {data && data?.email ? (
                        <div className="relative flex items-center gap-2 justify-between">
                          <div className=" flex items-center gap-2">
                            <div className="flex justify-center items-center bg-[#000d07]/70 text-xl rounded-full h-8 w-8">
                              <h3>
                                {data.email.split("")[0].toUpperCase()}
                                <span className="text-green-500">.</span>
                              </h3>
                            </div>
                            <span className="text-xs">{data.email}</span>
                          </div>
                          <MdEmail />
                        </div>
                      ) : (
                        <div className="rounded-full h-11 w-11 bg-gray-400 animate-pulse"></div>
                      )}
                    </div>
                  </div>
                  <button
                    disabled={isSendingNotification}
                    onClick={handleTestNotification}
                    className="bg-green-700  hover:bg-green-700/70 rounded transition-all text-xs disabled:bg-gray-800 disabled:cursor-not-allowed cursor-pointer w-full p-2 flex items-center justify-center gap-2"
                  >
                    {isSendingNotification ? (
                      <div className="flex items-center gap-2">
                        <LoaderSpinner bigger={false} /> Sending...
                      </div>
                    ) : (
                      <>
                        <BiBell /> Send test notifications
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
          <button className="transition-all flex items-center gap-2 py-2 px-3 bg-green-700 hover:bg-green-700/70 rounded text-xs cursor-pointer">
            <TbSeo />
            SEO
          </button>
          <button className="transition-all flex items-center gap-2 py-2 px-3 bg-green-700 hover:bg-green-700/70 rounded text-xs cursor-pointer">
            <PiSpeedometerFill />
            Performance
          </button>
          <button className="transition-all hover:bg-white/20 rounded p-2 cursor-pointer text-gray-400  hover:text-white">
            <BsThreeDots className=" rotate-90" />
          </button>
        </div>
      </div>
      <div className="bg-green-950 p-8 rounded w-full mt-6">
        <h2 className="text-white text-2xl font-bold manrope mb-2">
          Response Time
        </h2>
        <ResponseTimeGraph data={filteredChecks} />
        {reversedChecksData && (
          <div className="flex items-center justify-between mt-4 text-white">
            <div className="flex-1">
              <div className="flex items-center gap-2 text-2xl">
                <GoGraph className="text-gray-400" />{" "}
                <h3>
                  {reversedChecksData[0].average_response
                    ? reversedChecksData[0].average_response + " ms"
                    : "N/A"}
                </h3>
              </div>
              <span className="text-sm manrope">Average</span>
            </div>
            <div className="border-x border-white/20 flex-1 pl-8">
              <div className="flex items-center gap-2 text-2xl">
                <MdOutlineFileDownload className="text-green-500" />{" "}
                <h3>
                  {reversedChecksData[0].min_response
                    ? reversedChecksData[0].min_response + " ms"
                    : "N/A"}
                </h3>
              </div>
              <span className="text-sm manrope">Minimum</span>
            </div>
            <div className="flex-1 pl-8">
              <div className="flex items-center gap-2 text-2xl">
                <MdOutlineFileUpload className="text-red-400" />{" "}
                <h3>
                  {reversedChecksData[0].max_response
                    ? reversedChecksData[0].max_response + " ms"
                    : "N/A"}
                </h3>
              </div>
              <span className="text-sm manrope">Maximum</span>
            </div>
          </div>
        )}
      </div>
      <div className="w-full py-6 bg-green-950/90 rounded mt-6">
        <h3 className="manrope font-bold text-xl mx-6">
          Latest Incidents<span className="text-green-500">.</span>
        </h3>
        {data && data.incident && data.incident.length > 0 ? (
          <>
            <TableStatus
              bgColored={false}
              data={{ data: data.incident }}
              handleNavigateIncident={handleNavigateIncident}
              bordered={false}
              showUrl={false}
            />
            {data.incident.length > incidentsLimit && (
              <div className="flex justify-center mt-4 w-full px-6">
                <button
                  onClick={loadMoreIncidents}
                  className="bg-[#000d07]/70 text-white px-4 py-2 rounded-lg hover:bg-black/50 cursor-pointer text-xs w-full shadow"
                >
                  Load more incidents
                </button>
              </div>
            )}
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
