"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { MatchSummary } from "@/lib/types";
import MatchCard from "./MatchCard";
import MatchDetailModal from "./MatchDetailModal";
import WinLossStreak from "./WinLossStreak";
import WinRateBar from "./WinRateBar";

interface MatchHistoryProps {
  matches: MatchSummary[];
}

export default function MatchHistory({ matches }: MatchHistoryProps) {
  const [selectedMatch, setSelectedMatch] = useState<MatchSummary | null>(null);
  const [animateFromIndex, setAnimateFromIndex] = useState(0);
  const prevMatchCountRef = useRef(0);

  useEffect(() => {
    if (matches.length > prevMatchCountRef.current && prevMatchCountRef.current > 0) {
      // New matches were appended; only animate from the new batch start
      setAnimateFromIndex(prevMatchCountRef.current);
    } else if (matches.length < prevMatchCountRef.current || prevMatchCountRef.current === 0) {
      // Fresh load or reset; animate all cards
      setAnimateFromIndex(0);
    }
    prevMatchCountRef.current = matches.length;
  }, [matches.length]);

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

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <WinLossStreak matches={matches} />
        <div className="w-full sm:max-w-xs">
          <WinRateBar matches={matches} />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {matches.map((match, index) => {
          const shouldAnimate = index >= animateFromIndex;
          const delayIndex = index - animateFromIndex;
          return (
            <div
              key={match.matchId}
              className={shouldAnimate ? "animate-[fadeSlideUp_0.4s_ease-out_both]" : undefined}
              style={shouldAnimate ? { animationDelay: `${delayIndex * 75}ms` } : undefined}
            >
              <MatchCard
                match={match}
                matchIndex={index}
                onClick={() => handleMatchClick(match)}
              />
            </div>
          );
        })}
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
