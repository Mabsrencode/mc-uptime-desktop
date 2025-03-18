import {
  differenceInHours,
  differenceInMinutes,
  differenceInSeconds,
  format,
} from "date-fns";
import React from "react";

interface IncidentLogsData {
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
}

interface IncidentData {
  data: { data: IncidentLogsData[] | null };
  handleNavigateIncident: (id: string) => void;
  bordered: boolean;
  showUrl: boolean;
  bgColored: boolean;
}

const TableStatus: React.FC<IncidentData> = ({
  data,
  handleNavigateIncident,
  bordered,
  showUrl,
  bgColored,
}) => {
  return (
    <div
      className={`overflow-hidden ${bgColored && "bg-green-950/90"} ${
        bordered && "border border-white/20 rounded"
      }`}
    >
      <div className="w-full overflow-auto">
        <table className="min-w-full border-collapse text-left">
          <thead>
            <tr
              className={`border-b border-white/20 ${
                bgColored && "bg-[#000d07]/70"
              } text-xs manrope`}
            >
              <th className="px-6 py-3 whitespace-nowrap">Status</th>
              {showUrl && (
                <th className="px-6 py-3 whitespace-nowrap">Monitor</th>
              )}
              <th className="px-6 py-3 whitespace-nowrap">Root Cause</th>
              <th className="px-6 py-3 whitespace-nowrap">Started</th>
              <th className="px-6 py-3 whitespace-nowrap">Duration</th>
            </tr>
          </thead>
          <tbody>
            {data &&
              data.data &&
              data.data.length > 0 &&
              data.data.map((log) => {
                const startedDate = new Date(log.startTime);
                const resolvedDate = log.resolved
                  ? new Date(log.endTime ?? "")
                  : new Date();

                const formattedStarted = format(
                  startedDate,
                  "MMM d, yyyy, hh:mm a"
                );

                const hours = differenceInHours(resolvedDate, startedDate);
                const minutes =
                  differenceInMinutes(resolvedDate, startedDate) % 60;
                const seconds =
                  differenceInSeconds(resolvedDate, startedDate) % 60;

                const formattedDuration = `${hours}h ${minutes}m ${seconds}s`;

                return (
                  <tr
                    onClick={() => handleNavigateIncident(log.id)}
                    key={log.id}
                    className="border-t border-white/20 hover:bg-green-900/40 text-white text-xs cursor-pointer"
                  >
                    <td className="px-6 py-4 flex items-center gap-2">
                      <div
                        className={`h-3 w-3 rounded-full ${
                          log.resolved ? "bg-green-500" : "bg-red-500"
                        }`}
                      ></div>
                      <span
                        className={`${
                          log.resolved ? "text-green-500" : "text-red-500"
                        } font-bold`}
                      >
                        {log.resolved ? "Resolved" : "Ongoing"}
                      </span>
                    </td>

                    {showUrl && (
                      <td className="px-6 py-4 max-w-[150px] whitespace-nowrap overflow-hidden text-ellipsis">
                        <span className="text-gray-400 truncate block">
                          {log.url}
                        </span>
                      </td>
                    )}
                    <td className="text-center px-6 py-4 max-w-[200px] whitespace-nowrap overflow-hidden text-ellipsis">
                      <span className="bg-red-500/50 text-white px-2 py-1 rounded-md text-xs truncate block">
                        {log.error}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-gray-400 max-w-[180px] whitespace-nowrap overflow-hidden text-ellipsis">
                      {formattedStarted}
                    </td>

                    <td className="px-6 py-4 text-gray-400 max-w-[100px] whitespace-nowrap overflow-hidden text-ellipsis">
                      {formattedDuration}
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TableStatus;
