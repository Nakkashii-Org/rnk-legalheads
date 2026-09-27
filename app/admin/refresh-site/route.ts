import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/admin/session";

/**
 * POST /admin/refresh-site → drops the website's cached content so a settings change, a publish or
 * an unpublish shows at once. Only a signed-in Publisher or Administrator; the backend checks the session.
 */
export async function POST() {
  const user = await getAdminUser();
  if (!user?.roles.some((r) => r === "admin" || r === "publisher")) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  revalidateTag("content", { expire: 0 });
  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true });
}
