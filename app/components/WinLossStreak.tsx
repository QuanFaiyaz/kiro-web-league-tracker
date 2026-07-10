"use client";

import { MatchSummary } from "@/lib/types";

interface WinLossStreakProps {
  matches: MatchSummary[];
}

export default function WinLossStreak({ matches }: WinLossStreakProps) {
  if (matches.length === 0) return null;

  const firstResult = matches[0].win;
  let streak = 0;

  for (const match of matches) {
    if (match.win === firstResult) {
      streak++;
    } else {
      break;
    }
  }

  if (streak < 2) return null;

  const isWinStreak = firstResult;
  const label = isWinStreak ? "Win Streak" : "Loss Streak";
  const colorClasses = isWinStreak
    ? "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
    : "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800";

  return (
    <div
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-semibold ${colorClasses}`}
      aria-label={`Current streak: ${streak} ${label}`}
    >
      <span className="text-base" aria-hidden="true">
        {isWinStreak ? "\u{1F525}" : "\u{1F4A8}"}
      </span>
      <span>{streak} {label}</span>
    </div>
  );
}
