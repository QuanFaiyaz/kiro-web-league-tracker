"use client";

import { Region, REGION_OPTIONS } from "@/lib/types";

interface RegionSelectorProps {
  selectedRegion: Region;
  onChange: (region: Region) => void;
  disabled: boolean;
}

export default function RegionSelector({ selectedRegion, onChange, disabled }: RegionSelectorProps) {
  return (
    <div className="flex flex-col items-center gap-2 sm:flex-row sm:justify-center">
      <label
        htmlFor="region-select"
        className="text-sm font-medium text-gray-300"
      >
        Region
      </label>
      <select
        id="region-select"
        value={selectedRegion}
        onChange={(e) => onChange(e.target.value as Region)}
        disabled={disabled}
        className="rounded-lg border border-gray-600 bg-gray-800 px-4 py-2 text-sm text-gray-100 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:opacity-50"
      >
        {REGION_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
