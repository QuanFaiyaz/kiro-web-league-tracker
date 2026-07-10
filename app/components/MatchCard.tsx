"use client";

import Image from "next/image";
import { MatchSummary } from "@/lib/types";
import { formatDuration } from "@/lib/format-duration";
import { formatTimeAgo } from "@/lib/time-ago";

interface MatchCardProps {
  match: MatchSummary;
  matchIndex: number;
  onClick?: () => void;
}

export default function MatchCard({ match, matchIndex, onClick }: MatchCardProps) {
  const accentColor = match.win ? "border-l-green-500" : "border-l-red-500";
  const resultText = match.win ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400";
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
      className={`group relative overflow-visible border-l-4 ${accentColor} rounded-lg bg-gray-50 p-4 transition-all duration-200 hover:scale-[1.02] hover:shadow-lg dark:bg-gray-900 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500/60`}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label={`Match #${matchIndex + 1} - ${match.champion} - ${resultLabel} - ${match.kills}/${match.deaths}/${match.assists} KDA - ${match.queueType}`}
    >
      {/* Most Recent badge */}
      {isMostRecent && (
        <span className="absolute -top-2 right-2 rounded-full bg-indigo-600 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white shadow-sm">
          Most Recent
        </span>
      )}

      <div className="flex items-center gap-4">
        <div className="shrink-0">
          <Image
            src={match.championIcon}
            alt={`${match.champion} icon`}
            width={48}
            height={48}
            className="rounded-full ring-2 ring-gray-200 dark:ring-gray-700/50"
          />
        </div>
        <div className="flex flex-1 flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-0.5">
            <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              {match.champion}
            </span>
            <span className={`text-xs font-medium ${resultText}`}>
              {resultLabel}
            </span>
            <span className="text-[11px] text-gray-400 dark:text-gray-500">
              {formatTimeAgo(match.gameStartTimestamp)}
            </span>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex flex-col items-center">
              <span className="font-medium text-gray-900 dark:text-gray-100">
                {match.kills}/{match.deaths}/{match.assists}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {match.kda} KDA
              </span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-xs text-gray-600 dark:text-gray-300">
                {match.csPerMinute} CS/min
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {match.visionScore} vision
              </span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-xs text-gray-600 dark:text-gray-300">
                {formatDuration(match.gameDuration)}
              </span>
              <span className="text-xs text-gray-400 dark:text-gray-500">{match.queueType}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Items - visible on hover */}
      {match.items.length > 0 && (
        <div className="mt-3 hidden items-center gap-1.5 group-hover:flex">
          {match.items.map((item) => (
            <div
              key={item.id}
              className="relative h-7 w-7 overflow-hidden rounded border border-gray-200 dark:border-gray-700"
            >
              <Image
                src={item.iconUrl}
                alt={`Item ${item.id}`}
                fill
                sizes="28px"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      )}
    </article>
  );
}
