"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import ArchitecturalArt from "@/components/home/ArchitecturalArt";
import Arrow from "@/components/ui/Arrow";
import type { HeroSlide } from "@/lib/content/site";

const ADVANCE_MS = 7000;
const PAUSE_KEY = "rnk-hero-paused";

// Session-scoped pause preference, with an in-memory fallback when storage is blocked.
const pauseListeners = new Set<() => void>();
let memoryPaused = false;

function subscribePause(listener: () => void) {
  pauseListeners.add(listener);
  return () => {
    pauseListeners.delete(listener);
  };
}

function readPause(): boolean {
  try {
    const stored = sessionStorage.getItem(PAUSE_KEY);
    return stored === null ? memoryPaused : stored === "true";
  } catch {
    return memoryPaused;
  }
}

function writePause(value: boolean) {
  memoryPaused = value;
  try {
    sessionStorage.setItem(PAUSE_KEY, String(value));
  } catch {
    // Storage unavailable: the in-memory value still applies.
  }
  pauseListeners.forEach((listener) => listener());
}

// Autoplay is a desktop enhancement and never runs with reduced motion (guide p.21).
const AUTOPLAY_QUERY = "(min-width: 768px) and (prefers-reduced-motion: no-preference)";

function subscribeAutoplay(listener: () => void) {
  const query = window.matchMedia(AUTOPLAY_QUERY);
  query.addEventListener("change", listener);
  return () => query.removeEventListener("change", listener);
}

function subscribeVisibility(listener: () => void) {
  document.addEventListener("visibilitychange", listener);
  return () => document.removeEventListener("visibilitychange", listener);
}

/**
 * Homepage hero (guide p.21). The H1 stays outside the changing panel.
 * Auto-advance runs only on desktop without reduced motion, and only while every
 * pause condition is false. A deliberate user pause persists for the session.
 */
