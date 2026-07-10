"use client";

import { RankedEntry } from "@/lib/types";

interface RankBadgeProps {
  rankedEntry: RankedEntry;
}

const TIER_COLORS: Record<string, string> = {
  IRON: "text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600",
  BRONZE: "text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 border-amber-300 dark:border-amber-700",
  SILVER: "text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-600",
  GOLD: "text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-300 dark:border-yellow-700",
  PLATINUM: "text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-900/20 border-cyan-300 dark:border-cyan-700",
  EMERALD: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 border-emerald-300 dark:border-emerald-700",
  DIAMOND: "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-700",
  MASTER: "text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20 border-purple-300 dark:border-purple-700",
  GRANDMASTER: "text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20 border-purple-300 dark:border-purple-700",
  CHALLENGER: "text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20 border-purple-300 dark:border-purple-700",
};

function formatTierName(tier: string): string {
  return tier.charAt(0) + tier.slice(1).toLowerCase();
}

function getQueueLabel(queueType: string): string {
  if (queueType === "RANKED_SOLO_5x5") return "Solo/Duo";
  if (queueType === "RANKED_FLEX_SR") return "Flex";
  return queueType;
}

export default function RankBadge({ rankedEntry }: RankBadgeProps) {
  const { tier, rank, leaguePoints, queueType } = rankedEntry;
  const colorClasses = TIER_COLORS[tier] ?? TIER_COLORS.IRON;
  const tierName = formatTierName(tier);
  const showDivision = !["MASTER", "GRANDMASTER", "CHALLENGER"].includes(tier);

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${colorClasses}`}
      aria-label={`${getQueueLabel(queueType)}: ${tierName} ${showDivision ? rank : ""} ${leaguePoints} LP`}
    >
      <span>{getQueueLabel(queueType)}</span>
      <span className="opacity-40">|</span>
      <span>
        {tierName} {showDivision && rank} - {leaguePoints} LP
      </span>
    </span>
  );
}
