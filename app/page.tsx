import Dashboard from "./components/Dashboard";

export default function Home() {
  return (
    <div className="flex min-h-full flex-col bg-gray-950 font-sans">
      <header className="border-b border-gray-800 bg-gradient-to-b from-gray-900 to-gray-950 px-4 py-8 text-center">
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
            className="text-indigo-400"
            aria-hidden="true"
          >
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
          <h1 className="text-2xl font-bold tracking-tight text-gray-100 sm:text-3xl">
            LoL Match History Tracker
          </h1>
        </div>
        <p className="mt-3 text-sm text-gray-400">
          Look up any summoner&apos;s recent match performance
        </p>
      </header>

      <Dashboard />

      <footer className="border-t border-gray-800 px-4 py-4 text-center">
        <p className="text-xs text-gray-500">
          Powered by the Riot Games API. Not endorsed by Riot Games.
        </p>
      </footer>
    </div>
  );
}
