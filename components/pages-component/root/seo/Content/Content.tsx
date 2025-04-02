"use client";
import LoaderSpinner from "@/components/reusable/LoaderSpinner/LoaderSpinner";
import { useMutation } from "@tanstack/react-query";
import React, { useState } from "react";
import toast from "react-hot-toast";
import SEOResults from "../../monitors/individual/SEOResults/SEOResults";

const Content = () => {
  const [url, setUrl] = useState<string>("");
  const [isFollowRedirects, setIsFollowRedirect] = useState<boolean>(false);
  const [showAnalyzeSEOReport, setShowAnalyzeSEOReport] =
    useState<boolean>(false);
  const handleAnalyzeSEO = async () => {
    const urlPattern =
      /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(:\d+)?(\/.*)?$/;
    if (!url) {
      throw new Error("URL is required.");
    } else if (!urlPattern.test(url)) {
      throw new Error("Invalid URL. Please enter a valid URL.");
    }
    const response = await fetch(`/api/monitor/analyze-seo`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url: url,
        followRedirects: isFollowRedirects,
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
      setShowAnalyzeSEOReport(true);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  return (
    <section className="py-3 px-4 container mx-auto w-full mt-6 text-white">
      {analyzingSEOData && showAnalyzeSEOReport && (
        <SEOResults
          handlerValue={showAnalyzeSEOReport}
          data={analyzingSEOData}
          setHandler={setShowAnalyzeSEOReport}
        />
      )}
      <h1 className="text-4xl manrope font-bold">
        Analyze <span className="text-green-500">SEO</span>
      </h1>
      <div className="w-[75%] mt-32 mx-auto">
        <div className=" flex items-center justify-center gap-2 h-full">
          <input
            onChange={(e) => setUrl(e.target.value)}
            type="text"
            className="rounded py-2 px-4 bg-white w-full outline-none placeholder:text-gray-600 text-black"
            placeholder="https://example.com"
          />
          <div className="flex flex-row-reverse items-center gap-2 p-1 border border-white/20 rounded">
            <div className="flex items-center gap-2">
              <input
                checked={isFollowRedirects}
                onChange={(e) => setIsFollowRedirect(e.target.checked)}
                type="checkbox"
                id="follow_redirects"
              />
              <label htmlFor="follow_redirects" className="text-xs text-nowrap">
                Follow Redirects
              </label>
            </div>
            <button
              onClick={() => analyzeSEO()}
              className="transition-all text-nowrap w-[180px] text-center gap-2 py-2 px-3 bg-green-700 hover:bg-green-700/70 rounded text-xs cursor-pointer"
            >
              {isAnalyzingSEO ? (
                <LoaderSpinner bigger={false} />
              ) : (
                "Analyze your website now"
              )}
            </button>
          </div>
        </div>
        <div className="mt-12 text-center w-full">
          <h3 className="manrope text-5xl font-bold">
            Analyze
            <span className="text-green-500"> SEO</span> with{" "}
            <span className="text-green-500">Ease</span>
          </h3>
          <p className="text-gray-400 text-lg mt-4 w-full mx-auto">
            Search Engines rely on many factors to rank a website. MC Uptime SEO
            Analyzer is a Website SEO Checker which reviews these and more to
            help identify problems that could be holding your site back from
            it&apos;s potential.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Content;
