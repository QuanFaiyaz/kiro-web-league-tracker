"use client";

import { useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { MatchSummary, GameModeDistribution } from "@/lib/types";

interface RoleDistributionProps {
  matches: MatchSummary[];
}

const COLORS = [
  "#6366f1", // indigo
  "#f59e0b", // amber
  "#10b981", // emerald
  "#ef4444", // red
  "#8b5cf6", // violet
  "#06b6d4", // cyan
  "#f97316", // orange
  "#ec4899", // pink
];

function computeDistribution(matches: MatchSummary[]): GameModeDistribution[] {
  const modeMap = new Map<string, number>();

  for (const match of matches) {
    const mode = match.queueType || "Other";
    modeMap.set(mode, (modeMap.get(mode) || 0) + 1);
  }

  const total = matches.length;
  const distribution: GameModeDistribution[] = [];

  for (const [name, value] of modeMap.entries()) {
    distribution.push({
      name,
      value,
      percentage: Math.round((value / total) * 100),
    });
  }

  distribution.sort((a, b) => b.value - a.value);
  return distribution;
}

export default function RoleDistribution({ matches }: RoleDistributionProps) {
  const data = useMemo(() => computeDistribution(matches), [matches]);

  if (data.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
        Game Mode Distribution
      </h3>
      <div className="h-64 w-full" aria-label="Game mode distribution pie chart">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              dataKey="value"
              nameKey="name"
              paddingAngle={2}
              label={({ name, payload }) => {
                const pct = (payload as GameModeDistribution)?.percentage ?? 0;
                return `${name} ${pct}%`;
              }}
              labelLine={false}
            >
              {data.map((entry, index) => (
                <Cell
                  key={entry.name}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--color-gray-800, #1f2937)",
                border: "1px solid var(--color-gray-700, #374151)",
                borderRadius: "8px",
                color: "var(--color-gray-100, #f3f4f6)",
              }}
              formatter={(value, name) => [
                `${value} games`,
                String(name),
              ]}
            />
            <Legend
              wrapperStyle={{ fontSize: "12px" }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
