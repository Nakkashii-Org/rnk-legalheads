"use client";

import { useState } from "react";
import Arrow from "@/components/ui/Arrow";

/**
 * Google Map loaded only on deliberate interaction, so no request goes to Google until the
 * visitor asks for it (guide p.139). The external link works without loading the embed.
 */
export default function OfficeMap({ query }: { query: string }) {
  const [loaded, setLoaded] = useState(false);
  const encoded = encodeURIComponent(query);
  const embedUrl = `https://www.google.com/maps?q=${encoded}&output=embed`;
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encoded}`;

  return (
    <div>
      <div className="relative aspect-[4/3] overflow-hidden border border-line bg-warm">
        {loaded ? (
          <iframe
            src={embedUrl}
            title="Map showing the RNK Legalheads office in Sector 13, Dwarka, New Delhi"
            className="absolute inset-0 h-full w-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-4 px-6 text-center">
            <svg aria-hidden="true" viewBox="0 0 24 24" className="h-8 w-8 text-rnk" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M12 21s-7-6.1-7-11.5A7 7 0 0 1 19 9.5C19 14.9 12 21 12 21Z" />
              <circle cx="12" cy="9.5" r="2.5" />
            </svg>
            <p className="text-[13px] leading-5 text-muted">Loading the map connects to Google Maps.</p>
            <button type="button" onClick={() => setLoaded(true)} className="btn btn-secondary min-h-11 px-5">
              Show map
            </button>
          </div>
        )}
      </div>
      <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="link-action mt-2">
        Open in Google Maps <span className="sr-only">(opens in a new tab)</span> <Arrow />
      </a>
    </div>
  );
}
