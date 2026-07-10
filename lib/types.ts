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

export interface MatchItem {
  id: number;
  iconUrl: string;
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
  queueId: number;
  queueType: string;
  items: MatchItem[];
  gameStartTimestamp: number;
  totalMinionsKilled: number;
  neutralMinionsKilled: number;
  visionScore: number;
  csPerMinute: number;
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
  item0: number;
  item1: number;
  item2: number;
  item3: number;
  item4: number;
  item5: number;
  item6: number;
  totalMinionsKilled: number;
  neutralMinionsKilled: number;
  visionScore: number;
}

export interface RiotMatchInfo {
  gameDuration: number;
  gameMode: string;
  queueId: number;
  gameStartTimestamp: number;
  gameCreation: number;
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

// --- Ranked types ---

export type PlatformId = "na1" | "euw1" | "eun1" | "kr" | "jp1" | "oc1" | "br1" | "la1" | "la2" | "tr1" | "ru" | "ph2" | "sg2" | "th2" | "tw2" | "vn2";

export const REGION_TO_PLATFORM: Record<Region, PlatformId> = {
  americas: "na1",
  europe: "euw1",
  asia: "kr",
  sea: "oc1",
};

export interface RankedEntry {
  queueType: string;
  tier: string;
  rank: string;
  leaguePoints: number;
  wins: number;
  losses: number;
  summonerId: string;
}

export interface RiotSummonerResponse {
  id: string;
  accountId: string;
  puuid: string;
  profileIconId: number;
  revisionDate: number;
  summonerLevel: number;
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
  rankedData?: RankedEntry[];
}
