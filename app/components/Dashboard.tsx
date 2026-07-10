"use client";

import { useState } from "react";
import SearchForm from "./SearchForm";
import RegionSelector from "./RegionSelector";
import MatchHistory from "./MatchHistory";
import ErrorDisplay from "./ErrorDisplay";
import LoadingSpinner from "./LoadingSpinner";
import { MatchSummary, RiotAccount, ApiSuccessResponse, ApiErrorResponse, Region } from "@/lib/types";

export default function Dashboard() {
  const [matches, setMatches] = useState<MatchSummary[]>([]);
  const [account, setAccount] = useState<RiotAccount | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<{ message: string; status?: number } | null>(null);
  const [warning, setWarning] = useState<string | null>(null);
  const [region, setRegion] = useState<Region>("americas");

  const handleSearch = async (gameName: string, tagLine: string) => {
    setIsLoading(true);
    setError(null);
    setWarning(null);
    setMatches([]);
    setAccount(null);

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
      if (data.warning) {
        setWarning(data.warning);
      }
    } catch {
      setError({ message: "Failed to connect to the server. Please check your connection and try again." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-8 px-4 py-8">
      <section aria-label="Summoner search">
        <SearchForm onSearch={handleSearch} isLoading={isLoading} />
      </section>

      <section aria-label="Region selection">
        <RegionSelector selectedRegion={region} onChange={setRegion} disabled={isLoading} />
      </section>

      {isLoading && <LoadingSpinner />}

      {error && <ErrorDisplay message={error.message} status={error.status} />}

      {warning && !isLoading && !error && (
        <aside aria-label="Warning" className="rounded-lg border border-yellow-600/50 bg-yellow-900/20 px-4 py-3 text-sm text-yellow-300">
          {warning}
        </aside>
      )}

      {account && !isLoading && !error && (
        <section aria-label="Summoner info" className="text-center">
          <p className="text-lg font-medium text-gray-200">
            {account.gameName}
            <span className="text-gray-500">#{account.tagLine}</span>
          </p>
        </section>
      )}

      {account && !isLoading && !error && (
        <MatchHistory matches={matches} />
      )}
    </main>
  );
}
