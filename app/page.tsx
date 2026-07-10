"use client";

import { useState } from "react";
import SearchForm from "./components/SearchForm";
import MatchHistory from "./components/MatchHistory";
import ErrorDisplay from "./components/ErrorDisplay";
import LoadingSpinner from "./components/LoadingSpinner";
import { MatchSummary, RiotAccount, ApiSuccessResponse, ApiErrorResponse } from "@/lib/types";

export default function Home() {
  const [matches, setMatches] = useState<MatchSummary[]>([]);
  const [account, setAccount] = useState<RiotAccount | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<{ message: string; status?: number } | null>(null);

  const handleSearch = async (gameName: string, tagLine: string) => {
    setIsLoading(true);
    setError(null);
    setMatches([]);
    setAccount(null);

    try {
      const params = new URLSearchParams({ gameName, tagLine });
      const response = await fetch(`/api/riot?${params.toString()}`);

      if (!response.ok) {
        const errorData: ApiErrorResponse = await response.json();
        setError({ message: errorData.error, status: errorData.status });
        return;
      }

      const data: ApiSuccessResponse = await response.json();
      setMatches(data.matches);
      setAccount(data.account);
    } catch {
      setError({ message: "Failed to connect to the server. Please check your connection and try again." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-full flex-col bg-gray-950 font-sans">
      <header className="border-b border-gray-800 px-4 py-6 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-gray-100 sm:text-3xl">
          LoL Match History Tracker
        </h1>
        <p className="mt-2 text-sm text-gray-400">
          Look up any summoner&apos;s recent match performance
        </p>
      </header>

      <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-8 px-4 py-8">
        <section aria-label="Summoner search">
          <SearchForm onSearch={handleSearch} isLoading={isLoading} />
        </section>

        {isLoading && <LoadingSpinner />}

        {error && <ErrorDisplay message={error.message} status={error.status} />}

        {account && !isLoading && !error && (
          <section aria-label="Summoner info" className="text-center">
            <p className="text-lg font-medium text-gray-200">
              {account.gameName}
              <span className="text-gray-500">#{account.tagLine}</span>
            </p>
          </section>
        )}

        {matches.length > 0 && !isLoading && !error && (
          <MatchHistory matches={matches} />
        )}
      </main>

      <footer className="border-t border-gray-800 px-4 py-4 text-center">
        <p className="text-xs text-gray-500">
          Powered by the Riot Games API. Not endorsed by Riot Games.
        </p>
      </footer>
    </div>
  );
}
