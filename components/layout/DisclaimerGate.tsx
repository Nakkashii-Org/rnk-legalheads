"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useEffect, useRef, useSyncExternalStore } from "react";
import { disclaimerText } from "@/lib/content/legal";

/** Remembered for 30 days, then asked again. */
const COOKIE = "rnk_disclaimer";
const MAX_AGE = 30 * 24 * 60 * 60;

/**
 * Runs before the page paints: a visitor who already agreed never sees the dialog flash. The
 * dialog is in the page's HTML for everyone else, so it shows at once, even before JavaScript loads.
 */
export const disclaimerScript = `try{if(document.cookie.split("; ").indexOf("${COOKIE}=1")>-1)document.documentElement.setAttribute("data-disclaimer","ok")}catch(e){}`;

const EVENT = "rnk-disclaimer";
const LEGAL_PAGES = ["/disclaimer", "/privacy-policy", "/terms-and-conditions", "/cookie-policy"];
const subscribe = (onChange: () => void) => {
  window.addEventListener(EVENT, onChange);
  return () => window.removeEventListener(EVENT, onChange);
};
const agreedBefore = () => document.documentElement.getAttribute("data-disclaimer") === "ok";

/**
 * The firm's approved Website Disclaimer (Bar Council of India rules on advertising and solicitation):
 * every visitor clicks "I Agree" before using the website; "I Disagree" leaves it. Website visitors
 * only: never shown inside the CMS.
 */
export default function DisclaimerGate({ firm }: { firm: string }) {
  const pathname = usePathname();
  // The server always renders the dialog; the browser reads the flag the early script set.
  const accepted = useSyncExternalStore(subscribe, agreedBefore, () => false);
  const open = !accepted;
  const dialogRef = useRef<HTMLDivElement>(null);
  // Not in the CMS; and the legal pages stay readable, so a visitor can read them before agreeing.
  const cms = pathname.startsWith("/admin") || LEGAL_PAGES.includes(pathname);

  // While open: the page behind can't scroll, and keyboard focus stays inside the dialog.
  useEffect(() => {
    if (cms || !open) return;
    const dialog = dialogRef.current;
    if (!dialog) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialog.focus();
    const trap = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const items = dialog.querySelectorAll<HTMLElement>("input, button, a[href]");
      const first = items[0];
      const last = items[items.length - 1];
      if (!first || !last) return;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", trap);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", trap);
    };
  }, [cms, open]);

  if (cms || !open) return null;

  function agree() {
    document.cookie = `${COOKIE}=1; max-age=${MAX_AGE}; path=/; SameSite=Lax${location.protocol === "https:" ? "; Secure" : ""}`;
    document.documentElement.setAttribute("data-disclaimer", "ok");
    window.dispatchEvent(new Event(EVENT));
  }

  return (
    <div id="site-disclaimer" className="fixed inset-0 z-[100] flex items-center justify-center bg-charcoal/85 p-3 backdrop-blur-sm sm:p-6">
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="disclaimer-title"
        aria-describedby="disclaimer-text"
        tabIndex={-1}
        className="flex max-h-[calc(100vh-24px)] w-full max-w-[640px] flex-col border-t-4 border-rnk bg-canvas shadow-2xl outline-none"
      >
        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-7 sm:px-9 sm:py-9">
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-muted">{firm}</p>
          <h2 id="disclaimer-title" className="mt-2 font-serif text-[28px] leading-[36px]">
            Website Disclaimer
          </h2>
          <div id="disclaimer-text" className="mt-5 space-y-3 border-t border-line pt-5 text-[14px] leading-[23px] text-muted sm:text-[15px] sm:leading-[25px]">
            {disclaimerText.map((b, i) =>
              typeof b === "string" ? (
                <p key={i}>{b}</p>
              ) : "lead" in b ? (
                <p key={i}>
                  <strong className="text-charcoal">{b.lead}</strong> {b.text}
                </p>
              ) : null,
            )}
          </div>
          <p className="mt-5 text-[12px] leading-[18px] text-muted">
            Read the full{" "}
            <Link href="/privacy-policy" className="underline underline-offset-4">
              Privacy Policy
            </Link>
            ,{" "}
            <Link href="/terms-and-conditions" className="underline underline-offset-4">
              Terms of Use
            </Link>{" "}
            and{" "}
            <Link href="/cookie-policy" className="underline underline-offset-4">
              Cookie Policy
            </Link>
            .
          </p>
        </div>
        {/* Always visible below the scrolling text, so nobody has to hunt for the buttons. */}
        <div className="flex shrink-0 flex-wrap items-center gap-3 border-t border-line bg-warm px-5 py-4 sm:px-9">
          <button type="button" onClick={agree} className="btn btn-primary">
            I Agree
          </button>
          <a href="https://www.google.com" className="btn btn-secondary">
            I Disagree
          </a>
        </div>
      </div>
    </div>
  );
}
