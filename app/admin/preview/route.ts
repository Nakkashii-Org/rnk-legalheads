import { draftMode } from "next/headers";
import { redirect } from "next/navigation";
import type { NextRequest } from "next/server";
import { safePath } from "@/lib/admin/preview";
import { getAdminUser } from "@/lib/admin/session";

/**
 * GET /admin/preview?path=/articles/x → staff preview of drafts on the real page (C2).
 * Only for a signed-in CMS user; the pages still ask the backend with that user's session, so the
 * draft-mode cookie alone never reveals a draft.
 */
export async function GET(request: NextRequest) {
  const path = safePath(request.nextUrl.searchParams.get("path"));
  if (!(await getAdminUser())) redirect("/admin/login");
  (await draftMode()).enable();
  redirect(path);
}
