"use client";

import { useCallback } from "react";

export type GameModeFilter = "all" | "ranked_solo" | "ranked_flex" | "normal" | "aram";
export type DateRangeFilter = "all" | "24h" | "7d" | "30d";

export interface MatchFilterValues {
  champion: string;
  gameMode: GameModeFilter;
  dateRange: DateRangeFilter;
}

interface MatchFiltersProps {
  filters: MatchFilterValues;
  onChange: (filters: MatchFilterValues) => void;
  totalMatches: number;
  filteredCount: number;
}

const gameModeOptions: { value: GameModeFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "ranked_solo", label: "Ranked Solo" },
  { value: "ranked_flex", label: "Ranked Flex" },
  { value: "normal", label: "Normal" },
  { value: "aram", label: "ARAM" },
];

const dateRangeOptions: { value: DateRangeFilter; label: string }[] = [
  { value: "all", label: "All Time" },
  { value: "24h", label: "Last 24h" },
  { value: "7d", label: "Last 7 Days" },
  { value: "30d", label: "Last 30 Days" },
];

export default function MatchFilters({
  filters,
  onChange,
  totalMatches,
  filteredCount,
}: MatchFiltersProps) {
  const handleChampionChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange({ ...filters, champion: e.target.value });
    },
    [filters, onChange]
  );

  const handleGameModeChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      onChange({ ...filters, gameMode: e.target.value as GameModeFilter });
    },
    [filters, onChange]
  );

  const handleDateRangeChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      onChange({ ...filters, dateRange: e.target.value as DateRangeFilter });
    },
    [filters, onChange]
  );

  const isFiltered = filters.champion || filters.gameMode !== "all" || filters.dateRange !== "all";

  return (
    <section aria-label="Match filters" className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-3">
        {/* Champion filter */}
        <div className="flex flex-col gap-1">
          <label
            htmlFor="champion-filter"
            className="text-xs font-medium text-gray-600 dark:text-gray-400"
          >
            Champion
          </label>
          <input
            id="champion-filter"
            type="text"
            placeholder="Filter by champion..."
            value={filters.champion}
            onChange={handleChampionChange}
            className="h-9 w-44 rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-900 placeholder-gray-400 transition-colors focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500 dark:focus:border-indigo-400 dark:focus:ring-indigo-400"
          />
        </div>

        {/* Game mode filter */}
        <div className="flex flex-col gap-1">
          <label
            htmlFor="gamemode-filter"
            className="text-xs font-medium text-gray-600 dark:text-gray-400"
          >
            Game Mode
          </label>
          <select
            id="gamemode-filter"
            value={filters.gameMode}
            onChange={handleGameModeChange}
            className="h-9 w-36 rounded-md border border-gray-300 bg-white px-2 text-sm text-gray-900 transition-colors focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-indigo-400 dark:focus:ring-indigo-400"
          >
            {gameModeOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Date range filter */}
        <div className="flex flex-col gap-1">
          <label
            htmlFor="daterange-filter"
            className="text-xs font-medium text-gray-600 dark:text-gray-400"
          >
            Date Range
          </label>
          <select
            id="daterange-filter"
            value={filters.dateRange}
            onChange={handleDateRangeChange}
            className="h-9 w-36 rounded-md border border-gray-300 bg-white px-2 text-sm text-gray-900 transition-colors focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-indigo-400 dark:focus:ring-indigo-400"
          >
            {dateRangeOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Filter results count */}
      {isFiltered && (
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Showing {filteredCount} of {totalMatches} matches
        </p>
      )}
    </section>
  );
}
