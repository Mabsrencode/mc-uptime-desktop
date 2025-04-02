"use client";
import React, { useState } from "react";
import { useAuthStore } from "@/stores/useAuthStore";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import TableStatus from "@/components/reusable/TableStatus/TableStatus";
import UptimeLoading from "@/components/reusable/UptimeLoading/UptimeLoading";
import { GoFilter } from "react-icons/go";
import { FaTrash } from "react-icons/fa";
import Link from "next/link";
import filterData from "../../monitors/SystemStatusListTable/filterData";
import Pagination from "@/components/reusable/Pagination/Pagination";

interface GetIncidentsByUserResponse {
  data: IncidentLogsData[] | null;
  total: number;
}

const Content = () => {
  const [openFilter, setOpenFilter] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [monitorTypesFilter, setMonitorTypesFilter] = useState<string>();
  const [statusFilter, setStatusFilter] = useState<"up" | "down" | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(10);

  const handleStatusFilterChange = (status: "up" | "down") => {
    setStatusFilter((prev) => (prev === status ? null : status));
    setCurrentPage(1);
  };

  const { data: user } = useAuthStore();
  const router = useRouter();
  const handleNavigateIncident = (id: string) => {
    router.push(`/incidents/${id}`);
  };
  const userId = user && user.user && user.user.userID;

  const handleGetAllIncidents = async (
    searchTerm: string = "",
    type: string = "",
    status: "up" | "down" | null = null,
    page: number = 1,
    perPage: number = postsPerPage
  ) => {
    const response =
      userId &&
      (await fetch(
        `/api/monitor/incidents?userId=${userId}&search=${searchTerm}&type=${type}&status=${status}&page=${page}&perPage=${perPage}`
      ));
    if (!response) throw new Error("Something went wrong from the server.");
    if (!response.ok) throw new Error("Failed to fetch incidents");
    const data = await response.json();
    return data;
  };

  const { data, isLoading, error } =
    useQuery<GetIncidentsByUserResponse | null>({
      queryKey: [
        "incidents",
        userId,
        searchTerm,
        monitorTypesFilter,
        statusFilter,
        currentPage,
        postsPerPage,
      ],
      queryFn: () =>
        handleGetAllIncidents(
          searchTerm,
          monitorTypesFilter,
          statusFilter,
          currentPage,
          postsPerPage
        ),
      staleTime: 10 * 60 * 1000,
      retry: false,
    });
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  const nextPage = () => {
    if (
      data &&
      data.total &&
      currentPage < Math.ceil(data.total / postsPerPage)
    ) {
      setCurrentPage(currentPage + 1);
    }
  };
  const previousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  if (isLoading && !searchTerm && !monitorTypesFilter && !statusFilter)
    return <UptimeLoading />;
  if (error)
    return (
      <div>
        <p>Something went wrong: {error.message}</p>
      </div>
    );

  return (
    <section className="text-white w-full px-4 container mx-auto">
      <div className="mt-6 flex w-full justify-between mb-6">
        <div>
          <h1 className="text-4xl font-bold manrope">
            Incidents<span className="text-green-500">.</span>
          </h1>
        </div>
        {(data && data.data && data.data.length > 0) ||
        searchTerm ||
        monitorTypesFilter ||
        statusFilter ? (
          <div className="flex items-center gap-2 text-xs my-2 w-full justify-end">
            <div className="flex items-center">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search by name or URL"
                className="border border-white/20 outline-none px-2 py-1 rounded"
              />
              <select
                onClick={() => {
                  setOpenFilter(false);
                }}
                value={monitorTypesFilter}
                onChange={(e) => {
                  setMonitorTypesFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="border border-white/20 text-gray-400 outline-none px-2 py-1 ml-2 rounded"
              >
                <option value="HTTP" className="bg-green-950">
                  HTTP
                </option>
                <option value="Ping" className="bg-green-950">
                  Ping
                </option>
                <option value="Port" className="bg-green-950">
                  Port
                </option>
                <option value="IP Address" className="bg-green-950">
                  IP Address
                </option>
              </select>
              <div className="relative border border-white/20 text-gray-400 outline-none px-2 py-1 ml-2 rounded">
                <span
                  onClick={() => setOpenFilter(!openFilter)}
                  className="flex items-center gap-2"
                >
                  <GoFilter className="inline" /> Filter
                </span>
                {openFilter && (
                  <div className="absolute top-7 right-0 overflow-hidden w-[200px] z-[500] border-b border-x border-white/20 rounded">
                    {filterData.map((e) => (
                      <div
                        key={e.label}
                        className="flex items-center gap-2 bg-green-950  p-2 border-t border-white/20 hover:bg-[#000d07] cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          onChange={() => {
                            handleStatusFilterChange(e.value as "up" | "down");
                            setCurrentPage(1);
                          }}
                          id={e.label}
                          value={e.value}
                          checked={statusFilter === e.value}
                        />
                        <label
                          className="block cursor-pointer w-full"
                          htmlFor={e.label}
                        >
                          {e.label}
                        </label>
                      </div>
                    ))}
                    <button
                      onClick={() => {
                        setSearchTerm("");
                        setMonitorTypesFilter("");
                        setStatusFilter(null);
                        setCurrentPage(1);
                      }}
                      className="flex items-center gap-2 justify-center bg-green-950  p-2 border-t border-white/20 hover:bg-[#000d07] cursor-pointer w-full"
                    >
                      <FaTrash className="text-xs" /> Clear all filters
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : null}
      </div>
      {isLoading ? (
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
      ) : error ? (
        <div>{(error as unknown as Error).message}</div>
      ) : data && data.data && data.data.length === 0 ? (
        (data && data.data.length === 0 && searchTerm) ||
        (data && data.data.length === 0 && monitorTypesFilter) ||
        (data && data.data.length === 0 && statusFilter) ? (
          <div className="mt-24 mx-auto w-[400px]">
            <h4 className="manrope text-center text-xl manrope font-bold">
              🤐 No <span className="text-green-500">results</span> match your
              criteria<span className="text-green-500">.</span>
            </h4>
            <p className="text-center text-xs mt-2 text-gray-400">
              We haven&apos;t found any incidents based on your search and/or
              filter criteria. Try expanding your search or clearing your
              filters to get some results.
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setMonitorTypesFilter("");
                setCurrentPage(1);
              }}
              className="bg-green-700 hover:bg-green-700/70 cursor-pointer px-3 py-1 rounded text-xs font-medium text-white flex items-center gap-1 mx-auto mt-4"
            >
              Clear all filters and search
            </button>
          </div>
        ) : (
          <div className="w-full mt-24 text-center  p-4 border border-white/20 border-dotted">
            <h1 className="text-white text-xl font-bold manrope">
              No incidents found.
            </h1>
            <p className="text-sm my-2 inter w-[500px] mx-auto">
              Keep an eye on your{" "}
              <span className="text-green-500">
                website, API, email service, or any port or device on the
                network
              </span>
              . Ping our servers to track cron jobs and stay on top of critical
              incidents.
            </p>
            <Link
              href={"/monitors"}
              className="bg-green-700 hover:bg-green-700/70 cursor-pointer px-3 py-1 rounded text-xs font-medium text-white inline"
            >
              Start creating your first monitor
            </Link>
          </div>
        )
      ) : (
        data && (
          <>
            <TableStatus
              bgColored
              data={data}
              bordered
              showUrl
              handleNavigateIncident={handleNavigateIncident}
            />
            {data.total > postsPerPage && (
              <Pagination
                postsPerPage={postsPerPage}
                totalPosts={data.total}
                paginate={paginate}
                previousPage={previousPage}
                nextPage={nextPage}
                currentPage={currentPage}
              />
            )}
          </>
        )
      )}
    </section>
  );
};

export default Content;
