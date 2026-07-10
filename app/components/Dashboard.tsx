"use client";

import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import SearchForm from "./SearchForm";
import RegionSelector from "./RegionSelector";
import MatchHistory from "./MatchHistory";
import ErrorDisplay from "./ErrorDisplay";
import SkeletonLoader from "./SkeletonLoader";
import RankBadge from "./RankBadge";
import MatchFilters, { type MatchFilterValues, type GameModeFilter, type DateRangeFilter } from "./MatchFilters";
import AnalyticsSection from "./AnalyticsSection";
import { useToast } from "./ToastProvider";
import { MatchSummary, RiotAccount, ApiSuccessResponse, ApiErrorResponse, Region, RankedEntry } from "@/lib/types";

function applyFilters(matches: MatchSummary[], filters: MatchFilterValues): MatchSummary[] {
  let filtered = matches;

  // Champion filter
  if (filters.champion.trim()) {
    const search = filters.champion.trim().toLowerCase();
    filtered = filtered.filter((m) =>
      m.champion.toLowerCase().includes(search)
    );
  }

  // Game mode filter
  if (filters.gameMode !== "all") {
    filtered = filtered.filter((m) => {
      const qt = m.queueType.toLowerCase();
      switch (filters.gameMode as GameModeFilter) {
        case "ranked_solo":
          return qt.includes("ranked solo") || m.queueId === 420;
        case "ranked_flex":
          return qt.includes("ranked flex") || m.queueId === 440;
        case "normal":
          return qt.includes("normal") || m.queueId === 400 || m.queueId === 430;
        case "aram":
          return qt.includes("aram") || m.queueId === 450;
        default:
          return true;
      }
    });
  }

  // Date range filter
  if (filters.dateRange !== "all") {
    const now = Date.now();
    let cutoff = 0;
    switch (filters.dateRange as DateRangeFilter) {
      case "24h":
        cutoff = now - 24 * 60 * 60 * 1000;
        break;
      case "7d":
        cutoff = now - 7 * 24 * 60 * 60 * 1000;
        break;
      case "30d":
        cutoff = now - 30 * 24 * 60 * 60 * 1000;
        break;
    }
    if (cutoff > 0) {
      filtered = filtered.filter((m) => m.gameStartTimestamp >= cutoff);
    }
  }

  return filtered;
}

