/**
 * Only approved content is public (guide p.18, p.150). Set SHOW_DRAFT_CONTENT=true
 * to review the full proposed catalogue and layout previews in development.
 */
export const showDrafts = process.env.SHOW_DRAFT_CONTENT === "true";

export function isPublic(item: { approved: boolean; hold?: boolean }): boolean {
  if (showDrafts) return true;
  return item.approved && !item.hold;
}
