import type {
  RiotAccountResponse,
  RiotMatchResponse,
} from "@/lib/types";

const RIOT_API_BASE = "https://americas.api.riotgames.com";
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
    throw new RiotApiError("RIOT_API_KEY is not configured", 500);
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
 */
export async function getAccountByRiotId(
  gameName: string,
  tagLine: string
): Promise<RiotAccountResponse> {
  const url = `${RIOT_API_BASE}/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(gameName)}/${encodeURIComponent(tagLine)}`;
  const response = await riotFetch(url);
  return response.json() as Promise<RiotAccountResponse>;
}

/**
 * Retrieves a list of match IDs for a given PUUID.
 * Defaults to the 10 most recent matches.
 */
export async function getMatchIdsByPuuid(
  puuid: string,
  count: number = 10
): Promise<string[]> {
  const url = `${RIOT_API_BASE}/lol/match/v5/matches/by-puuid/${encodeURIComponent(puuid)}/ids?count=${count}`;
  const response = await riotFetch(url);
  return response.json() as Promise<string[]>;
}

/**
 * Retrieves the full details of a specific match by match ID.
 */
export async function getMatchDetails(
  matchId: string
): Promise<RiotMatchResponse> {
  const url = `${RIOT_API_BASE}/lol/match/v5/matches/${encodeURIComponent(matchId)}`;
  const response = await riotFetch(url);
  return response.json() as Promise<RiotMatchResponse>;
}
