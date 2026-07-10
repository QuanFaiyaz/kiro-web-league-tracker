/**
 * Formats a timestamp (milliseconds since epoch) into a human-readable
 * relative time string (e.g., "2 minutes ago", "1 hour ago", "3 days ago").
 */
export function formatTimeAgo(timestamp: number): string {
  const now = Date.now();
  const diffMs = now - timestamp;

  // Handle future timestamps
  if (diffMs < 0) {
    return "just now";
  }

  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (seconds < 60) {
    return "just now";
  }

  if (minutes < 60) {
    return minutes === 1 ? "1 minute ago" : `${minutes} minutes ago`;
  }

  if (hours < 24) {
    return hours === 1 ? "1 hour ago" : `${hours} hours ago`;
  }

  if (days < 7) {
    return days === 1 ? "1 day ago" : `${days} days ago`;
  }

  if (weeks < 5) {
    return weeks === 1 ? "1 week ago" : `${weeks} weeks ago`;
  }

  if (months < 12) {
    return months === 1 ? "1 month ago" : `${months} months ago`;
  }

  return years === 1 ? "1 year ago" : `${years} years ago`;
}
