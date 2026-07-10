"use client";

import SkeletonMatchCard from "./SkeletonMatchCard";

export default function SkeletonLoader() {
  return (
    <div className="flex flex-col gap-6" role="status" aria-label="Loading match history">
      {/* Summoner info skeleton */}
      <div className="flex flex-col items-center gap-2">
        <div className="h-5 w-40 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
        <div className="flex gap-2">
          <div className="h-7 w-28 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700" />
          <div className="h-7 w-28 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700" />
        </div>
      </div>

      {/* Match cards skeleton */}
      <div className="flex flex-col gap-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <SkeletonMatchCard key={i} />
        ))}
      </div>

      <span className="sr-only">Loading...</span>
    </div>
  );
}
