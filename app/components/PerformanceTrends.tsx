"use client";

import { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { MatchSummary, PerformanceTrendPoint } from "@/lib/types";

interface PerformanceTrendsProps {
  matches: MatchSummary[];
}

function computeTrends(matches: MatchSummary[]): PerformanceTrendPoint[] {
  // Sort chronologically (oldest first)
  const sorted = [...matches].sort(
    (a, b) => a.gameStartTimestamp - b.gameStartTimestamp
  );

  const points: PerformanceTrendPoint[] = [];
  const windowSize = 5;

  for (let i = 0; i < sorted.length; i++) {
    const match = sorted[i];
    const kdaValue = match.kda === "Perfect" ? 10 : parseFloat(match.kda);
    const kdaNum = isNaN(kdaValue) ? 0 : kdaValue;

    // Calculate rolling win rate over last 5 games
    const start = Math.max(0, i - windowSize + 1);
    const window = sorted.slice(start, i + 1);
    const wins = window.filter((m) => m.win).length;
    const rollingWinRate = Math.round((wins / window.length) * 100);

    points.push({
      index: i + 1,
      label: `G${i + 1}`,
      kda: parseFloat(kdaNum.toFixed(2)),
      rollingWinRate,
    });
  }

  return points;
}

export default function PerformanceTrends({ matches }: PerformanceTrendsProps) {
  const data = useMemo(() => computeTrends(matches), [matches]);

  if (data.length < 2) {
    return null;
  }

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
        Performance Trends
      </h3>
      <div className="h-64 w-full" aria-label="Performance trends line chart">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
          >
            <XAxis
              dataKey="label"
              tick={{ fontSize: 11, fill: "#9ca3af" }}
              axisLine={{ stroke: "#4b5563" }}
              tickLine={{ stroke: "#4b5563" }}
            />
            <YAxis
              yAxisId="kda"
              orientation="left"
              tick={{ fontSize: 11, fill: "#9ca3af" }}
              axisLine={{ stroke: "#4b5563" }}
              tickLine={{ stroke: "#4b5563" }}
              label={{
                value: "KDA",
                angle: -90,
                position: "insideLeft",
                style: { fontSize: 11, fill: "#9ca3af" },
              }}
            />
            <YAxis
              yAxisId="winrate"
              orientation="right"
              domain={[0, 100]}
              tick={{ fontSize: 11, fill: "#9ca3af" }}
              axisLine={{ stroke: "#4b5563" }}
              tickLine={{ stroke: "#4b5563" }}
              label={{
                value: "Win %",
                angle: 90,
                position: "insideRight",
                style: { fontSize: 11, fill: "#9ca3af" },
              }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1f2937",
                border: "1px solid #374151",
                borderRadius: "8px",
                color: "#f3f4f6",
              }}
              labelStyle={{ color: "#9ca3af" }}
            />
            <Legend wrapperStyle={{ fontSize: "12px" }} />
            <Line
              yAxisId="kda"
              type="monotone"
              dataKey="kda"
              name="KDA"
              stroke="#6366f1"
              strokeWidth={2}
              dot={{ r: 3, fill: "#6366f1" }}
              activeDot={{ r: 5 }}
            />
            <Line
              yAxisId="winrate"
              type="monotone"
              dataKey="rollingWinRate"
              name="Win Rate %"
              stroke="#10b981"
              strokeWidth={2}
              dot={{ r: 3, fill: "#10b981" }}
              activeDot={{ r: 5 }}
              strokeDasharray="4 2"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
