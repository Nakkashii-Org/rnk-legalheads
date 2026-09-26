"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Logo from "@/components/layout/Logo";
import Arrow from "@/components/ui/Arrow";
import { adminRequest } from "@/lib/admin/request";
import type { AdminUser } from "@/lib/admin/session";

const navGroups: { heading?: string; adminOnly?: boolean; links: { label: string; href: string }[] }[] = [
  { links: [{ label: "Dashboard", href: "/admin" }] },
  {
    heading: "Publications",
    links: [
      { label: "Articles", href: "/admin/articles" },
      { label: "Judgments", href: "/admin/judgments" },
      { label: "Legal updates", href: "/admin/legal-updates" },
      { label: "Newsletters", href: "/admin/newsletters" },
    ],
  },
  {
    heading: "Website content",
    links: [
      { label: "Services", href: "/admin/services" },
      { label: "People", href: "/admin/people" },
      { label: "Industries", href: "/admin/industries" },
      { label: "Jobs", href: "/admin/jobs" },
    ],
  },
  {
    heading: "Workflow",
    links: [
      { label: "Review queue", href: "/admin/review" },
      { label: "Media library", href: "/admin/media" },
    ],
  },
  {
    heading: "Inbox",
    links: [
      { label: "Enquiries", href: "/admin/enquiries" },
      { label: "Applications", href: "/admin/applications" },
    ],
  },
  {
    heading: "Administration",
    adminOnly: true,
    links: [
      { label: "Site settings", href: "/admin/settings" },
      { label: "Users and roles", href: "/admin/users" },
      { label: "Audit log", href: "/admin/audit" },
    ],
  },
];

const isActive = (pathname: string, href: string) =>
  href === "/admin" ? pathname === "/admin" : pathname === href || pathname.startsWith(`${href}/`);

const ROLE_LABELS: Record<string, string> = { contributor: "Contributor", reviewer: "Legal reviewer", publisher: "Publisher", admin: "Administrator" };

export default function AdminShell({ user, children }: { user: AdminUser; children: React.ReactNode }) {
  const administrator = user.roles.includes("admin");
  const roleText = user.roles.map((r) => ROLE_LABELS[r] ?? r).join(", ");
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [openedAt, setOpenedAt] = useState(pathname);

  // Close the mobile menu after navigating (adjusting state during render, not in an effect).
  if (openedAt !== pathname) {
    setOpenedAt(pathname);
    setMenuOpen(false);
  }

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  async function signOut() {
    await adminRequest("/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  const nav = (
    <nav aria-label="CMS" className="space-y-6">
      {navGroups.filter((group) => administrator || !group.adminOnly).map((group, i) => (
        <div key={group.heading ?? i}>
          {group.heading && (
            <p className="px-3 text-[11px] font-bold uppercase leading-4 tracking-[0.14em] text-muted">{group.heading}</p>
          )}
          <ul className={group.heading ? "mt-2" : ""}>
            {group.links.map((link) => {
              const active = isActive(pathname, link.href);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={`flex min-h-11 items-center border-l-2 px-3 text-[14px] md:min-h-9 ${
                      active ? "border-rnk bg-canvas font-bold" : "border-transparent hover:bg-canvas"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );

  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#admin-main"
        className="sr-only z-50 bg-charcoal px-4 py-3 text-[14px] font-bold text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to main content
      </a>

      <div role="note" className="bg-charcoal px-4 py-2 text-center text-[12px] leading-[18px] text-canvas">
        <strong>Signed in.</strong>{" "}Users, roles and the audit log are live. Editing and publishing content arrive in the next phase:
        content changes made here are not saved yet.
      </div>

      <header className="flex h-16 items-center justify-between gap-4 border-b border-line bg-canvas px-4 md:px-6">
        <div className="flex items-center gap-3">
          <Logo href="/admin" label="RNK Legalheads CMS dashboard" />
          <span className="hidden border-l border-line pl-3 text-[12px] font-bold uppercase tracking-[0.14em] text-muted sm:inline">CMS</span>
        </div>
        <div className="flex items-center gap-2 md:gap-4">
          <Link href="/" target="_blank" className="hidden items-center gap-1.5 text-[13px] hover:text-action md:inline-flex">
            View website <Arrow />
          </Link>
          <span className="hidden text-right text-[13px] leading-[16px] lg:block">
            <span className="block font-bold">{user.name}</span>
            <span className="text-muted">{roleText}</span>
          </span>
          <button type="button" onClick={signOut} className="hidden min-h-9 border border-charcoal px-3 text-[13px] font-bold hover:bg-warm md:inline-flex md:items-center">
            Sign out
          </button>
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="admin-mobile-nav"
            className="inline-flex min-h-11 items-center border border-charcoal px-4 text-[14px] font-bold md:hidden"
          >
            {menuOpen ? "Close" : "Menu"}
          </button>
        </div>
      </header>

      {menuOpen && (
        <div id="admin-mobile-nav" className="border-b border-line bg-warm px-2 py-4 md:hidden">
          <p className="mb-4 px-3 text-[13px] leading-[18px]">
            <span className="block font-bold">{user.name}</span>
            <span className="text-muted">{roleText}</span>
          </p>
          {nav}
          <div className="mt-6 flex flex-wrap gap-3 px-3">
            <Link href="/" target="_blank" className="inline-flex min-h-11 items-center gap-1.5 text-[14px] underline underline-offset-4">
              View website <Arrow />
            </Link>
            <button type="button" onClick={signOut} className="inline-flex min-h-11 items-center border border-charcoal px-4 text-[14px] font-bold">
              Sign out
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-1">
        <aside className="hidden w-[240px] shrink-0 border-r border-line bg-warm px-3 py-6 md:block">
          <div className="sticky top-6">{nav}</div>
        </aside>
        <main id="admin-main" className="min-w-0 flex-1 px-4 py-8 md:px-8 lg:px-10">
          {children}
        </main>
      </div>
    </div>
  );
}
