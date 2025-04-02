"use client";
import "./style.css";
import ResponseTimeGraph from "@/components/reusable/ResponseTimeGraph/ResponseTimeGraph";
import UptimeLoading from "@/components/reusable/UptimeLoading/UptimeLoading";
import { useMutation, useQuery } from "@tanstack/react-query";
import { subDays, startOfDay, endOfDay } from "date-fns";
import { BsThreeDots } from "react-icons/bs";
import {
  MdEmail,
  MdOutlineFileDownload,
  MdOutlineFileUpload,
} from "react-icons/md";
import { GoGraph } from "react-icons/go";
import React, { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import PingStatus from "@/components/reusable/PingStatus/PingStatus";
import { useRouter } from "next/navigation";
import TableStatus from "@/components/reusable/TableStatus/TableStatus";
import { IoChevronBack } from "react-icons/io5";
import { BiBell } from "react-icons/bi";
import { IoIosClose } from "react-icons/io";
import { TbSeo } from "react-icons/tb";
import { PiSpeedometerFill } from "react-icons/pi";
import toast from "react-hot-toast";
import LoaderSpinner from "@/components/reusable/LoaderSpinner/LoaderSpinner";
import SEOResults from "../SEOResults/SEOResults";
import PerformanceResult from "../PerformanceResult/PerformanceResult";
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

const Content: React.FC<{ siteId: string }> = React.memo(({ siteId }) => {
  const [incidentsLimit, setIncidentsLimit] = useState(5);
  const [openTestNotifContainer, setOpenTestNotifContainer] = useState(false);
  const [openAnalyzeSEO, setOpenAnalyzeSEO] = useState(false);
  const [showAnalyzeSEOReport, setShowAnalyzeSEOReport] = useState(false);
  const [showAnalyzePerformanceReport, setShowAnalyzePerformanceReport] =
    useState(false);
  const [openAnalyzePerformance, setOpenAnalyzePerformance] = useState(false);
  const [isFollowRedirect, setIsFollowRedirect] = useState(false);
  const router = useRouter();

  const handleGetMonitor = async () => {
    const response = await fetch(
      `/api/monitor/monitor-status?siteId=${siteId}`
    );
    if (!response.ok) throw new Error("Failed to fetch monitor status");
    const data = response.json();
    return data;
  };
  const { data, isLoading, error } = useQuery<SiteStatus>({
    queryKey: ["monitor-status", siteId],
    queryFn: handleGetMonitor,
    staleTime: 6000,
    refetchInterval: 6000,
  });

  const filteredChecks = useMemo(() => {
    const yesterdayStart = startOfDay(subDays(new Date(), 1)).getTime();
    const todayEnd = endOfDay(new Date()).getTime();
    return (
      data?.checks?.filter((check) => {
        const checkTime = new Date(check.checkedAt).getTime();
        return checkTime >= yesterdayStart && checkTime <= todayEnd;
      }) || []
    );
  }, [data?.checks]);

  const reversedChecksData = useMemo(
    () => (data?.checks ? [...data.checks].reverse() : []),
    [data?.checks]
  );

  const memoizedResponseGraph = useMemo(
    () => <ResponseTimeGraph data={filteredChecks} />,
    [filteredChecks]
  );

  const handleTestNotification = useCallback(() => {
    if (!data) return;
    testNotification({
      url: data.url,
      email: data.email,
      type: reversedChecksData[0].up ? "UP" : "DOWN",
      error: "This is a test error notification.",
      details: "This is a test notification to verify email alerts are working",
    });
  }, [data, reversedChecksData]);

  const sendTestNotification = async (data: {
    url: string;
    email: string;
    type: "UP" | "DOWN";
    error: string;
    details: string;
  }) => {
    const response = await fetch("/api/monitor/monitor-status", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Failed to send test notification");
    }

    return response.json();
  };
  const { mutate: testNotification, isPending: isSendingNotification } =
    useMutation({
      mutationFn: sendTestNotification,
      onSuccess: (result) => {
        toast.success(result.message);
        setOpenTestNotifContainer(false);
      },
      onError: (error) => {
        console.error("Error sending test notification:", error);
      },
    });

  const handleNavigateIncident = (id: string) => {
    router.push(`/incidents/${id}`);
  };

  const handleAnalyzeSEO = async () => {
    if (!data) return;
    const response = await fetch(`/api/monitor/analyze-seo`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url: data.url,
        followRedirects: isFollowRedirect,
      }),
    });
    if (!response.ok) throw new Error("Failed to analyze SEO");
    const responseData = response.json();
    return responseData;
  };
  const {
    mutate: analyzeSEO,
    data: analyzingSEOData,
    isPending: isAnalyzingSEO,
  } = useMutation<SEOResponseI>({
    mutationFn: handleAnalyzeSEO,
    onSuccess: () => {
      toast.success("Analyzing SEO Successfully.");
      setOpenAnalyzeSEO(false);
      setShowAnalyzeSEOReport(true);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleAnalyzePerformance = async () => {
    if (!data) return;
    const response = await fetch(`/api/monitor/analyze-performance`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url: data.url,
      }),
    });
    if (!response.ok) throw new Error("Failed to analyze Performance");
    const responseData = response.json();
    return responseData;
  };

  const {
    mutate: analyzePerformance,
    data: analyzedPerformanceData,
    isPending: isAnalyzingPerformance,
  } = useMutation<PerformanceResponseI>({
    mutationFn: handleAnalyzePerformance,
    onSuccess: () => {
      toast.success("Analyzing Performance Successfully.");
      setOpenAnalyzePerformance(false);
      setShowAnalyzePerformanceReport(true);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
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
  return (
    <section className="py-3 px-4 container mx-auto w-full mt-6 text-white">
      {analyzingSEOData && showAnalyzeSEOReport && (
        <SEOResults
          handlerValue={showAnalyzeSEOReport}
          data={analyzingSEOData}
          setHandler={setShowAnalyzeSEOReport}
        />
      )}
      {analyzedPerformanceData && showAnalyzePerformanceReport && (
        <PerformanceResult
          handlerValue={showAnalyzePerformanceReport}
          data={analyzedPerformanceData}
          setHandler={setShowAnalyzePerformanceReport}
        />
      )}
      {openAnalyzeSEO && (
        <>
          <div
            onClick={() => setOpenAnalyzeSEO(!openAnalyzeSEO)}
            className="bg-black/70 w-full h-full fixed top-0 left-0 z-[1000]"
          ></div>
          <div className="seo_container w-1/2 text-center fixed bg-green-950 rounded z-[1000] border border-white/20">
            <div className="relative p-4">
              <IoIosClose
                onClick={() => setOpenAnalyzeSEO(!openAnalyzeSEO)}
                className="absolute top-1 right-1 text-2xl  hover:bg-white/20 rounded-full cursor-pointer transition-all"
              />
              <h3 className="manrope text-4xl font-bold">
                <span className="text-green-500">SEO</span> Audits with{" "}
                <span className="text-green-500">Ease</span>
              </h3>
              {isAnalyzingSEO ? (
                <div className="mt-4">
                  <LoaderSpinner bigger={true} />
                  <p className="text-sm text-gray-400 mt-4">
                    Analyzing your website...
                  </p>
                </div>
              ) : (
                <>
                  <p className="text-xs text-gray-400 mt-2">
                    Search Engines rely on many factors to rank a website. MC
                    Uptime SEO Analyzer is a Website SEO Checker which reviews
                    these and more to help identify problems that could be
                    holding your site back from it&apos;s potential.
                  </p>
                  <div className="mt-4 flex flex-row-reverse items-center gap-2 p-2 border border-white/20 rounded">
                    <div className="flex items-center gap-2">
                      <input
                        checked={isFollowRedirect}
                        onChange={(e) => setIsFollowRedirect(e.target.checked)}
                        type="checkbox"
                        id="follow_redirects"
                      />
                      <label
                        htmlFor="follow_redirects"
                        className="text-xs text-nowrap"
                      >
                        Follow Redirects
                      </label>
                    </div>
                    <button
                      onClick={() => analyzeSEO()}
                      className="transition-all w-full text-center gap-2 py-2 px-3 bg-green-700 hover:bg-green-700/70 rounded text-xs cursor-pointer"
                    >
                      Analyze your website now
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </>
      )}
      {openAnalyzePerformance && (
        <>
          <div
            onClick={() => setOpenAnalyzePerformance(!openAnalyzePerformance)}
            className="bg-black/70 w-full h-full fixed top-0 left-0 z-[1000]"
          ></div>
          <div className="performance_container w-1/2 text-center fixed bg-green-950 rounded z-[1000] border border-white/20">
            <div className="relative p-4">
              <IoIosClose
                onClick={() =>
                  setOpenAnalyzePerformance(!openAnalyzePerformance)
                }
                className="absolute top-1 right-1 text-2xl  hover:bg-white/20 rounded-full cursor-pointer transition-all"
              />
              <h3 className="manrope text-4xl font-bold">
                <span className="text-green-500">Analyze Performance</span> with{" "}
                <span className="text-green-500">Ease</span>
              </h3>
              {isAnalyzingPerformance ? (
                <div className="mt-4">
                  <LoaderSpinner bigger={true} />
                  <p className="text-sm text-gray-400 mt-4">
                    Analyzing performance...
                  </p>
                </div>
              ) : (
                <>
                  <p className="text-xs text-gray-400 mt-2">
                    Ease Performance is a tool designed to monitor, evaluate,
                    and optimize system or application performance. It collects
                    key metrics such as speed, efficiency, and resource usage,
                    providing real-time insights and detailed reports to enhance
                    overall performance and reliability.
                  </p>
                  <div className="mt-4 flex flex-row-reverse items-center gap-2 p-2 border border-white/20 rounded">
                    <button
                      onClick={() => analyzePerformance()}
                      className="transition-all w-full text-center gap-2 py-2 px-3 bg-green-700 hover:bg-green-700/70 rounded text-xs cursor-pointer"
                    >
                      Analyze performance now
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </>
      )}
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
          <button
            onClick={() => setOpenAnalyzeSEO(!openAnalyzeSEO)}
            className="transition-all flex items-center gap-2 py-2 px-3 bg-green-700 hover:bg-green-700/70 rounded text-xs cursor-pointer"
          >
            <TbSeo />
            SEO
          </button>
          <button
            onClick={() => setOpenAnalyzePerformance(!openAnalyzePerformance)}
            className="transition-all flex items-center gap-2 py-2 px-3 bg-green-700 hover:bg-green-700/70 rounded text-xs cursor-pointer"
          >
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
        {memoizedResponseGraph}
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
});

export default Content;
