# LoL Match History Tracker

A League of Legends player stats tracker built with Next.js. Search any player by Riot ID and view their recent match history, ranked info, and performance analytics in a clean, responsive dashboard.

## Features

- **Player Search** - Look up any player using their Riot ID (GameName#Tag) across multiple regions (Americas, Europe, Asia, South East Asia)
- **Match History** - View the last 10 matches with champion played, KDA, win/loss result, game duration, CS stats, and vision score
- **Match Details** - Expand any match for a detailed breakdown including items purchased and game mode
- **Match Filtering** - Filter match history by game mode or outcome
- **Ranked Data** - Display current ranked tier and LP via a rank badge
- **Analytics Dashboard**
  - Champion stats (games played, win rate, average KDA, CS/min)
  - Performance trends over recent matches
  - Role/game mode distribution chart
  - Win rate bar and win/loss streak tracking
- **Dark/Light Theme** - Toggle between dark and light modes
- **Responsive Design** - Works on desktop, tablet, and mobile screens
- **Loading States** - Skeleton loaders and spinners for a polished UX
- **Error Handling** - Toast notifications and error displays for API failures

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | [Next.js 16](https://nextjs.org) (App Router) |
| UI | [React 19](https://react.dev), [Tailwind CSS 4](https://tailwindcss.com) |
| Charts | [Recharts 3](https://recharts.org) |
| Language | [TypeScript 5](https://www.typescriptlang.org) |
| Data Source | [Riot Games API](https://developer.riotgames.com) |

## Getting Started

### Prerequisites

- Node.js 18 or later
- A Riot Games API key (get one at [developer.riotgames.com](https://developer.riotgames.com))

### Installation

```bash
# Clone the repository
git clone https://github.com/QuanFaiyaz/kiro-web-league-tracker.git
cd kiro-web-league-tracker

# Install dependencies
npm install
```

### Environment Variables

Create a `.env.local` file in the project root:

```env
RIOT_API_KEY=your-riot-api-key-here
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
npm run build
npm run start
```

### Linting

```bash
npm run lint
```

## Project Structure

```
app/
  page.tsx                   # Main page
  layout.tsx                 # Root layout
  globals.css                # Global styles (Tailwind)
  api/riot/route.ts          # Riot Games API proxy route
  components/
    Dashboard.tsx            # Main dashboard orchestrator
    SearchForm.tsx           # Riot ID search input
    RegionSelector.tsx       # Region dropdown
    MatchHistory.tsx         # Match list container
    MatchCard.tsx            # Individual match summary card
    MatchDetailModal.tsx     # Expanded match details modal
    MatchFilters.tsx         # Match filtering controls
    AnalyticsSection.tsx     # Analytics panel wrapper
    ChampionStats.tsx        # Per-champion statistics
    PerformanceTrends.tsx    # KDA and win rate trend charts
    RoleDistribution.tsx     # Game mode distribution chart
    WinRateBar.tsx           # Overall win rate display
    WinLossStreak.tsx        # Current win/loss streak
    RankBadge.tsx            # Ranked tier badge
    LoadingSpinner.tsx       # Spinner component
    SkeletonLoader.tsx       # Skeleton loading state
    SkeletonMatchCard.tsx    # Match card skeleton
    ErrorDisplay.tsx         # Error message component
    Toast.tsx                # Toast notification
    ToastProvider.tsx        # Toast context provider
    ThemeProvider.tsx        # Dark/light theme context
    ThemeToggle.tsx          # Theme switch button
lib/
  riot-api.ts                # Riot Games API client
  types.ts                   # TypeScript type definitions
  format-duration.ts         # Duration formatting utility
  queue-labels.ts            # Queue type label mapping
  time-ago.ts                # Relative time formatting
```

## Disclaimer

This project is not endorsed by Riot Games and does not reflect the views or opinions of Riot Games or anyone officially involved in producing or managing Riot Games properties. Riot Games and all associated properties are trademarks or registered trademarks of Riot Games, Inc.
