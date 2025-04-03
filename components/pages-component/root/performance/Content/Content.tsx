"use client";
import { useMutation } from "@tanstack/react-query";
import React, { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import PerformanceResult from "../../monitors/individual/PerformanceResult/PerformanceResult";
import LoaderSpinner from "@/components/reusable/LoaderSpinner/LoaderSpinner";
import { useDebouncedState } from "@/hooks/useDebouncedState";
import regex from "@/helper/regex";

const Content = () => {
  const [url, setUrl, cancelUrlUpdate] = useDebouncedState<string>("");
  const [showAnalyzePerformanceReport, setShowAnalyzePerformanceReport] =
    useState<boolean>(false);
  const handleAnalyzePerformance = useCallback(async () => {
    if (!url || !url.includes(".")) {
      throw new Error("URL is required.");
    }

    if (!regex.urlPattern.test(url)) {
      throw new Error("Invalid URL. Please enter a valid URL.");
    }
    try {
      const response = await fetch(`/api/monitor/analyze-performance`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: url,
        }),
      });
      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || "Failed to analyze Performance");
      }

      return await response.json();
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  }, [url]);

  const {
    mutate: analyzePerformance,
    data: analyzedPerformanceData,
    isPending: isAnalyzingPerformance,
  } = useMutation({
    mutationFn: handleAnalyzePerformance,
    onSuccess: () => {
      toast.success("Analyzing Performance Successfully.");
      setShowAnalyzePerformanceReport(true);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  useEffect(() => {
    return () => cancelUrlUpdate();
  }, [cancelUrlUpdate]);
  return (
    <section className="py-3 px-4 container mx-auto w-full mt-6 text-white">
      <h1 className="text-4xl manrope font-bold">
        Analyze <span className="text-green-500">Performance</span>
      </h1>
      {showAnalyzePerformanceReport && (
        <PerformanceResult
          handlerValue={showAnalyzePerformanceReport}
          data={analyzedPerformanceData}
          setHandler={setShowAnalyzePerformanceReport}
        />
      )}
      <div className="w-[75%] mt-32 mx-auto">
        <div className=" flex items-center justify-center gap-2 h-full">
          <input
            onChange={(e) => setUrl(e.target.value)}
            type="text"
            className="rounded py-2 px-4 bg-white w-full outline-none placeholder:text-gray-600 text-black"
            placeholder="https://example.com"
          />
          <button
            disabled={isAnalyzingPerformance}
            onClick={() => analyzePerformance()}
            className="disabled:cursor-not-allowed text-xs text-nowrap transition-all text-center py-2 px-3 bg-green-700 hover:bg-green-700/70 rounded h-[40px] w-[300px] cursor-pointer block"
          >
            {isAnalyzingPerformance ? (
              <LoaderSpinner bigger={false} />
            ) : (
              "Analyze Performance"
            )}
          </button>
        </div>
        <div className="text-center w-full mt-12">
          <h3 className="manrope text-5xl font-bold">
            Analyze
            <span className="text-green-500"> Performance</span> with{" "}
            <span className="text-green-500">Ease</span>
          </h3>
          <p className="text-gray-400 text-lg mt-4 mx-auto">
            Ease Performance is a tool designed to monitor, evaluate, and
            optimize system or application performance. It collects key metrics
            such as speed, efficiency, and resource usage, providing real-time
            insights and detailed reports to enhance overall performance and
            reliability.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Content;
