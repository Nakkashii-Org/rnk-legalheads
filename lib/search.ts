// Reviewed synonym list (guide p.23). Keys are single lowercase words.
const searchAliases: Record<string, string> = {
  ipr: "intellectual property",
  sarfesi: "sarfaesi",
  surfacey: "sarfaesi",
  bail: "criminal defence",
};

export const MAX_QUERY_LENGTH = 100;

/** Lowercase query words with aliases expanded. Every word must match for a hit. */
export function queryWords(query: string): string[] {
  return query
    .toLowerCase()
    .slice(0, MAX_QUERY_LENGTH)
    .split(/\s+/)
    .filter(Boolean)
    .flatMap((word) => (searchAliases[word] ?? word).split(" "));
}

export function matchesAll(haystack: string, words: string[]): boolean {
  const text = haystack.toLowerCase();
  return words.every((word) => text.includes(word));
}
