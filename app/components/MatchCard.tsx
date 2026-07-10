"use client";

import Image from "next/image";
import { MatchSummary } from "@/lib/types";
import { formatDuration } from "@/lib/format-duration";
import { formatTimeAgo } from "@/lib/time-ago";

interface MatchCardProps {
  match: MatchSummary;
  matchIndex: number;
  totalMatches: number;
  onClick?: () => void;
}

export default function MatchCard({ match, matchIndex, onClick }: MatchCardProps) {
  const borderColor = match.win
    ? "border-green-500/40"
    : "border-red-500/40";
  const resultBg = match.win
    ? "bg-green-500/10"
    : "bg-red-500/10";
  const resultText = match.win
    ? "text-green-400"
    : "text-red-400";
  const resultLabel = match.win ? "Victory" : "Defeat";
  const isMostRecent = matchIndex === 0;

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onClick?.();
    }
  };

  return (
    <article
      className={`relative flex items-center gap-4 rounded-lg border ${borderColor} ${resultBg} p-4 transition-all duration-200 hover:bg-gray-800/60 hover:shadow-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500/60`}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label={`Match #${matchIndex + 1} - ${match.champion} - ${resultLabel} - ${match.kills}/${match.deaths}/${match.assists} KDA - ${match.queueType}`}
    >
      {/* Match number badge */}
      <div className="absolute -top-2 -left-2 flex h-6 w-6 items-center justify-center rounded-full bg-gray-700 text-xs font-bold text-gray-200 ring-2 ring-gray-900">
        #{matchIndex + 1}
      </div>

      {/* Most Recent badge */}
      {isMostRecent && (
        <span className="absolute -top-2 right-2 rounded-full bg-indigo-600 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white shadow-sm">
          Most Recent
        </span>
      )}

      <div className="shrink-0">
        <Image
          src={match.championIcon}
          alt={`${match.champion} icon`}
          width={48}
          height={48}
          className="rounded-full ring-2 ring-gray-700/50"
        />
      </div>
      <div className="flex flex-1 flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-semibold text-gray-100">
            {match.champion}
          </span>
          <span className={`text-xs font-medium ${resultText}`}>
            {resultLabel}
          </span>
          <span className="text-[11px] text-gray-500">
            {formatTimeAgo(match.gameStartTimestamp)}
          </span>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex flex-col items-center">
            <span className="text-gray-100 font-medium">
              {match.kills}/{match.deaths}/{match.assists}
            </span>
            <span className="text-xs text-gray-400">
              {match.kda} KDA
            </span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-gray-300 text-xs">
              {formatDuration(match.gameDuration)}
            </span>
            <span className="text-xs text-gray-500">{match.queueType}</span>
          </div>
        </div>
      </div>
    </article>
  );
}
