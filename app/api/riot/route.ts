import type { NextRequest } from "next/server";
import {
  getAccountByRiotId,
  getMatchIdsByPuuid,
  getMatchDetails,
  getLatestDdragonVersion,
  RiotApiError,
} from "@/lib/riot-api";
import type { MatchSummary, ApiSuccessResponse, ApiErrorResponse } from "@/lib/types";

export const dynamic = "force-dynamic";

/**
 * GET /api/riot?gameName=...&tagLine=...
 *
 * Proxies Riot Games API calls for account lookup and match history retrieval.
 * Keeps the API key secure on the server side.
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const gameName = searchParams.get("gameName");
  const tagLine = searchParams.get("tagLine");

  // Validate required parameters
  if (!gameName || !tagLine) {
    return Response.json(
      { error: "Missing required parameters: gameName and tagLine", status: 400 } satisfies ApiErrorResponse,
      { status: 400 }
    );
  }

  // Validate gameName length (1-16 characters per Riot API docs)
  if (gameName.length < 1 || gameName.length > 16) {
    return Response.json(
      { error: "gameName must be between 1 and 16 characters", status: 400 } satisfies ApiErrorResponse,
      { status: 400 }
    );
  }

  // Validate tagLine length (1-5 characters per Riot API docs)
  if (tagLine.length < 1 || tagLine.length > 5) {
    return Response.json(
      { error: "tagLine must be between 1 and 5 characters", status: 400 } satisfies ApiErrorResponse,
      { status: 400 }
    );
  }

  try {
    // Step 1: Look up the account by Riot ID
    const account = await getAccountByRiotId(gameName, tagLine);

    // Step 2: Get recent match IDs
    const matchIds = await getMatchIdsByPuuid(account.puuid, 10);

    // Step 3: Fetch details for each match using Promise.allSettled for partial-failure resilience
    const matchResults = await Promise.allSettled(
      matchIds.map((matchId) => getMatchDetails(matchId))
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

    return Response.json(responseBody);
  } catch (error) {
    if (error instanceof RiotApiError) {
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
