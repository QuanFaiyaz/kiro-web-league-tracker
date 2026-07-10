"use client";

import { MatchSummary } from "@/lib/types";

interface WinRateBarProps {
  matches: MatchSummary[];
}

export default function WinRateBar({ matches }: WinRateBarProps) {
  if (matches.length === 0) return null;

  const wins = matches.filter((m) => m.win).length;
  const losses = matches.length - wins;
  const winRate = Math.round((wins / matches.length) * 100);

  return (
    <div className="w-full" aria-label={`Win rate: ${winRate}% from ${matches.length} games`}>
      <div className="mb-1.5 flex items-center justify-between text-sm font-medium">
        <span className="text-green-600 dark:text-green-400">{wins}W</span>
        <span className="text-gray-600 dark:text-gray-400">{winRate}%</span>
        <span className="text-red-600 dark:text-red-400">{losses}L</span>
      </div>
      <div
        className="flex h-2.5 w-full overflow-hidden rounded-full"
        role="progressbar"
        aria-valuenow={winRate}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="bg-green-500 dark:bg-green-400 transition-all duration-500"
          style={{ width: `${winRate}%` }}
        />
        <div
          className="bg-red-500 dark:bg-red-400 transition-all duration-500"
          style={{ width: `${100 - winRate}%` }}
        />
      </div>
    </div>
  );
}
