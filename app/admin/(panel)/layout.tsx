import { redirect } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import { getAdminUser } from "@/lib/admin/session";

/**
 * Every CMS screen needs a signed-in user (password + 6-digit code), checked by the backend on
 * each request. Without one, visitors are sent to the sign-in page.
 */
export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const user = await getAdminUser();
  if (!user) redirect("/admin/login");
  return <AdminShell user={user}>{children}</AdminShell>;
}
