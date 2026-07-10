"use client";

import { MatchSummary } from "@/lib/types";
import ChampionStats from "./ChampionStats";
import RoleDistribution from "./RoleDistribution";
import PerformanceTrends from "./PerformanceTrends";

interface AnalyticsSectionProps {
  matches: MatchSummary[];
}

export default function AnalyticsSection({ matches }: AnalyticsSectionProps) {
  if (matches.length === 0) {
    return null;
  }

  return (
    <section aria-label="Performance Analytics" className="mt-6 flex flex-col gap-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          Performance Analytics
        </h2>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Based on all loaded matches
        </p>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="md:col-span-2 lg:col-span-1">
          <ChampionStats matches={matches} />
        </div>
        <div>
          <RoleDistribution matches={matches} />
        </div>
        <div>
          <PerformanceTrends matches={matches} />
        </div>
      </div>
    </section>
  );
}
