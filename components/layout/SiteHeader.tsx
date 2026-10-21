"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Logo from "@/components/layout/Logo";
import { primaryNav } from "@/lib/content/site";

export type HeaderGroup = { name: string; href: string; services: { title: string; href: string }[] };

// Sections whose pages live under more than one path (the mockups mark Insights on all of these).
const sectionPaths: Record<string, string[]> = {
  "/insights": ["/insights", "/articles", "/recent-judgments", "/legal-updates", "/newsletters"],
};

function isActive(pathname: string, href: string) {
  return (sectionPaths[href] ?? [href]).some((path) => pathname === path || pathname.startsWith(`${path}/`));
}

export default function SiteHeader({ groups }: { groups: HeaderGroup[] }) {
  const pathname = usePathname();
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

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
    <header className="relative z-40 border-b border-line bg-canvas print:hidden">
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
              <Link
                href="/contact"
                aria-current={isActive(pathname, "/contact") ? "page" : undefined}
                className="btn btn-secondary min-h-11 px-5 font-normal aria-[current=page]:bg-warm"
              >
                Contact
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

      {/* Services menu: each practice group with its services */}
      <div
        id="services-menu"
        ref={servicesPanelRef}
        hidden={!servicesOpen}
        className="absolute inset-x-0 top-full max-h-[calc(100vh-var(--header-height))] overflow-y-auto border-b border-line bg-canvas"
      >
        <div className="shell-wide py-10">
          <div className="flex items-start justify-between gap-6">
            <p className="font-serif text-[30px] leading-[38px]">Services</p>
            <button
              type="button"
              onClick={() => {
                setServicesOpen(false);
                servicesButtonRef.current?.focus();
              }}
              className="inline-flex min-h-11 items-center text-[13px] font-bold hover:text-action"
            >
              Close
            </button>
          </div>
          <div className="mt-6 grid gap-x-10 md:grid-cols-3">
            {groups.map((group) => (
              <div key={group.name} className="border-t border-line pb-8 pt-5">
                <Link href={group.href} className="font-serif text-[20px] leading-[28px] hover:text-action">
                  {group.name}
                </Link>
                <ul className="mt-3">
                  {group.services.map((service) => (
                    <li key={service.href}>
                      <Link href={service.href} className="inline-flex min-h-9 items-center text-[13px] font-bold hover:text-action">
                        {service.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <Link href="/services" className="btn btn-primary mt-2">
            View all services
          </Link>
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
            {[...primaryNav, { label: "Contact", href: "/contact" }, { label: "Search", href: "/search" }].map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive(pathname, item.href) ? "page" : undefined}
                  className="flex min-h-14 items-center text-[24px] font-bold aria-[current=page]:text-action"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-6">
            {groups.map((group) => (
              <div key={group.name} className="border-t border-line pb-6 pt-5">
                <Link href={group.href} className="font-serif text-[20px] leading-[28px]">
                  {group.name}
                </Link>
                <ul className="mt-2">
                  {group.services.map((service) => (
                    <li key={service.href}>
                      <Link href={service.href} className="flex min-h-11 items-center text-[14px] font-bold">
                        {service.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <Link href="/services" className="btn btn-primary mt-4">
            View all services
          </Link>
        </nav>
      </div>
    </header>
  );
}