export default function HeroSlider({ slides }: { slides: HeroSlide[] }) {
  const count = slides.length;
  const [index, setIndex] = useState(0);
  const [hovering, setHovering] = useState(false);
  const [focusWithin, setFocusWithin] = useState(false);
  const [offscreen, setOffscreen] = useState(false);

  // Server snapshots are "not playing", so the first render matches the static HTML.
  const userPaused = useSyncExternalStore(subscribePause, readPause, () => false);
  const autoAllowed = useSyncExternalStore(
    subscribeAutoplay,
    () => window.matchMedia(AUTOPLAY_QUERY).matches,
    () => false,
  );
  const tabHidden = useSyncExternalStore(
    subscribeVisibility,
    () => document.visibilityState === "hidden",
    () => false,
  );

  const sectionRef = useRef<HTMLElement>(null);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => setOffscreen(!entry.isIntersecting), {
      threshold: 0.25,
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const playing = autoAllowed && !userPaused && !hovering && !focusWithin && !tabHidden && !offscreen;

  // Keyed on index, so a manual change restarts the countdown without clearing userPaused.
  useEffect(() => {
    if (!playing) return;
    const timer = window.setTimeout(() => setIndex((i) => (i + 1) % count), ADVANCE_MS);
    return () => window.clearTimeout(timer);
  }, [playing, index, count]);

  const go = useCallback((next: number) => setIndex(((next % count) + count) % count), [count]);

  function togglePause() {
    writePause(!userPaused);
  }

  return (
    <section
      ref={sectionRef}
      aria-roledescription="carousel"
      aria-label="Introduction"
      className="shell-wide pb-12 pt-8 md:pt-12 lg:pb-4 lg:pt-4"
      onFocus={(event) => {
        // Pause for keyboard focus only; a mouse click on a control must not stop autoplay.
        if ((event.target as HTMLElement).matches(":focus-visible")) setFocusWithin(true);
      }}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setFocusWithin(false);
      }}
      onTouchStart={(event) => {
        touchStartX.current = event.touches[0].clientX;
      }}
      onTouchEnd={(event) => {
        if (touchStartX.current === null) return;
        const dx = event.changedTouches[0].clientX - touchStartX.current;
        touchStartX.current = null;
        if (Math.abs(dx) > 50) go(index + (dx < 0 ? 1 : -1));
      }}
    >
      <div className="grid gap-10 lg:grid-cols-2 lg:gap-12">
        {/* Text column: comes before the image on small screens (guide p.153) */}
        {/* Hover pauses only while the pointer is over the message and controls, not the image. */}
        <div
          className="flex flex-col lg:py-14 lg:pl-12 xl:pl-14"
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => setHovering(false)}
        >
          <p className="eyebrow">RNK Legalheads / Established 2024</p>
          <h1 className="mt-6 font-serif text-[45px] font-normal leading-[49px] tracking-[-0.02em] md:text-[64px] md:leading-[68px]">
            A full-service
            <br />
            law firm.
          </h1>

          <div className="mt-7 grid" aria-live={playing ? "off" : "polite"}>
            {slides.map((slide, i) => {
              const active = i === index;
              return (
                <div
                  key={slide.heading}
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`${i + 1} of ${count}`}
                  aria-hidden={!active}
                  inert={!active}
                  className="[grid-area:1/1] transition-opacity duration-[450ms] ease-out"
                  style={{ opacity: active ? 1 : 0 }}
                >
                  <p className="text-[17px] leading-[26px] md:text-[19px] md:leading-[28px]">{slide.heading}</p>
                  <p className="mt-3 max-w-[470px] text-[15px] leading-[24px] text-muted md:text-[16px] md:leading-[26px]">
                    {slide.body}
                  </p>
                  <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3">
                    <Link href={slide.cta.href} className="btn btn-primary">
                      {slide.cta.label} <Arrow />
                    </Link>
                    <Link href="/about" className="link-action">
                      Our firm <Arrow />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          <div role="group" aria-label="Slide controls" className="mt-8 flex flex-wrap items-center gap-1 lg:mt-auto lg:pt-12">
            {slides.map((slide, i) => {
              const active = i === index;
              return (
                <button
                  key={slide.heading}
                  type="button"
                  onClick={() => go(i)}
                  aria-label={`Show slide ${i + 1}: ${slide.heading}`}
                  aria-current={active ? "true" : undefined}
                  className={`relative inline-flex h-11 min-w-11 items-center justify-center px-2 text-[13px] tabular-nums ${
                    active ? "text-charcoal" : "text-muted hover:text-charcoal"
                  }`}
                >
                  {String(i + 1).padStart(2, "0")}
                  {active && <span aria-hidden="true" className="absolute inset-x-1 bottom-1 h-[2px] bg-rnk" />}
                </button>
              );
            })}
            <button
              type="button"
              onClick={togglePause}
              aria-label={userPaused ? "Play slideshow" : "Pause slideshow"}
              className="ml-2 hidden h-11 items-center border border-[#b9b5af] px-4 text-[13px] hover:border-charcoal md:motion-safe:inline-flex"
            >
              {userPaused ? "Play" : "Pause"}
            </button>
            <button
              type="button"
              onClick={() => go(index - 1)}
              aria-label="Previous slide"
              className="ml-1 inline-flex h-11 w-11 items-center justify-center text-muted hover:text-charcoal"
            >
              <span aria-hidden="true">←</span>
            </button>
            <button
              type="button"
              onClick={() => go(index + 1)}
              aria-label="Next slide"
              className="inline-flex h-11 w-11 items-center justify-center text-muted hover:text-charcoal"
            >
              <span aria-hidden="true">→</span>
            </button>
          </div>
        </div>

        {/* Image column */}
        <div className="relative aspect-[7/6] overflow-hidden bg-warm lg:aspect-auto lg:min-h-[540px]">
          {slides.map((slide, i) => (
            <div
              key={slide.heading}
              className="absolute inset-0 transition-opacity duration-[450ms] ease-out"
              style={{ opacity: i === index ? 1 : 0 }}
            >
              <ArchitecturalArt variant={i} />
            </div>
          ))}
          <p className="absolute bottom-4 left-4 bg-canvas px-2.5 py-1 text-[10px] uppercase leading-4 tracking-[0.12em] text-muted">
            Architectural study / Illustrative
          </p>
        </div>
      </div>
    </section>
  );
}