export default function Dashboard() {
  const [matches, setMatches] = useState<MatchSummary[]>([]);
  const [account, setAccount] = useState<RiotAccount | null>(null);
  const [rankedData, setRankedData] = useState<RankedEntry[]>([]);
  const [rankedError, setRankedError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [loadMoreError, setLoadMoreError] = useState(false);
  const [error, setError] = useState<{ message: string; status?: number } | null>(null);
  const [warning, setWarning] = useState<string | null>(null);
  const [region, setRegion] = useState<Region>("americas");
  const [hasMore, setHasMore] = useState(true);
  const [filters, setFilters] = useState<MatchFilterValues>({
    champion: "",
    gameMode: "all",
    dateRange: "all",
  });
  const lastSearchRef = useRef<{ gameName: string; tagLine: string } | null>(null);
  const { addToast } = useToast();

  const filteredMatches = useMemo(() => applyFilters(matches, filters), [matches, filters]);

  const handleSearch = useCallback(async (gameName: string, tagLine: string) => {
    setIsLoading(true);
    setError(null);
    setWarning(null);
    setMatches([]);
    setAccount(null);
    setRankedData([]);
    setRankedError(null);
    setHasMore(true);
    setFilters({ champion: "", gameMode: "all", dateRange: "all" });
    lastSearchRef.current = { gameName, tagLine };

    try {
      const params = new URLSearchParams({ gameName, tagLine, region });
      const response = await fetch(`/api/riot?${params.toString()}`);

      if (!response.ok) {
        const errorData: ApiErrorResponse = await response.json();
        setError({ message: errorData.error, status: errorData.status });
        addToast(errorData.error, "error");
        return;
      }

      const data: ApiSuccessResponse = await response.json();
      setMatches(data.matches);
      setAccount(data.account);
      if (data.rankedData) {
        setRankedData(data.rankedData);
      }
      if (data.rankedError) {
        setRankedError(data.rankedError);
      }
      if (data.warning) {
        setWarning(data.warning);
      }
      if (data.matches.length < 10) {
        setHasMore(false);
      }
      addToast(`Found ${data.matches.length} matches for ${data.account.gameName}`, "success");
    } catch {
      setError({ message: "Failed to connect to the server. Please check your connection and try again." });
      addToast("Failed to connect to the server. Please try again.", "error");
    } finally {
      setIsLoading(false);
    }
  }, [region, addToast]);

  const handleLoadMore = useCallback(async () => {
    if (!lastSearchRef.current || isLoadingMore) return;

    setIsLoadingMore(true);
    setLoadMoreError(false);

    try {
      const { gameName, tagLine } = lastSearchRef.current;
      const params = new URLSearchParams({
        gameName,
        tagLine,
        region,
        start: String(matches.length),
      });
      const response = await fetch(`/api/riot?${params.toString()}`);

      if (!response.ok) {
        setLoadMoreError(true);
        addToast("Failed to load more matches. Please try again.", "error");
        return;
      }

      const data: ApiSuccessResponse = await response.json();
      if (data.matches.length < 10) {
        setHasMore(false);
      }
      if (data.matches.length > 0) {
        setMatches((prev) => [...prev, ...data.matches]);
      } else {
        setHasMore(false);
      }
    } catch {
      setLoadMoreError(true);
      addToast("Failed to load more matches. Please try again.", "error");
    } finally {
      setIsLoadingMore(false);
    }
  }, [region, matches.length, isLoadingMore, addToast]);

  useEffect(() => {
    if (lastSearchRef.current) {
      handleSearch(lastSearchRef.current.gameName, lastSearchRef.current.tagLine);
    }
  }, [region, handleSearch]);

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-8 px-4 py-8 scroll-pt-28">
      <div className="sticky top-0 z-10 -mx-4 flex flex-col gap-4 bg-white/80 px-4 py-4 backdrop-blur-md dark:bg-gray-950/80">
        <section aria-label="Summoner search">
          <SearchForm onSearch={handleSearch} isLoading={isLoading} />
        </section>

        <section aria-label="Region selection">
          <RegionSelector selectedRegion={region} onChange={setRegion} disabled={isLoading} />
        </section>
      </div>

      <div className="pt-2">
        {isLoading && <SkeletonLoader />}

        {error && !isLoading && <ErrorDisplay message={error.message} status={error.status} />}

        {warning && !isLoading && !error && (
          <aside aria-label="Warning" className="rounded-lg border border-yellow-500/50 bg-yellow-50/50 px-4 py-3 text-sm text-yellow-700 dark:border-yellow-600/50 dark:bg-yellow-900/20 dark:text-yellow-300">
            {warning}
          </aside>
        )}

        {account && !isLoading && !error && (
          <section aria-label="Summoner info" className="flex flex-col items-center gap-2 text-center">
            <p className="text-lg font-medium text-gray-800 dark:text-gray-200">
              {account.gameName}
              <span className="text-gray-400 dark:text-gray-500">#{account.tagLine}</span>
            </p>
            {rankedData.length > 0 && (
              <div className="flex flex-wrap justify-center gap-2">
                {rankedData.map((entry) => (
                  <RankBadge key={entry.queueType} rankedEntry={entry} />
                ))}
              </div>
            )}
            {rankedError && rankedData.length === 0 && (
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {rankedError}
              </p>
            )}
          </section>
        )}

        {account && !isLoading && !error && matches.length > 0 && (
          <AnalyticsSection matches={matches} />
        )}

        {account && !isLoading && !error && matches.length > 0 && (
          <div className="mt-4">
            <MatchFilters
              filters={filters}
              onChange={setFilters}
              totalMatches={matches.length}
              filteredCount={filteredMatches.length}
            />
          </div>
        )}

        {account && !isLoading && !error && (
          <MatchHistory matches={filteredMatches} />
        )}

        {account && !isLoading && !error && matches.length > 0 && hasMore && (
          <div className="flex flex-col items-center gap-2 pb-8">
            <button
              type="button"
              onClick={handleLoadMore}
              disabled={isLoadingMore}
              className={`rounded-lg border px-6 py-2.5 text-sm font-medium shadow-sm transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
                loadMoreError
                  ? "border-red-300 bg-red-50 text-red-700 hover:bg-red-100 dark:border-red-600 dark:bg-red-900/30 dark:text-red-300 dark:hover:bg-red-900/50"
                  : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              {isLoadingMore ? "Loading..." : loadMoreError ? "Failed to load. Retry?" : "Load More"}
            </button>
            {loadMoreError && (
              <p className="text-xs text-red-600 dark:text-red-400">
                Something went wrong. Please try again.
              </p>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
