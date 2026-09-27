import { draftMode } from "next/headers";
import { redirect } from "next/navigation";
import type { NextRequest } from "next/server";
import { safePath } from "@/lib/admin/preview";

/** GET /admin/preview/exit?path=/articles/x → leaves the staff preview and shows the public page. */
export async function GET(request: NextRequest) {
  (await draftMode()).disable();
  redirect(safePath(request.nextUrl.searchParams.get("path")));
}
