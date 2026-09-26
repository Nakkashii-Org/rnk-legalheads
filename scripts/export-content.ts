/**
 * Exports the website's current content (including the labelled layout previews) as one JSON
 * snapshot in the same shape the backend's GET /api/content/bundle returns. The backend imports
 * it with `npm run seed`.
 *
 * Run from rnk-legalhead-frontend:
 *   SHOW_DRAFT_CONTENT=true npx tsx scripts/export-content.ts ../rnk-legalhead-backend/seed/content.json
 */
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";

async function main() {
  if (process.env.SHOW_DRAFT_CONTENT !== "true") throw new Error("Run with SHOW_DRAFT_CONTENT=true so drafts and previews are included.");
  const { buildLocalContent } = await import("../lib/content/local");
  const data = buildLocalContent();
  const out = path.resolve(process.argv[2] ?? "content-export.json");
  mkdirSync(path.dirname(out), { recursive: true });
  writeFileSync(out, `${JSON.stringify(data, null, 2)}\n`);
  console.log(
    `Wrote ${out}: ${data.services.length} services, ${data.industries.length} industries, ${data.people.length} people, ` +
      `${data.jobs.length} jobs, ${data.publications.length} publications, ${data.newsletters.length} newsletters`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
