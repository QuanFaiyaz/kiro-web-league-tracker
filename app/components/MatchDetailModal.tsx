"use client";

import { useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { MatchSummary } from "@/lib/types";
import { formatDuration } from "@/lib/format-duration";
import { formatTimeAgo } from "@/lib/time-ago";

interface MatchDetailModalProps {
  match: MatchSummary;
  onClose: () => void;
}

/**
 * Parses a KDA string to a numeric value.
 * Handles "Perfect" (zero deaths) by returning Infinity.
 */
function parseKdaValue(kda: string): number {
  if (kda === "Perfect") return Infinity;
  return parseFloat(kda);
}

function getKdaRating(kda: number): { label: string; color: string } {
  if (kda >= 4) return { label: "Excellent", color: "text-green-400" };
  if (kda >= 2) return { label: "Good", color: "text-blue-400" };
  if (kda >= 1) return { label: "Average", color: "text-yellow-400" };
  return { label: "Needs Improvement", color: "text-red-400" };
}

function generatePerformanceFeedback(match: MatchSummary): string[] {
  const feedback: string[] = [];
  const kdaValue = parseKdaValue(match.kda);
  const kdaRating = getKdaRating(kdaValue);

  // KDA analysis
  feedback.push(
    `Your KDA of ${match.kda} (${match.kills}/${match.deaths}/${match.assists}) is rated as ${kdaRating.label.toLowerCase()}. ${
      kdaValue >= 4
        ? "You had outstanding impact this game with minimal deaths."
        : kdaValue >= 2
          ? "Solid performance with a positive contribution to your team."
          : kdaValue >= 1
            ? "You traded evenly but there is room to reduce deaths."
            : "Focus on reducing deaths and finding safer positioning in fights."
    }`
  );

  // Deaths analysis
  if (match.deaths <= 2) {
    feedback.push(
      "Very low death count indicates excellent positioning and map awareness. Keep playing safe and punishing enemy mistakes."
    );
  } else if (match.deaths <= 5) {
    feedback.push(
      "Your deaths were within a reasonable range. Review if any deaths were avoidable through better vision or positioning."
    );
  } else if (match.deaths <= 8) {
    feedback.push(
      "Higher death count suggests some overextension or getting caught. Try to track enemy cooldowns and maintain better vision control."
    );
  } else {
    feedback.push(
      "High deaths impacted your team significantly. Consider playing more conservatively and grouping with teammates rather than solo plays."
    );
  }

  // Game duration analysis
  const minutes = match.gameDuration / 60;
  if (minutes < 20) {
    feedback.push(
      match.win
        ? "A quick victory under 20 minutes. Your team dominated the early game and snowballed the lead effectively."
        : "The game ended before 20 minutes, suggesting the enemy team built an insurmountable early lead. Focus on early game fundamentals and avoiding risky plays when behind."
    );
  } else if (minutes <= 35) {
    feedback.push(
      match.win
        ? "A standard length game where your team closed out with good mid-game execution."
        : "The game lasted a normal duration. Look for mid-game decisions that could have swung momentum in your favor."
    );
  } else {
    feedback.push(
      match.win
        ? "A long game that you managed to win. Late game patience and teamfight execution paid off."
        : "The game went late, which may indicate missed opportunities to close out or difficulty scaling. Focus on objective control after winning fights."
    );
  }

  return feedback;
}

function generateMentalTips(match: MatchSummary): string[] {
  const tips: string[] = [];
  const kdaValue = parseKdaValue(match.kda);

  if (match.win) {
    tips.push(
      "Great job on the win! Take a moment to reflect on what went right so you can replicate it in future games."
    );
    if (kdaValue >= 4) {
      tips.push(
        "You carried this game. Keep this momentum going but stay humble - even the best players have losing streaks."
      );
    } else if (match.deaths > 5) {
      tips.push(
        "You won despite high deaths. Next game, try to maintain this aggression while being slightly more selective about your engagements."
      );
    }
  } else {
    tips.push(
      "Losses are learning opportunities. Every pro player has lost thousands of games on their way to improvement."
    );
    if (kdaValue < 1) {
      tips.push(
        "Tough game. Consider taking a short break before your next match to reset your mental state. Focus on one improvement at a time."
      );
    } else {
      tips.push(
        "You played decently despite the loss. Sometimes team outcomes are outside your control - focus on your own gameplay."
      );
    }
  }

  tips.push(
    match.deaths > 6
      ? "Before your next game, remind yourself: 'Staying alive is more valuable than chasing kills.' Deaths give the enemy gold and map pressure."
      : "Your death count was reasonable. Keep maintaining this discipline and look for safe opportunities to extend your advantages."
  );

  return tips;
}

export default function MatchDetailModal({
  match,
  onClose,
}: MatchDetailModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    // Lock body scroll when modal is open
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    modalRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [handleKeyDown]);

  const handleBackdropClick = (
    event: React.MouseEvent<HTMLDivElement>
  ) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  const borderColor = match.win
    ? "border-green-500/40"
    : "border-red-500/40";
  const resultText = match.win ? "text-green-400" : "text-red-400";
  const resultLabel = match.win ? "Victory" : "Defeat";
  const kdaValue = parseKdaValue(match.kda);
  const kdaRating = getKdaRating(kdaValue);
  const performanceFeedback = generatePerformanceFeedback(match);
  const mentalTips = generateMentalTips(match);

  // Build item slots array: always show 7 slots (6 items + trinket/item6)
  const TOTAL_SLOTS = 7;
  const itemSlots = Array.from({ length: TOTAL_SLOTS }, (_, index) => {
    return match.items[index] || null;
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onClick={handleBackdropClick}
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        tabIndex={-1}
        className={`relative mx-4 w-full max-w-lg overflow-y-auto rounded-xl border ${borderColor} bg-gray-900 shadow-2xl outline-none max-h-[90vh]`}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-3 top-3 rounded-md p-1 text-gray-400 transition-colors hover:bg-gray-800 hover:text-gray-200"
          aria-label="Close modal"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Header Section */}
        <header className="flex items-center gap-4 border-b border-gray-700/50 p-5">
          <div className="shrink-0">
            <Image
              src={match.championIcon}
              alt={`${match.champion} icon`}
              width={64}
              height={64}
              className="rounded-full"
            />
          </div>
          <div className="flex flex-col gap-1">
            <h2
              id="modal-title"
              className="text-lg font-bold text-gray-100"
            >
              {match.champion}
            </h2>
            <div className="flex flex-wrap items-center gap-2">
              <span className={`text-sm font-semibold ${resultText}`}>
                {resultLabel}
              </span>
              <span className="text-xs text-gray-400">
                {match.queueType}
              </span>
              <span className="text-xs text-gray-500">
                {formatDuration(match.gameDuration)}
              </span>
              <span className="text-xs text-gray-500">
                &middot; {formatTimeAgo(match.gameStartTimestamp)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-100">
                {match.kills}/{match.deaths}/{match.assists}
              </span>
              <span className={`text-xs font-medium ${kdaRating.color}`}>
                {match.kda} KDA - {kdaRating.label}
              </span>
            </div>
          </div>
        </header>

        {/* Item Build Section */}
        <section className="border-b border-gray-700/50 p-5" aria-label="Item build">
          <h3 className="mb-3 text-sm font-semibold text-gray-300 uppercase tracking-wide">
            Item Build
          </h3>
          <div className="grid grid-cols-7 gap-2">
            {itemSlots.map((item, index) => (
              <div
                key={index}
                className="relative aspect-square w-full overflow-hidden rounded-md border border-gray-700 bg-gray-800"
              >
                {item ? (
                  <Image
                    src={item.iconUrl}
                    alt={`Item ${item.id}`}
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <div className="h-3 w-3 rounded-sm bg-gray-700" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* AI Performance Feedback Section */}
        <section className="border-b border-gray-700/50 p-5" aria-label="AI performance feedback">
          <h3 className="mb-3 text-sm font-semibold text-indigo-400 uppercase tracking-wide">
            AI Performance Feedback
          </h3>
          <ul className="flex flex-col gap-3">
            {performanceFeedback.map((feedback, index) => (
              <li
                key={index}
                className="text-sm leading-relaxed text-gray-300"
              >
                <span className="mr-2 inline-block text-indigo-400">&#9679;</span>
                {feedback}
              </li>
            ))}
          </ul>
        </section>

        {/* Mental & Improvement Tips Section */}
        <section className="p-5" aria-label="Mental and improvement tips">
          <h3 className="mb-3 text-sm font-semibold text-purple-400 uppercase tracking-wide">
            Mental &amp; Improvement Tips
          </h3>
          <ul className="flex flex-col gap-3">
            {mentalTips.map((tip, index) => (
              <li
                key={index}
                className="text-sm leading-relaxed text-gray-300"
              >
                <span className="mr-2 inline-block text-purple-400">&#9679;</span>
                {tip}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
