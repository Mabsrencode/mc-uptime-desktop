import ScoreCircle from "@/components/reusable/ScoreCircle/ScoCircle";
import React, { Dispatch, SetStateAction } from "react";
import "./style.css";
import { IoIosClose } from "react-icons/io";
import Image from "next/image";
import Divider from "@/components/reusable/Divider/Divider";
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
  console.log(data.title.optimal);
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
                <Image
                  src={data.serpPreview.favicon}
                  width={20}
                  height={20}
                  alt="favicon"
                />
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
          <div className="mt-12 bg-green-950 p-4 rounded border border-white/20">
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
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SEOResults;
