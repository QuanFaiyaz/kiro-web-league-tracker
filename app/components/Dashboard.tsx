"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import SearchForm from "./SearchForm";
import RegionSelector from "./RegionSelector";
import MatchHistory from "./MatchHistory";
import ErrorDisplay from "./ErrorDisplay";
import LoadingSpinner from "./LoadingSpinner";
import RankBadge from "./RankBadge";
import { MatchSummary, RiotAccount, ApiSuccessResponse, ApiErrorResponse, Region, RankedEntry } from "@/lib/types";

export default function Dashboard() {
  const [matches, setMatches] = useState<MatchSummary[]>([]);
  const [account, setAccount] = useState<RiotAccount | null>(null);
  const [rankedData, setRankedData] = useState<RankedEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<{ message: string; status?: number } | null>(null);
  const [warning, setWarning] = useState<string | null>(null);
  const [region, setRegion] = useState<Region>("americas");
  const [hasMore, setHasMore] = useState(true);
  const lastSearchRef = useRef<{ gameName: string; tagLine: string } | null>(null);

  const handleSearch = useCallback(async (gameName: string, tagLine: string) => {
    setIsLoading(true);
    setError(null);
    setWarning(null);
    setMatches([]);
    setAccount(null);
    setRankedData([]);
    setHasMore(true);
    lastSearchRef.current = { gameName, tagLine };

    try {
      const params = new URLSearchParams({ gameName, tagLine, region });
      const response = await fetch(`/api/riot?${params.toString()}`);

      if (!response.ok) {
        const errorData: ApiErrorResponse = await response.json();
        setError({ message: errorData.error, status: errorData.status });
        return;
      }

      const data: ApiSuccessResponse = await response.json();
      setMatches(data.matches);
      setAccount(data.account);
      if (data.rankedData) {
        setRankedData(data.rankedData);
      }
      if (data.warning) {
        setWarning(data.warning);
      }
      if (data.matches.length < 10) {
        setHasMore(false);
      }
    } catch {
      setError({ message: "Failed to connect to the server. Please check your connection and try again." });
    } finally {
      setIsLoading(false);
    }
  }, [region]);

  const handleLoadMore = useCallback(async () => {
    if (!lastSearchRef.current || isLoadingMore) return;

    setIsLoadingMore(true);

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
      // Silently fail - user can retry
    } finally {
      setIsLoadingMore(false);
    }
  }, [region, matches.length, isLoadingMore]);

  useEffect(() => {
    if (lastSearchRef.current) {
      handleSearch(lastSearchRef.current.gameName, lastSearchRef.current.tagLine);
    }
  }, [region, handleSearch]);

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-8 px-4 py-8">
      <div className="sticky top-0 z-10 -mx-4 flex flex-col gap-4 bg-white/80 px-4 py-4 backdrop-blur-md dark:bg-gray-950/80">
        <section aria-label="Summoner search">
          <SearchForm onSearch={handleSearch} isLoading={isLoading} />
        </section>

        <section aria-label="Region selection">
          <RegionSelector selectedRegion={region} onChange={setRegion} disabled={isLoading} />
        </section>
      </div>

      {isLoading && <LoadingSpinner />}

      {error && <ErrorDisplay message={error.message} status={error.status} />}

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
        </section>
      )}

      {account && !isLoading && !error && (
        <MatchHistory matches={matches} />
      )}

      {account && !isLoading && !error && matches.length > 0 && hasMore && (
        <div className="flex justify-center pb-8">
          <button
            type="button"
            onClick={handleLoadMore}
            disabled={isLoadingMore}
            className="rounded-lg border border-gray-300 bg-white px-6 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
          >
            {isLoadingMore ? "Loading..." : "Load More"}
          </button>
        </div>
      )}
    </main>
  );
}
