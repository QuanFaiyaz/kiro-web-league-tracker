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
        <p className="text-gray-400">No matches found for this summoner.</p>
      </section>
    );
  }

  return (
    <section aria-label="Match history">
      <h2 className="mb-4 text-lg font-semibold text-gray-200">
        Recent Matches ({matches.length})
      </h2>
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        {matches.map((match) => (
          <MatchCard
            key={match.matchId}
            match={match}
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
