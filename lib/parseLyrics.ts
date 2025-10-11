export interface ParsedLyricLine {
  time: number | null;
  text: string;
}

/**
 * Parses a lyrics file (LRC-like format).
 * Converts timestamps like [00:32.12] to seconds (float).
 * Returns an array with time in seconds or null if no timestamp.
 */
export function parseLyricsFile(rawLyrics: string): ParsedLyricLine[] {
  const lines = rawLyrics
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  const hasTimestamps = lines.some((line) => /\[\d{2}:\d{2}(?:\.\d{1,2})?\]/.test(line));

  if (hasTimestamps) {
    // Parse each line with a timestamp
    return lines
      .map((line) => {
        const match = line.match(/\[(\d{2}):(\d{2})(?:\.(\d{1,2}))?\](.*)/);
        if (!match) return null;

        const minutes = parseInt(match[1]);
        const seconds = parseInt(match[2]);
        const fraction = match[3] ? parseInt(match[3]) / 100 : 0;
        const time = minutes * 60 + seconds + fraction;
        const text = match[4].trim();

        return { time, text };
      })
      .filter(Boolean) as ParsedLyricLine[];
  } else {
    // No timestamps, return plain text lines
    return lines.map((text) => ({
      time: null,
      text,
    }));
  }
}
