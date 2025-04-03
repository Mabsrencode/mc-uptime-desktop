import ScoreCircle from "@/components/reusable/ScoreCircle/ScoCircle";
import React, { Dispatch, SetStateAction } from "react";
import "../Content/style.css";
import { IoIosClose } from "react-icons/io";
import Image from "next/image";
import Divider from "@/components/reusable/Divider/Divider";
import { IoEarthSharp } from "react-icons/io5";
interface SEOResultsDataI {
  data: SEOResponseI;
  setHandler: Dispatch<SetStateAction<boolean>>;
  handlerValue: boolean;
}
const SEOResults: React.FC<SEOResultsDataI> = ({
  data,
  setHandler,
  handlerValue,
}) => {
  return (
    <>
      <div
        onClick={() => setHandler(!handlerValue)}
        className="bg-black/70 w-full h-full fixed top-0 left-0 z-[1000]"
      ></div>
      <div className="seo_result_container fixed w-[90%] h-[90%] text-white border border-white/20 bg-[#191919] z-[1500] rounded shadow-2xl overflow-y-auto">
        <div className="relative w-full h-full p-8">
          <IoIosClose
            onClick={() => setHandler(!handlerValue)}
            className="fixed top-1 right-1 text-2xl  hover:bg-white/20 rounded-full cursor-pointer transition-all"
          />
          <div className="flex items-center justify-between">
            <h2 className="text-5xl manrope font-bold">
              <span className="text-green-500">SEO</span> Audit Results
            </h2>
            <button className="transition-all inline text-center gap-2 py-2 px-3 bg-green-700 hover:bg-green-700/70 rounded text-xs cursor-pointer">
              Export Results
            </button>
          </div>
          <div className="flex items-start gap-12 justify-between mt-12">
            <div className="w-1/2">
              <div>
                <h3 className="text-xl manrope font-bold">
                  {data?.url.split("//")[1]}
                </h3>
                <p className="text-gray-400 mt-1 text-xs">
                  Seo audit for {data?.url}
                </p>
              </div>
              <div className="mt-8 flex items-center gap-4 ">
                <ScoreCircle score={data.seoScore} />
                <div>
                  <h5 className="text-2xl font-bold manrope text-green-500">
                    SEO Score
                  </h5>
                  <ul className="mt-1 grid grid-cols-2 grid-rows-2 gap-x-4 p-2 border border-white/20 rounded">
                    <li className="">
                      <h3 className="text-xs text-gray-400">
                        Mobile Friendly:{" "}
                        <span className="text-white">
                          {data.mobile.friendly ? "Yes" : "No"}
                        </span>
                      </h3>
                    </li>
                    <li className="">
                      <h3 className="text-xs text-gray-400">
                        Canonical:{" "}
                        <span className="text-white">
                          {data.structure.canonical ?? "None"}
                        </span>
                      </h3>
                    </li>
                    <li className="">
                      <h3 className="text-xs text-gray-400">
                        Language:{" "}
                        <span className="uppercase text-white">
                          {data.structure.lang ?? "EN"}
                        </span>
                      </h3>
                    </li>
                    <li className="">
                      <h3 className="text-xs text-gray-400">
                        Schema Markup:{" "}
                        <span className="text-white">
                          {data.structure.schemaMarkup ? "Yes" : "No"}
                        </span>
                      </h3>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="relative w-1/2 p-4 border border-white/20 rounded">
              <span className="absolute -top-3 -right-3 bg-green-950 border border-white/20 py-1 px-3 text-xs rounded">
                Preview
              </span>
              <div className="flex items-center gap-2">
                {data.serpPreview.favicon ? (
                  <Image
                    src={data.serpPreview.favicon}
                    width={20}
                    height={20}
                    alt="favicon"
                  />
                ) : (
                  <div className="w-[20px] h-[20px] bg-white rounded-full flex items-center justify-center">
                    <IoEarthSharp className="text-gray-700" />
                  </div>
                )}
                <div>
                  <h4 className="text-sm">
                    {data.serpPreview.title.split("-")[0]}
                  </h4>
                  <p className="text-xs text-gray-400">
                    {data.serpPreview.url}
                  </p>
                </div>
              </div>
              <div className="mt-2">
                <h5 className="text-xl text-blue-500 leading-5">
                  {data.serpPreview.title}
                </h5>
                <p className="text-sm text-gray-300 mt-2">
                  {data.serpPreview.description}
                </p>
              </div>
            </div>
          </div>
          <div className="mt-12  p-4 rounded border border-white/20">
            <h3 className="text-4xl manrope font-bold">Summary Report</h3>
            <Divider />
            <div>
              <h2 className=" manrope">Title Tag</h2>
              <div className="text-gray-400 mt-2 text-sm">
                <h3>{data.title.text}</h3>
                <span className=" mt-2">Length: {data.title.length}</span>
                <span className=" block">
                  Optimal: {data.title.optimal ? "Yes" : "No"}
                </span>
                <p className="mt-2">
                  Title tags are very important for search engines to correctly
                  understand and categorize your content.
                </p>
              </div>
            </div>
            <Divider />
            <div>
              <h2 className=" manrope">Description Tag</h2>
              <div className="text-gray-400 mt-2 text-sm">
                <h3>{data.description.text}</h3>
                <span className=" mt-2">Length: {data.description.length}</span>
                <span className=" block">
                  Optimal: {data.description.optimal ? "Yes" : "No"}
                </span>
                <p className="mt-2">
                  A meta description is important for search engines to
                  understand the content of your page, and is often shown as the
                  description text blurb in search results.
                </p>
              </div>
            </div>
            <Divider />
            <div>
              <h2 className=" manrope">Headings</h2>
              <ul className="text-sm text-gray-400 mt-2 grid gap-4">
                <li>
                  <h3>Heading: h1</h3>
                  <span>Count: {data.headings.h1.count}</span>
                  <p>
                    Text:{" "}
                    {data.headings.h1.texts.length > 0
                      ? data.headings.h1.texts.map((e, index) => (
                          <span key={index}>{e}</span>
                        ))
                      : "No h1 tags found"}
                  </p>
                </li>
                <li>
                  <h3>Heading: h2</h3>
                  <span>Count: {data.headings.h2.count}</span>
                  <p>
                    Text:{" "}
                    {data.headings.h2.texts.length > 0
                      ? data.headings.h2.texts.map((e, index) => (
                          <span key={index}>{e}</span>
                        ))
                      : "No h1 tags found"}
                  </p>
                </li>
                <li>
                  <h3>Heading: h3</h3>
                  <span>Count: {data.headings.h3.count}</span>
                  <p>
                    Text:{" "}
                    {data.headings.h3.texts.length > 0
                      ? data.headings.h3.texts.map((e, index) => (
                          <span key={index}>{e}</span>
                        ))
                      : "No h3 tags found"}
                  </p>
                </li>
              </ul>
              <p className="mt-2 text-sm text-gray-400">
                HTML header tags are an important way of signaling to search
                engines the important content topics of your page, and
                subsequently the keywords it should rank for.
              </p>
            </div>
            <Divider />
            <div className="flex flex-row-reverse items-start gap-4 justify-between">
              <div className="w-1/2">
                <h2 className="manrope">Images</h2>
                <div className="mt-2 text-sm text-gray-400">
                  <p>Total: {data.images.total}</p>
                  <p>With Alt: {data.images.withAlt}</p>
                  <p>Without Alt: {data.images.withoutAlt}</p>
                </div>
              </div>
              <div className="w-1/2">
                <h2 className="manrope">Links</h2>
                <div className="mt-2 text-sm text-gray-400">
                  <p>Broken Link: {data.links.broken}</p>
                  <p>External: {data.links.external}</p>
                  <p>Internal: {data.links.internal}</p>
                  <p>Ratio: {data.links.ratio}</p>
                  <p>Total: {data.links.total}</p>
                </div>
              </div>
            </div>
            <Divider />
            <div>
              <h2 className="manrope">Keywords</h2>
              <div className="mt-2 text-sm text-gray-400">
                <h2 className="text-white"> Density</h2>
                <ul className="mt-2">
                  {Object.entries(data.keywords.density).map(([key, value]) => (
                    <li key={key}>
                      <p>
                        {key}: {value}{" "}
                      </p>
                    </li>
                  ))}
                </ul>
                <div className="mt-2">
                  <h2 className="text-white">Prominent </h2>
                  <ul className="mt-2">
                    {data.keywords.prominent.map((e, index) => (
                      <li key={index}>
                        <span>{e}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <p className="mt-2 text-sm text-gray-400">
                Your page content should be focused around particular keywords
                you would like to rank for. Ideally these keywords should also
                be distributed across tags such as the title, meta and header
                tags.
              </p>
            </div>
            <Divider />
            <div>
              <h2 className="manrope text-3xl font-semibold">Structure</h2>
              <div className="grid grid-cols-3 grid-rows-1 gap-4">
                <div className="mt-4 border border-white/20 rounded w-full p-2">
                  <h5 className="font-bold manrope text-xl">Mobile</h5>
                  <div className="text-sm text-gray-400 border border-white/20 rounded p-2 mt-2">
                    <p>
                      Mobile Friendly:{" "}
                      <span className="text-white">
                        {data.mobile.friendly ? "Yes" : "No"}
                      </span>
                    </p>
                    <p>
                      Tap Targets:{" "}
                      <span className="text-white">
                        {data.mobile.tapTargets ? "Yes" : "No"}
                      </span>
                    </p>
                    <p>
                      Viewport:{" "}
                      <span className="text-white">
                        {data.mobile.viewport ? "Yes" : "No"}
                      </span>
                    </p>
                  </div>
                </div>
                <div className="mt-4 border border-white/20 rounded w-full p-2">
                  <h5 className="font-bold manrope text-xl">Performance</h5>
                  <div className="text-sm text-gray-400 border border-white/20 rounded p-2 mt-2">
                    <p>
                      Load Time:{" "}
                      <span className="text-white">
                        {data.performance.loadTime.toFixed() ?? 0} ms
                      </span>
                    </p>
                    <p>
                      Page Size:{" "}
                      <span className="text-white">
                        {data.performance.pageSize ?? "unknown"} kb
                      </span>
                    </p>
                    <p>
                      Request:{" "}
                      <span className="text-white">
                        {data.performance.requests ?? 0}
                      </span>
                    </p>
                  </div>
                </div>
                <div className="mt-4 border border-white/20 rounded w-full p-2">
                  <h5 className="font-bold manrope text-xl">SEO Structure</h5>
                  <div className="text-sm text-gray-400 border border-white/20 rounded p-2 mt-2">
                    <p>
                      Canonical:{" "}
                      <span className="text-white">
                        {data.structure.canonical ?? "None"}
                      </span>
                    </p>
                    <p>
                      Language:{" "}
                      <span className="text-white">
                        {data.structure.lang ?? "EN"}
                      </span>
                    </p>
                    <p>
                      Schema Markup:{" "}
                      <span className="text-white">
                        {data.structure.schemaMarkup ? "Yes" : "No"}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
              <Divider />
              <div>
                <h2 className="manrope text-3xl font-semibold text-red-400">
                  Warnings
                </h2>
                <ul className="mt-2">
                  {data.warnings.map((e, index) => (
                    <li key={index} className="text-sm text-gray-400">
                      {index + 1}. {e}
                    </li>
                  ))}
                </ul>
              </div>
              <Divider />
              <div>
                <h2 className="manrope text-3xl font-semibold text-green-400">
                  Suggestions
                </h2>
                <ul className="mt-2">
                  {data.suggestions.map((e, index) => (
                    <li key={index} className="text-sm text-gray-400">
                      {index + 1}. {e}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SEOResults;
