import type {
  RiotAccountResponse,
  RiotMatchResponse,
  RiotSummonerResponse,
  RankedEntry,
  Region,
  PlatformId,
} from "@/lib/types";
import { REGION_BASE_URLS, REGION_TO_PLATFORM } from "@/lib/types";

// The account v1 endpoint uses americas as the global routing value.
const ACCOUNT_API_BASE = "https://americas.api.riotgames.com";

/**
 * Returns the Riot API base URL for a given region.
 */
export function getRegionBaseUrl(region: Region): string {
  return REGION_BASE_URLS[region];
}
const DDRAGON_VERSIONS_URL = "https://ddragon.leagueoflegends.com/api/versions.json";

/** Fallback Data Dragon version if the versions API is unreachable. */
const DDRAGON_FALLBACK_VERSION = "15.1.1";

/** Cache duration for the Data Dragon version (1 hour). */
const DDRAGON_CACHE_TTL_MS = 60 * 60 * 1000;

let cachedDdragonVersion: string | null = null;
let cacheTimestamp = 0;

/**
 * Fetches the latest Data Dragon version from Riot's CDN.
 * Caches the result for 1 hour to avoid repeated lookups.
 * Falls back to a hardcoded version if the fetch fails.
 */
export async function getLatestDdragonVersion(): Promise<string> {
  const now = Date.now();

  if (cachedDdragonVersion && now - cacheTimestamp < DDRAGON_CACHE_TTL_MS) {
    return cachedDdragonVersion;
  }

  try {
    const response = await fetch(DDRAGON_VERSIONS_URL, {
      signal: AbortSignal.timeout(5000),
    });

    if (response.ok) {
      const versions: string[] = await response.json();
      if (versions.length > 0) {
        cachedDdragonVersion = versions[0];
        cacheTimestamp = now;
        return cachedDdragonVersion;
      }
    }
  } catch {
    // Fall through to fallback
  }

  return cachedDdragonVersion ?? DDRAGON_FALLBACK_VERSION;
}

/**
 * Error message used when RIOT_API_KEY is missing from the environment.
 * Shared between the throw site and the catch site to prevent silent breakage
 * if the message text is changed at one location but not the other.
 */
export const MISSING_API_KEY_MESSAGE = "RIOT_API_KEY is not configured";

/**
 * Custom error class for Riot API errors with HTTP status codes.
 */
export class RiotApiError extends Error {
  status: number;
  retryAfter?: string;

  constructor(message: string, status: number, retryAfter?: string) {
    super(message);
    this.name = "RiotApiError";
    this.status = status;
    this.retryAfter = retryAfter;
  }
}

/** Default timeout for Riot API requests (10 seconds). */
const REQUEST_TIMEOUT_MS = 10_000;

/**
 * Makes an authenticated request to the Riot Games API.
 * Includes an AbortSignal timeout to prevent indefinitely hanging requests.
 */
async function riotFetch(url: string): Promise<Response> {
  const apiKey = process.env.RIOT_API_KEY;

  if (!apiKey) {
    throw new RiotApiError(MISSING_API_KEY_MESSAGE, 500);
  }

  const response = await fetch(url, {
    headers: {
      "X-Riot-Token": apiKey,
    },
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });

  if (!response.ok) {
    const retryAfter = response.headers.get("Retry-After") ?? undefined;

    switch (response.status) {
      case 404:
        throw new RiotApiError("Resource not found", 404);
      case 429:
        throw new RiotApiError("Rate limit exceeded", 429, retryAfter);
      case 403:
        throw new RiotApiError("API key is invalid or expired", 403);
      default:
        throw new RiotApiError(
          `Riot API error: ${response.status} ${response.statusText}`,
          response.status
        );
    }
  }

  return response;
}

/**
 * Looks up a Riot account by gameName and tagLine.
 * Returns the account PUUID and identity information.
 * Uses the global americas endpoint since account lookups are not region-specific.
 */
export async function getAccountByRiotId(
  gameName: string,
  tagLine: string
): Promise<RiotAccountResponse> {
  const url = `${ACCOUNT_API_BASE}/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(gameName)}/${encodeURIComponent(tagLine)}`;
  const response = await riotFetch(url);
  return response.json() as Promise<RiotAccountResponse>;
}

/**
 * Retrieves a list of match IDs for a given PUUID.
 * Defaults to the 10 most recent matches.
 * Uses the specified region for routing.
 * Supports offset-based pagination via the start parameter.
 */
export async function getMatchIdsByPuuid(
  puuid: string,
  count: number = 10,
  region: Region = "americas",
  start: number = 0
): Promise<string[]> {
  const baseUrl = getRegionBaseUrl(region);
  const url = `${baseUrl}/lol/match/v5/matches/by-puuid/${encodeURIComponent(puuid)}/ids?start=${start}&count=${count}`;
  const response = await riotFetch(url);
  return response.json() as Promise<string[]>;
}

/**
 * Retrieves the full details of a specific match by match ID.
 * Uses the specified region for routing.
 */
export async function getMatchDetails(
  matchId: string,
  region: Region = "americas"
): Promise<RiotMatchResponse> {
  const baseUrl = getRegionBaseUrl(region);
  const url = `${baseUrl}/lol/match/v5/matches/${encodeURIComponent(matchId)}`;
  const response = await riotFetch(url);
  return response.json() as Promise<RiotMatchResponse>;
}

/**
 * Returns the platform ID for a given region.
 */
export function getPlatformId(region: Region): PlatformId {
  return REGION_TO_PLATFORM[region];
}

/**
 * Looks up a summoner by PUUID using the platform-specific endpoint.
 * Required for obtaining the summonerId needed for ranked lookups.
 */
export async function getSummonerByPuuid(
  puuid: string,
  platformId: PlatformId
): Promise<RiotSummonerResponse> {
  const url = `https://${platformId}.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${encodeURIComponent(puuid)}`;
  const response = await riotFetch(url);
  return response.json() as Promise<RiotSummonerResponse>;
}

/**
 * Retrieves ranked entries for a summoner.
 * Returns an array of queue entries (Solo/Duo, Flex, etc.).
 */
export async function getRankedEntries(
  summonerId: string,
  platformId: PlatformId
): Promise<RankedEntry[]> {
  const url = `https://${platformId}.api.riotgames.com/lol/league/v4/entries/by-summoner/${encodeURIComponent(summonerId)}`;
  const response = await riotFetch(url);
  return response.json() as Promise<RankedEntry[]>;
}
