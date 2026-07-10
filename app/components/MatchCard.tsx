import Image from "next/image";
import { MatchSummary } from "@/lib/types";

interface MatchCardProps {
  match: MatchSummary;
}

function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes}:${secs.toString().padStart(2, "0")}`;
}

export default function MatchCard({ match }: MatchCardProps) {
  const borderColor = match.win
    ? "border-green-500/40"
    : "border-red-500/40";
  const resultBg = match.win
    ? "bg-green-500/10"
    : "bg-red-500/10";
  const resultText = match.win
    ? "text-green-400"
    : "text-red-400";
  const resultLabel = match.win ? "Victory" : "Defeat";

  return (
    <article
      className={`flex items-center gap-4 rounded-lg border ${borderColor} ${resultBg} p-4 transition-colors hover:bg-gray-800/50`}
    >
      <div className="shrink-0">
        <Image
          src={match.championIcon}
          alt={`${match.champion} icon`}
          width={48}
          height={48}
          className="rounded-full"
        />
      </div>
      <div className="flex flex-1 flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-semibold text-gray-100">
            {match.champion}
          </span>
          <span className={`text-xs font-medium ${resultText}`}>
            {resultLabel}
          </span>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex flex-col items-center">
            <span className="text-gray-100 font-medium">
              {match.kills}/{match.deaths}/{match.assists}
            </span>
            <span className="text-xs text-gray-400">
              {match.kda} KDA
            </span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-gray-300 text-xs">
              {formatDuration(match.gameDuration)}
            </span>
            <span className="text-xs text-gray-500">{match.gameMode}</span>
          </div>
        </div>
      </div>
    </article>
  );
}
