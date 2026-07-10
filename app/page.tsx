import Dashboard from "./components/Dashboard";
import ThemeToggle from "./components/ThemeToggle";

export default function Home() {
  return (
    <div className="flex min-h-full flex-col bg-white font-sans dark:bg-gray-950">
      <header className="border-b border-gray-200 bg-gradient-to-b from-gray-50 to-white px-4 py-8 text-center dark:border-gray-800 dark:from-gray-900 dark:to-gray-950">
        <div className="mx-auto flex items-center justify-center gap-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-indigo-500 dark:text-indigo-400"
            aria-hidden="true"
          >
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">
            LoL Match History Tracker
          </h1>
          <ThemeToggle />
        </div>
        <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
          Look up any summoner&apos;s recent match performance
        </p>
      </header>

      <Dashboard />

      <footer className="border-t border-gray-200 px-4 py-4 text-center dark:border-gray-800">
        <p className="text-xs text-gray-400 dark:text-gray-500">
          Powered by the Riot Games API. Not endorsed by Riot Games.
        </p>
      </footer>
    </div>
  );
}
