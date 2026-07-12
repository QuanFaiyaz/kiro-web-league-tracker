import type { NextRequest } from "next/server";
import {
  getAccountByRiotId,
  getMatchIdsByPuuid,
  getMatchDetails,
  getLatestDdragonVersion,
  getSummonerByPuuid,
  getRankedEntries,
  getPlatformId,
  RiotApiError,
} from "@/lib/riot-api";
import { getQueueTypeLabel } from "@/lib/queue-labels";
import type { MatchSummary, MatchItem, ApiSuccessResponse, ApiErrorResponse, Region, RankedEntry } from "@/lib/types";
import { REGION_BASE_URLS } from "@/lib/types";

export const dynamic = "force-dynamic";

const VALID_REGIONS = Object.keys(REGION_BASE_URLS) as Region[];

/**
 * GET /api/riot?gameName=...&tagLine=...&region=...
 *
 * Proxies Riot Games API calls for account lookup and match history retrieval.
 * Keeps the API key secure on the server side.
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const gameName = searchParams.get("gameName");
  const tagLine = searchParams.get("tagLine");
  const regionParam = searchParams.get("region");
  const startParam = searchParams.get("start");
  const start = startParam ? Math.max(0, parseInt(startParam, 10) || 0) : 0;

  // Validate and default the region parameter
  const region: Region = VALID_REGIONS.includes(regionParam as Region)
    ? (regionParam as Region)
    : "americas";

  // Validate required parameters
  if (!gameName || !tagLine) {
    return Response.json(
      { error: "Missing required parameters: gameName and tagLine", status: 400 } satisfies ApiErrorResponse,
      { status: 400 }
    );
  }

  // Validate gameName length (max 16 characters per Riot API docs)
  // Note: lower bound (empty string) is already handled by the !gameName guard above
  if (gameName.length > 16) {
    return Response.json(
      { error: "gameName must be between 1 and 16 characters", status: 400 } satisfies ApiErrorResponse,
      { status: 400 }
    );
  }

  // Validate tagLine length (max 5 characters per Riot API docs)
  // Note: lower bound (empty string) is already handled by the !tagLine guard above
  if (tagLine.length > 5) {
    return Response.json(
      { error: "tagLine must be between 1 and 5 characters", status: 400 } satisfies ApiErrorResponse,
      { status: 400 }
    );
  }

  try {
    // Step 1: Look up the account by Riot ID
    const account = await getAccountByRiotId(gameName, tagLine);

    // Step 2: Get recent match IDs using the selected region
    const matchIds = await getMatchIdsByPuuid(account.puuid, 10, region, start);

    // Step 3: Fetch details for each match using Promise.allSettled for partial-failure resilience
    const matchResults = await Promise.allSettled(
      matchIds.map((matchId) => getMatchDetails(matchId, region))
    );

    // Step 4: Get latest Data Dragon version for champion icon URLs
    const ddragonVersion = await getLatestDdragonVersion();

    // Step 5: Parse match data into MatchSummary format (only include successful fetches)
    const fulfilledResults = matchResults.filter(
      (result): result is PromiseFulfilledResult<Awaited<ReturnType<typeof getMatchDetails>>> =>
        result.status === "fulfilled"
    );

    // If match IDs were returned but all detail fetches failed, report an error
    // rather than silently returning an empty matches array
    if (matchIds.length > 0 && fulfilledResults.length === 0) {
      return Response.json(
        {
          error: "Match history was found but match details could not be retrieved. This may be due to rate limiting or a temporary issue. Please try again later.",
          status: 502,
        } satisfies ApiErrorResponse,
        { status: 502 }
      );
    }

    const matches: MatchSummary[] = fulfilledResults
      .map((result) => {
        const match = result.value;
        const participant = match.info.participants.find(
          (p) => p.puuid === account.puuid
        );

        const kills = participant?.kills ?? 0;
        const deaths = participant?.deaths ?? 0;
        const assists = participant?.assists ?? 0;
        const kda = deaths === 0 ? "Perfect" : ((kills + assists) / deaths).toFixed(2);
        const championName = participant?.championName ?? "Unknown";

        // Build items array, filtering out empty slots (id === 0)
        const itemIds = [
          participant?.item0 ?? 0,
          participant?.item1 ?? 0,
          participant?.item2 ?? 0,
          participant?.item3 ?? 0,
          participant?.item4 ?? 0,
          participant?.item5 ?? 0,
          participant?.item6 ?? 0,
        ];

        const items: MatchItem[] = itemIds
          .filter((id) => id !== 0)
          .map((id) => ({
            id,
            iconUrl: `https://ddragon.leagueoflegends.com/cdn/${ddragonVersion}/img/item/${id}.png`,
          }));

        const queueId = match.info.queueId ?? 0;
        const queueType = getQueueTypeLabel(queueId, match.info.gameMode);

        const totalMinionsKilled = participant?.totalMinionsKilled ?? 0;
        const neutralMinionsKilled = participant?.neutralMinionsKilled ?? 0;
        const visionScore = participant?.visionScore ?? 0;
        const gameDurationMinutes = match.info.gameDuration / 60;
        const csPerMinute = gameDurationMinutes > 0
          ? parseFloat(((totalMinionsKilled + neutralMinionsKilled) / gameDurationMinutes).toFixed(1))
          : 0;

        return {
          matchId: match.metadata.matchId,
          champion: championName,
          championIcon: `https://ddragon.leagueoflegends.com/cdn/${ddragonVersion}/img/champion/${championName}.png`,
          kills,
          deaths,
          assists,
          kda,
          win: participant?.win ?? false,
          gameDuration: match.info.gameDuration,
          gameMode: match.info.gameMode,
          queueId,
          queueType,
          items,
          gameStartTimestamp: match.info.gameStartTimestamp || match.info.gameCreation || Date.now(),
          totalMinionsKilled,
          neutralMinionsKilled,
          visionScore,
          csPerMinute,
        };
      });

    const responseBody: ApiSuccessResponse = {
      matches,
      account: {
        puuid: account.puuid,
        gameName: account.gameName,
        tagLine: account.tagLine,
      },
    };

    // Fetch ranked data only on initial load (start === 0)
    if (start === 0) {
      try {
        const platformId = getPlatformId(region);
        const summoner = await getSummonerByPuuid(account.puuid, platformId);
        const rankedEntries: RankedEntry[] = await getRankedEntries(summoner.id, platformId);
        if (rankedEntries.length > 0) {
          responseBody.rankedData = rankedEntries;
        }
      } catch (rankedErr) {
        // Ranked lookup failure is non-fatal - surface it so the UI can inform the user
        const detail =
          rankedErr instanceof RiotApiError
            ? `Ranked data unavailable (${rankedErr.status})`
            : "Ranked data unavailable";
        responseBody.rankedError = detail;
      }
    }

    // If account was found but no match IDs were returned, inform the user.
    if (matchIds.length === 0) {
      responseBody.warning =
        "No match history found for this player in the selected region. Try selecting a different region.";
    }

    return Response.json(responseBody);
  } catch (error) {
    if (error instanceof RiotApiError) {
      // When the API key is expired or invalid, return a user-friendly message
      // instead of exposing the internal error details
      if (error.status === 401 || error.status === 403 || error.message.includes('RIOT_API_KEY')) {
        return Response.json(
          { error: "Service temporarily unavailable, please try again later", status: 503 } satisfies ApiErrorResponse,
          { status: 503 }
        );
      }

      const headers: HeadersInit = {};

      if (error.status === 429 && error.retryAfter) {
        headers["Retry-After"] = error.retryAfter;
      }

      return Response.json(
        { error: error.message, status: error.status } satisfies ApiErrorResponse,
        { status: error.status, headers }
      );
    }

    // Unexpected error - don't leak details
    console.error("Unexpected error in /api/riot:", error);
    return Response.json(
      { error: "An unexpected error occurred", status: 500 } satisfies ApiErrorResponse,
      { status: 500 }
    );
  }
}
