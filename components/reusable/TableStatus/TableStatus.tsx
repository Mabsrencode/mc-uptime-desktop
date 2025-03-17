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
}
const TableStatus: React.FC<IncidentData> = ({
  data,
  handleNavigateIncident,
}) => {
  console.log(data);
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="border-b border-white/20 text-gray-400 text-sm manrope">
            <th className="px-6 py-3">Status</th>
            <th className="px-6 py-3">Root Cause</th>
            <th className="px-6 py-3">Started</th>
            <th className="px-6 py-3">Duration</th>
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
                  className="border-b border-white/20 hover:bg-green-900/40 text-white text-xs cursor-pointer"
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

                  <td className="px-6 py-4">
                    <span className="bg-red-500/50 text-white px-2 py-1 rounded-md text-xs">
                      {log.error}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-gray-400">
                    {formattedStarted}
                  </td>

                  <td className="px-6 py-4 text-gray-400">
                    {formattedDuration}
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
};

export default TableStatus;
