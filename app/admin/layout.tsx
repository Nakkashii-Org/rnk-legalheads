import type { Metadata } from "next";

// The CMS is never indexed. noindex is not access control; sign-in on the server is (guide p.152).
export const metadata: Metadata = {
  title: { template: "%s | RNK CMS", default: "RNK CMS" },
  robots: { index: false, follow: false },
  referrer: "no-referrer",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
