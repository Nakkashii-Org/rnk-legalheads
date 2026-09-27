/** Only paths on this site, never another origin ("//evil.example" or "/\evil.example"). */
export function safePath(value: string | null): string {
  return value && value.startsWith("/") && !value.startsWith("//") && !value.startsWith("/\\") ? value : "/";
}

/** Link that opens a page in the staff preview (drafts visible, signed-in CMS users only). */
export const previewHref = (path: string) => `/admin/preview?path=${encodeURIComponent(path)}`;
