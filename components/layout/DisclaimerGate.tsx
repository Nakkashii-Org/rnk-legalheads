"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";

/** Remembered for 30 days, then asked again. */
const COOKIE = "rnk_disclaimer";
const MAX_AGE = 30 * 24 * 60 * 60;

/**
 * Runs before the page paints: a visitor who already agreed never sees the dialog flash. The
 * dialog is in the page's HTML for everyone else, so it shows at once, even before JavaScript loads.
 */
export const disclaimerScript = `try{if(document.cookie.split("; ").indexOf("${COOKIE}=1")>-1)document.documentElement.setAttribute("data-disclaimer","ok")}catch(e){}`;

const EVENT = "rnk-disclaimer";
const subscribe = (onChange: () => void) => {
  window.addEventListener(EVENT, onChange);
  return () => window.removeEventListener(EVENT, onChange);
};
const agreedBefore = () => document.documentElement.getAttribute("data-disclaimer") === "ok";

/**
 * Bar Council of India rules forbid advocates' advertising and solicitation, so the website asks every
 * visitor to confirm they came of their own accord before reading on. Website visitors only: never
 * shown inside the CMS.
 */
export default function DisclaimerGate({ firm }: { firm: string }) {
  const pathname = usePathname();
  // The server always renders the dialog; the browser reads the flag the early script set.
  const accepted = useSyncExternalStore(subscribe, agreedBefore, () => false);
  const open = !accepted;
  const [agreed, setAgreed] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const cms = pathname.startsWith("/admin");

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

  function proceed() {
    if (!agreed) return;
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
        <div className="overflow-y-auto px-5 py-7 sm:px-9 sm:py-9">
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-muted">{firm}</p>
          <h2 id="disclaimer-title" className="mt-2 font-serif text-[28px] leading-[36px]">
            Disclaimer
          </h2>
          <div id="disclaimer-text" className="mt-5 space-y-3 border-t border-line pt-5 text-[14px] leading-[23px] text-muted sm:text-[15px] sm:leading-[25px]">
            <p>
              The Bar Council of India does not permit advertisement or solicitation by advocates in any form or manner. By
              accessing this website, you acknowledge and confirm that you are seeking information relating to{" "}
              <strong className="text-charcoal">{firm}</strong> of your own accord and that there has been no form of
              solicitation, advertisement or inducement by {firm} or its members.
            </p>
            <p>
              The content of this website is for informational purposes only and should not be interpreted as soliciting or
              advertisement. No material or information on this website should be construed as legal advice.
            </p>
            <p>
              {firm} is not liable for the consequences of any action taken by relying on the material or information on this
              website. The contents of this website are the intellectual property of {firm}.
            </p>
          </div>

          <div className="mt-6 flex items-start gap-3">
            <input
              id="disclaimer-agree"
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-0.5 h-5 w-5 shrink-0 accent-charcoal"
            />
            <label htmlFor="disclaimer-agree" className="text-[14px] leading-[22px]">
              I have read and accept the disclaimer. I understand that this website does not provide legal advice.
            </label>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
            <button type="button" onClick={proceed} disabled={!agreed} aria-describedby="disclaimer-hint" className="btn btn-primary disabled:cursor-not-allowed disabled:opacity-50">
              Proceed to website
            </button>
            <a href="https://www.google.com" className="inline-flex min-h-11 items-center text-[14px] underline underline-offset-4">
              Leave this website
            </a>
          </div>
          {!agreed && (
            <p id="disclaimer-hint" className="mt-3 text-[12px] text-muted">
              Tick the box above to continue.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
