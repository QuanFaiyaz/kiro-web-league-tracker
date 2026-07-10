/**
 * Maps Riot Games queue IDs to human-readable labels.
 * Used to display meaningful match type names instead of raw gameMode strings.
 */

export const QUEUE_TYPE_MAP: Record<number, string> = {
  400: "Draft Pick",
  420: "Ranked Solo",
  430: "Blind Pick",
  440: "Ranked Flex",
  450: "ARAM",
  480: "Swiftplay",
  490: "Quickplay",
  700: "Clash",
  900: "ARURF",
  1020: "One for All",
  1300: "Nexus Blitz",
  1700: "Arena",
  1900: "URF",
};

/**
 * Returns a human-readable queue type label for a given queueId.
 * Falls back to the raw gameMode string if the queueId is not recognized.
 */
export function getQueueTypeLabel(queueId: number, gameMode: string): string {
  return QUEUE_TYPE_MAP[queueId] ?? gameMode;
}
