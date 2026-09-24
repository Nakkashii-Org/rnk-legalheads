"use client";

import { usePathname } from "next/navigation";

/**
 * Public pages get the site header, newsletter band and footer. The CMS at /admin has its own
 * shell, so it renders without them.
 */
export default function SiteChrome({
  header,
  footer,
  children,
}: {
  header: React.ReactNode;
  footer: React.ReactNode;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  if (pathname === "/admin" || pathname.startsWith("/admin/")) return <>{children}</>;

  return (
    <>
      {header}
      <main id="main" className="flex-1">
        {children}
      </main>
      {footer}
    </>
  );
}
