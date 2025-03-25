import { format } from "date-fns";
import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface Check {
  checkedAt: string;
  average_response: number | null;
}

interface ResponseTimeGraphProps {
  data: Check[];
}

const ResponseTimeGraph: React.FC<ResponseTimeGraphProps> = ({ data }) => {
  const formattedData = data.map((check) => ({
    time: format(new Date(check.checkedAt), "yyyy-MM-dd HH:mm:ss"),
    Response: check.average_response || 0,
  }));

  return (
    <div className="bg-[#000d07]/70 pr-2 pt-3 rounded border border-white/20">
      <ResponsiveContainer width="100%" height={200}>
        <LineChart className="text-[10px]" data={formattedData}>
          <XAxis dataKey="time" stroke="#bbb" minTickGap={50} />
          <YAxis stroke="#bbb" />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-white p-2 rounded shadow">
                    <p className="text-black">{payload[0].payload.time}</p>
                    <p className="text-green-500">
                      Response: {payload[0].value}
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Line
            type="monotone"
            dataKey="Response"
            stroke="#4ade80"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ResponseTimeGraph;
