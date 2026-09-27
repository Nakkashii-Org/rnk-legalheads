import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { getAdminUser, isAdmin } from "@/lib/admin/session";

/**
 * POST /admin/refresh-site → drops the website's cached content so an Administrator's settings
 * change shows at once. Only a signed-in Administrator; the backend checks the session.
 */
export async function POST() {
  if (!isAdmin(await getAdminUser())) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  revalidateTag("content", { expire: 0 });
  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true });
}
