"use client";

export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-12" role="status">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-600 border-t-indigo-400"></div>
      <span className="sr-only">Loading...</span>
    </div>
  );
}
