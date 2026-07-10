/**
 * TypeScript interfaces for Riot Games API data.
 */

// --- Region types ---

export type Region = "americas" | "europe" | "asia" | "sea";

export interface RegionOption {
  value: Region;
  label: string;
}

export const REGION_OPTIONS: RegionOption[] = [
  { value: "americas", label: "Americas" },
  { value: "europe", label: "Europe" },
  { value: "asia", label: "Asia" },
  { value: "sea", label: "South East Asia" },
];

export const REGION_BASE_URLS: Record<Region, string> = {
  americas: "https://americas.api.riotgames.com",
  europe: "https://europe.api.riotgames.com",
  asia: "https://asia.api.riotgames.com",
  sea: "https://sea.api.riotgames.com",
};

// --- Application-level types ---

export interface RiotAccount {
  puuid: string;
  gameName: string;
  tagLine: string;
}

export interface MatchSummary {
  matchId: string;
  champion: string;
  championIcon: string;
  kills: number;
  deaths: number;
  assists: number;
  kda: string;
  win: boolean;
  gameDuration: number;
  gameMode: string;
}

// --- Riot API response shapes ---

export interface RiotAccountResponse {
  puuid: string;
  gameName: string;
  tagLine: string;
}

export type RiotMatchIdsResponse = string[];

export interface RiotMatchParticipant {
  puuid: string;
  championName: string;
  kills: number;
  deaths: number;
  assists: number;
  win: boolean;
}

export interface RiotMatchInfo {
  gameDuration: number;
  gameMode: string;
  participants: RiotMatchParticipant[];
}

export interface RiotMatchMetadata {
  matchId: string;
  participants: string[];
}

export interface RiotMatchResponse {
  metadata: RiotMatchMetadata;
  info: RiotMatchInfo;
}

// --- API error response ---

export interface ApiErrorResponse {
  error: string;
  status: number;
}

export interface ApiSuccessResponse {
  matches: MatchSummary[];
  account: RiotAccount;
  warning?: string;
}
