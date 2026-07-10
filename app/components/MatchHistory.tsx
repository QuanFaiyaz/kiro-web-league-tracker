"use client";

import { useState, useCallback } from "react";
import { MatchSummary } from "@/lib/types";
import MatchCard from "./MatchCard";
import MatchDetailModal from "./MatchDetailModal";

interface MatchHistoryProps {
  matches: MatchSummary[];
}

export default function MatchHistory({ matches }: MatchHistoryProps) {
  const [selectedMatch, setSelectedMatch] = useState<MatchSummary | null>(null);

  const handleMatchClick = useCallback((match: MatchSummary) => {
    setSelectedMatch(match);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedMatch(null);
  }, []);

  if (matches.length === 0) {
    return (
      <section aria-label="Match history" className="py-8 text-center">
        <p className="text-gray-500 dark:text-gray-400">No matches found for this summoner.</p>
      </section>
    );
  }

  return (
    <section aria-label="Match history">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          Recent Matches ({matches.length})
        </h2>
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Ordered from most recent to oldest
        </p>
      </div>
      <div className="flex flex-col gap-3">
        {matches.map((match, index) => (
          <MatchCard
            key={match.matchId}
            match={match}
            matchIndex={index}
            onClick={() => handleMatchClick(match)}
          />
        ))}
      </div>
      {selectedMatch && (
        <MatchDetailModal
          match={selectedMatch}
          onClose={handleCloseModal}
        />
      )}
    </section>
  );
}
