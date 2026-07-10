import Dashboard from "./components/Dashboard";

export default function Home() {
  return (
    <div className="flex min-h-full flex-col bg-gray-950 font-sans">
      <header className="border-b border-gray-800 px-4 py-6 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-gray-100 sm:text-3xl">
          LoL Match History Tracker
        </h1>
        <p className="mt-2 text-sm text-gray-400">
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
