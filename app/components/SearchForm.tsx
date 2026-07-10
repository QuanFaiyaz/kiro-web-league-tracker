"use client";

import { useState, FormEvent } from "react";

interface SearchFormProps {
  onSearch: (gameName: string, tagLine: string) => void;
  isLoading: boolean;
}

export default function SearchForm({ onSearch, isLoading }: SearchFormProps) {
  const [riotId, setRiotId] = useState("");
  const [validationError, setValidationError] = useState("");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setValidationError("");

    const trimmed = riotId.trim();
    if (!trimmed.includes("#")) {
      setValidationError("Please enter a valid Riot ID in the format GameName#Tag.");
      return;
    }

    const hashIndex = trimmed.indexOf("#");
    const gameName = trimmed.slice(0, hashIndex);
    const tagLine = trimmed.slice(hashIndex + 1);

    if (!gameName || !tagLine) {
      setValidationError("Both the game name and tag are required (e.g., Player#NA1).");
      return;
    }

    if (tagLine.includes("#")) {
      setValidationError("Tag should not contain additional # characters.");
      return;
    }

    onSearch(gameName, tagLine);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto">
      <div className="flex flex-col gap-3 sm:flex-row">
        <label htmlFor="riot-id-input" className="sr-only">
          Riot ID
        </label>
        <input
          id="riot-id-input"
          type="text"
          value={riotId}
          onChange={(e) => setRiotId(e.target.value)}
          placeholder="GameName#Tag"
          disabled={isLoading}
          className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-400 shadow-sm transition-all duration-200 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500 dark:focus:shadow-indigo-500/10"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="rounded-lg bg-indigo-600 px-6 py-3 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:bg-indigo-500 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-white disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] dark:focus:ring-offset-gray-900"
        >
          {isLoading ? "Searching..." : "Search"}
        </button>
      </div>
      {validationError && (
        <p className="mt-2 text-sm text-red-500 dark:text-red-400" role="alert">
          {validationError}
        </p>
      )}
    </form>
  );
}
