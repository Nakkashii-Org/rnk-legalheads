"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Logo from "@/components/layout/Logo";
import Arrow from "@/components/ui/Arrow";
import { primaryNav } from "@/lib/content/site";

export type HeaderGroup = { name: string; href: string };

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function SiteHeader({ groups }: { groups: HeaderGroup[] }) {
  const pathname = usePathname();
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileGroupsOpen, setMobileGroupsOpen] = useState(false);

  const servicesButtonRef = useRef<HTMLButtonElement>(null);
  const servicesPanelRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const mobilePanelRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Close menus after navigation (state adjusted during render, not in an effect).
  const [lastPathname, setLastPathname] = useState(pathname);
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setServicesOpen(false);
    setMobileOpen(false);
  }

  // Services disclosure: Escape closes and restores focus; outside click closes (guide p.22).
  useEffect(() => {
    if (!servicesOpen) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setServicesOpen(false);
        servicesButtonRef.current?.focus();
      }
    }
    function onPointer(event: MouseEvent) {
      const target = event.target as Node;
      if (!servicesPanelRef.current?.contains(target) && !servicesButtonRef.current?.contains(target)) {
        setServicesOpen(false);
      }
    }
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onPointer);
    };
  }, [servicesOpen]);

  // Mobile menu: lock background scroll, trap focus, restore focus on close (guide p.24).
  useEffect(() => {
    if (!mobileOpen) return;
    const menuButton = menuButtonRef.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMobileOpen(false);
        return;
      }
      if (event.key !== "Tab" || !mobilePanelRef.current) return;
      const focusable = mobilePanelRef.current.querySelectorAll<HTMLElement>("a[href], button:not([disabled])");
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKey);
      menuButton?.focus();
    };
  }, [mobileOpen]);

  return (
    <header className="relative z-40 border-b border-line bg-canvas">
      <div className="shell-wide flex h-[var(--header-height)] items-center justify-between gap-6">
        <Logo />

        {/* Desktop navigation */}
        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-7 text-[14px] leading-5">
            {primaryNav.map((item) => {
              const active = isActive(pathname, item.href);
              const link = (
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`relative inline-flex min-h-11 items-center hover:text-action ${
                    active ? "after:absolute after:inset-x-0 after:bottom-1.5 after:h-[2px] after:bg-rnk" : ""
                  }`}
                >
                  {item.label}
                </Link>
              );

              if (item.href !== "/services") return <li key={item.href}>{link}</li>;

              return (
                <li key={item.href} className="flex items-center gap-1">
                  {link}
                  <button
                    ref={servicesButtonRef}
                    type="button"
                    aria-expanded={servicesOpen}
                    aria-controls="services-menu"
                    aria-label="Show service groups"
                    onClick={() => setServicesOpen((open) => !open)}
                    className="inline-flex h-11 w-7 items-center justify-center hover:text-action"
                  >
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 12 12"
                      className={`h-3 w-3 transition-transform ${servicesOpen ? "rotate-180" : ""}`}
                    >
                      <path d="M2 4.5 6 8.5 10 4.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
                    </svg>
                  </button>
                </li>
              );
            })}
            <li>
              <Link href="/contact" className="btn btn-secondary min-h-11 px-5 font-normal">
                Contact <Arrow />
              </Link>
            </li>
            <li>
              <Link
                href="/search"
                aria-current={isActive(pathname, "/search") ? "page" : undefined}
                className="inline-flex min-h-11 items-center hover:text-action"
              >
                Search
              </Link>
            </li>
          </ul>
        </nav>

        {/* Mobile trigger */}
        <button
          ref={menuButtonRef}
          type="button"
          aria-expanded={mobileOpen}
          aria-controls="mobile-menu"
          onClick={() => setMobileOpen(true)}
          className="inline-flex h-11 items-center border border-line px-4 text-[13px] font-bold lg:hidden"
        >
          Menu
        </button>
      </div>

      {/* Services mega-menu (N01) */}
      <div
        id="services-menu"
        ref={servicesPanelRef}
        hidden={!servicesOpen}
        className="absolute inset-x-0 top-full border-b border-line bg-canvas"
      >
        <div className="shell-wide grid gap-10 py-10 lg:grid-cols-[1fr_2fr]">
          <div>
            <p className="eyebrow">Services</p>
            <p className="mt-5 font-serif text-[28px] leading-[34px]">
              Explore our
              <br />
              areas of practice.
            </p>
            <Link href="/services" className="btn btn-primary mt-7">
              View all services <Arrow />
            </Link>
          </div>
          <ul className="grid content-start gap-x-10 sm:grid-cols-2">
            {[...groups, { name: "Search the directory", href: "/services#directory-search" }].map((group) => (
              <li key={group.name} className="border-b border-line">
                <Link
                  href={group.href}
                  className="flex min-h-12 items-center justify-between gap-4 text-[14px] hover:text-action"
                >
                  {group.name}
                  <Arrow className="text-rnk" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Mobile menu panel (N03) */}
      <div
        id="mobile-menu"
        ref={mobilePanelRef}
        hidden={!mobileOpen}
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        className="fixed inset-0 z-50 overflow-y-auto bg-canvas lg:hidden"
      >
        <div className="shell-wide flex h-[var(--header-height)] items-center justify-between border-b border-line">
          <Logo />
          <button
            ref={closeButtonRef}
            type="button"
            onClick={() => setMobileOpen(false)}
            className="inline-flex h-11 items-center border border-line px-4 text-[13px] font-bold"
          >
            Close
          </button>
        </div>
        <nav aria-label="Mobile" className="shell-wide pb-12 pt-4">
          <ul>
            {[...primaryNav, { label: "Contact", href: "/contact" }].map((item) => (
              <li key={item.href} className="border-b border-line">
                <div className="flex items-center justify-between">
                  <Link
                    href={item.href}
                    aria-current={isActive(pathname, item.href) ? "page" : undefined}
                    className="flex min-h-16 flex-1 items-center justify-between font-serif text-[24px]"
                  >
                    {item.label}
                    {item.href !== "/services" && <Arrow className="text-rnk text-[20px]" />}
                  </Link>
                  {item.href === "/services" && (
                    <button
                      type="button"
                      aria-expanded={mobileGroupsOpen}
                      aria-controls="mobile-service-groups"
                      aria-label="Show service groups"
                      onClick={() => setMobileGroupsOpen((open) => !open)}
                      className="inline-flex h-12 w-12 items-center justify-center text-[24px] text-rnk"
                    >
                      <span aria-hidden="true">{mobileGroupsOpen ? "−" : "+"}</span>
                    </button>
                  )}
                </div>
                {item.href === "/services" && (
                  <ul id="mobile-service-groups" hidden={!mobileGroupsOpen} className="pb-3">
                    {groups.map((group) => (
                      <li key={group.name}>
                        <Link href={group.href} className="flex min-h-11 items-center text-[15px] text-muted">
                          {group.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
          <Link href="/search" className="btn btn-secondary mt-8">
            Search the website <Arrow />
          </Link>
          <p className="mt-6 text-[13px] text-muted">
            <Link href="/articles" className="hover:text-charcoal">Articles</Link> /{" "}
            <Link href="/recent-judgments" className="hover:text-charcoal">Recent judgments</Link> /{" "}
            <Link href="/newsletters" className="hover:text-charcoal">Newsletters</Link>
          </p>
        </nav>
      </div>
    </header>
  );
}
