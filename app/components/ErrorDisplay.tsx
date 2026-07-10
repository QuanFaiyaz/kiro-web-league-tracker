"use client";

interface ErrorDisplayProps {
  message: string;
  status?: number;
}

export default function ErrorDisplay({ message, status }: ErrorDisplayProps) {
  const getSuggestion = (): string => {
    if (status === 404) {
      return "Double-check the Riot ID format (GameName#Tag) and make sure the account exists.";
    }
    if (status === 429) {
      return "Too many requests. Please wait a moment and try again.";
    }
    if (status && status >= 500) {
      return "The server is experiencing issues. Please try again later.";
    }
    return "Please verify your input and try again.";
  };

  return (
    <section
      aria-label="Error message"
      className="mx-auto w-full max-w-md rounded-lg border border-red-300/50 bg-red-50/50 p-6 text-center dark:border-red-500/30 dark:bg-red-950/20"
    >
      <svg
        className="mx-auto mb-3 h-8 w-8 text-red-500 dark:text-red-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
        />
      </svg>
      <h3 className="mb-2 text-lg font-semibold text-red-700 dark:text-red-300">
        Something went wrong
      </h3>
      <p className="mb-3 text-sm text-red-600 dark:text-red-200">{message}</p>
      <p className="text-xs text-gray-500 dark:text-gray-400">{getSuggestion()}</p>
    </section>
  );
}
