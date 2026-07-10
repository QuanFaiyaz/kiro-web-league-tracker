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

    const [gameName, tagLine] = trimmed.split("#");

    if (!gameName || !tagLine) {
      setValidationError("Both the game name and tag are required (e.g., Player#NA1).");
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
          className="flex-1 rounded-lg border border-gray-600 bg-gray-800 px-4 py-3 text-sm text-gray-100 placeholder-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="rounded-lg bg-indigo-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Searching..." : "Search"}
        </button>
      </div>
      {validationError && (
        <p className="mt-2 text-sm text-red-400" role="alert">
          {validationError}
        </p>
      )}
    </form>
  );
}
