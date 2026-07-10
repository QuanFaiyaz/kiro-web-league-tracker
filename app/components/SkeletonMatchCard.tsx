"use client";

export default function SkeletonMatchCard() {
  return (
    <article
      aria-hidden="true"
      className="border-l-4 border-l-gray-300 rounded-lg bg-gray-50 p-4 dark:border-l-gray-600 dark:bg-gray-900"
    >
      <div className="flex items-center gap-4">
        {/* Champion icon placeholder */}
        <div className="h-12 w-12 shrink-0 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700" />

        <div className="flex flex-1 flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          {/* Name + result + time */}
          <div className="flex flex-col gap-1.5">
            <div className="h-4 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
            <div className="h-3 w-14 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
            <div className="h-3 w-16 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
          </div>

          {/* Stats placeholders */}
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-center gap-1">
              <div className="h-4 w-16 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
              <div className="h-3 w-12 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="h-3 w-14 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
              <div className="h-3 w-14 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="h-3 w-12 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
              <div className="h-3 w-16 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
            </div>
          </div>
        </div>
      </div>

      {/* Item slot placeholders */}
      <div className="mt-3 flex items-center gap-1.5">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-7 w-7 animate-pulse rounded border border-gray-200 bg-gray-200 dark:border-gray-700 dark:bg-gray-700"
          />
        ))}
      </div>
    </article>
  );
}
