# Riot API Key Expired

The Riot API key is currently expired or invalid (HTTP 401 returned from the API).
The application is returning "Service temporarily unavailable, please try again later" to users.

## Action Required (Manual Steps)

1. Log in at https://developer.riotgames.com/ and regenerate your API key
2. Copy the new key and update .env.local: `RIOT_API_KEY=RGAPI-your-new-key`
3. Restart the dev server (`npm run dev`) or redeploy to production

**Note:** The app is currently showing "Service temporarily unavailable" to users until this is resolved.

## Technical Details

- The API route (`app/api/riot/route.ts`) already handles 401/403 responses gracefully
- It returns HTTP 503 with a user-friendly message instead of exposing internal errors
- No code changes are needed; only the API key needs to be regenerated
