import { redirect } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import { showDrafts } from "@/lib/visibility";

/**
 * Until the backend provides real sign-in, the CMS screens are a UI preview available only in
 * draft review mode. On the public site every CMS page sends visitors to the sign-in screen.
 */
export default function PanelLayout({ children }: { children: React.ReactNode }) {
  if (!showDrafts) redirect("/admin/login");
  return <AdminShell>{children}</AdminShell>;
}
