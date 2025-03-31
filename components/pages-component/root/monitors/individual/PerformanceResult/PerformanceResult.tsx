import React, { Dispatch, SetStateAction } from "react";
import "../Content/style.css";
import { IoIosClose } from "react-icons/io";
import ScoreCircle from "@/components/reusable/ScoreCircle/ScoCircle";
interface SEOResultsDataI {
  data: PerformanceResponseI;
  setHandler: Dispatch<SetStateAction<boolean>>;
  handlerValue: boolean;
}
const PerformanceResult: React.FC<SEOResultsDataI> = ({
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
      <div className="performance_result_container fixed w-[90%] h-[90%] text-white border border-white/20 bg-[#191919] z-[1500] rounded shadow-2xl overflow-y-auto">
        <div className="relative w-full h-full p-8">
          <IoIosClose
            onClick={() => setHandler(!handlerValue)}
            className="fixed top-1 right-1 text-2xl  hover:bg-white/20 rounded-full cursor-pointer transition-all"
          />
          <div className="flex items-center justify-between">
            <h2 className="text-5xl manrope font-bold">
              <span className="text-green-500">PERFORMANCE</span> Results
            </h2>
            <button className="transition-all inline text-center gap-2 py-2 px-3 bg-green-700 hover:bg-green-700/70 rounded text-xs cursor-pointer">
              Export Results
            </button>
          </div>

          <div className="p-2 w-full mt-12">
            <div className="flex flex-col justify-center items-center gap-4 p-4">
              <div className="w-1/2 p-4 border border-white/20 rounded">
                <div>
                  <h3 className="text-xl manrope font-bold">
                    {data?.url.split("//")[1]}
                  </h3>
                  <p className="text-gray-400 mt-1 text-xs">
                    Performance summary report for {data?.url}
                  </p>
                </div>
                <div className="mt-6 p-4  flex items-center gap-4 ">
                  <ScoreCircle score={data.performanceScore} />
                  <div>
                    <h5 className="text-2xl font-bold manrope text-green-500">
                      Score
                    </h5>

                    <ul className="mt-1 grid grid-cols-2 grid-rows-2 gap-x-4 p-2 border border-white/20 rounded">
                      <li className="">
                        <h3 className="text-xs text-gray-400">
                          Load time:{" "}
                          <span className="text-white">
                            {data.loadTime.toFixed()} ms
                          </span>
                        </h3>
                      </li>
                      <li className="">
                        <h3 className="text-xs text-gray-400">
                          Time to first byte:{" "}
                          <span className="text-white">
                            {data.timeToFirstByte.toFixed()}
                          </span>
                        </h3>
                      </li>
                      <li className="">
                        <h3 className="text-xs text-gray-400">
                          Page Size:{" "}
                          <span className="text-white">{data.pageSize} kb</span>
                        </h3>
                      </li>
                      <li className="">
                        <h3 className="text-xs text-gray-400">
                          Number of Requests:{" "}
                          <span className="text-white">
                            {data.numberOfRequests}
                          </span>
                        </h3>
                      </li>
                      <li className="">
                        <h3 className="text-xs text-gray-400">
                          Dom Content Loaded Time:{" "}
                          <span className="text-white">
                            {data.domContentLoadedTime.toFixed()} ms
                          </span>
                        </h3>
                      </li>
                      <li className="">
                        <h3 className="text-xs text-gray-400">
                          Fully Loaded Time:{" "}
                          <span className="text-white">
                            {data.fullyLoadedTime.toFixed()} ms
                          </span>
                        </h3>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PerformanceResult;
