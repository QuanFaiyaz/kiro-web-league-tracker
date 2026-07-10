"use client";

import { useMemo } from "react";
import Image from "next/image";
import { MatchSummary, ChampionStatsSummary } from "@/lib/types";

interface ChampionStatsProps {
  matches: MatchSummary[];
}

function computeChampionStats(matches: MatchSummary[]): ChampionStatsSummary[] {
  const champMap = new Map<
    string,
    {
      champion: string;
      championIcon: string;
      games: number;
      wins: number;
      totalKda: number;
      totalCsPerMin: number;
    }
  >();

  for (const match of matches) {
    const existing = champMap.get(match.champion);
    const kdaValue = match.kda === "Perfect" ? 10 : parseFloat(match.kda);
    const kdaNum = isNaN(kdaValue) ? 0 : kdaValue;

    if (existing) {
      existing.games += 1;
      existing.wins += match.win ? 1 : 0;
      existing.totalKda += kdaNum;
      existing.totalCsPerMin += match.csPerMinute;
    } else {
      champMap.set(match.champion, {
        champion: match.champion,
        championIcon: match.championIcon,
        games: 1,
        wins: match.win ? 1 : 0,
        totalKda: kdaNum,
        totalCsPerMin: match.csPerMinute,
      });
    }
  }

  const stats: ChampionStatsSummary[] = [];
  for (const data of champMap.values()) {
    stats.push({
      champion: data.champion,
      championIcon: data.championIcon,
      gamesPlayed: data.games,
      wins: data.wins,
      winRate: Math.round((data.wins / data.games) * 100),
      avgKda: parseFloat((data.totalKda / data.games).toFixed(2)),
      avgCsPerMinute: parseFloat((data.totalCsPerMin / data.games).toFixed(1)),
    });
  }

  stats.sort((a, b) => b.gamesPlayed - a.gamesPlayed);
  return stats.slice(0, 8);
}

export default function ChampionStats({ matches }: ChampionStatsProps) {
  const championStats = useMemo(() => computeChampionStats(matches), [matches]);

  if (championStats.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
        Champion Performance
      </h3>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {championStats.map((stat) => (
          <article
            key={stat.champion}
            className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-3 shadow-sm dark:border-gray-700 dark:bg-gray-800"
            aria-label={`${stat.champion} stats`}
          >
            <Image
              src={stat.championIcon}
              alt={stat.champion}
              width={40}
              height={40}
              className="rounded-md"
            />
            <div className="flex flex-1 flex-col gap-0.5 overflow-hidden">
              <span className="truncate text-sm font-medium text-gray-900 dark:text-gray-100">
                {stat.champion}
              </span>
              <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-gray-500 dark:text-gray-400">
                <span>{stat.gamesPlayed} games</span>
                <span
                  className={
                    stat.winRate >= 60
                      ? "text-green-600 dark:text-green-400"
                      : stat.winRate < 40
                        ? "text-red-600 dark:text-red-400"
                        : ""
                  }
                >
                  {stat.winRate}% WR
                </span>
                <span>{stat.avgKda} KDA</span>
                <span>{stat.avgCsPerMinute} CS/m</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
