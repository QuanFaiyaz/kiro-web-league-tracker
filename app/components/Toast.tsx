"use client";

import { useEffect, useRef } from "react";

export type ToastType = "success" | "error" | "info";

export interface ToastData {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastProps {
  toast: ToastData;
  onClose: (id: string) => void;
}

const typeStyles: Record<ToastType, string> = {
  success:
    "border-green-500 bg-green-50 text-green-800 dark:border-green-400 dark:bg-green-900/40 dark:text-green-200",
  error:
    "border-red-500 bg-red-50 text-red-800 dark:border-red-400 dark:bg-red-900/40 dark:text-red-200",
  info:
    "border-indigo-500 bg-indigo-50 text-indigo-800 dark:border-indigo-400 dark:bg-indigo-900/40 dark:text-indigo-200",
};

const iconMap: Record<ToastType, string> = {
  success: "\u2713",
  error: "\u2717",
  info: "\u2139",
};

export default function Toast({ toast, onClose }: ToastProps) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    timerRef.current = setTimeout(() => {
      onClose(toast.id);
    }, 4000);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [toast.id, onClose]);

  return (
    <div
      role="alert"
      aria-live="assertive"
      className={`flex items-center gap-3 rounded-lg border-l-4 px-4 py-3 shadow-lg animate-[slideInRight_0.3s_ease-out] ${typeStyles[toast.type]}`}
    >
      <span className="text-lg font-bold" aria-hidden="true">
        {iconMap[toast.type]}
      </span>
      <p className="flex-1 text-sm font-medium">{toast.message}</p>
      <button
        type="button"
        onClick={() => onClose(toast.id)}
        className="ml-2 shrink-0 rounded p-1 opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-current"
        aria-label="Close notification"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </div>
  );
}
