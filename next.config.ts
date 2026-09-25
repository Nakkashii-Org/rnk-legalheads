import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // One-hop permanent redirects from the old site (guide pp.11–13, p.120).
  // /ip-litigation and /ip-prosecution are added once their replacement service pages are approved.
  async redirects() {
    return [
      { source: "/practices", destination: "/services", statusCode: 301 },
      { source: "/news", destination: "/insights", statusCode: 301 },
      { source: "/blog", destination: "/articles", statusCode: 301 },
    ];
  },
  // Browser form posts to /api/* are forwarded to rnk-legalhead-backend, so the forms keep calling
  // their own origin (no CORS, keys stay server-side). Read at build time: set BACKEND_URL before
  // building. Without it, /api/* returns 404 and the forms honestly report "could not be sent".
  async rewrites() {
    const backend = process.env.BACKEND_URL?.replace(/\/+$/, "");
    return backend ? [{ source: "/api/:path*", destination: `${backend}/api/:path*` }] : [];
  },
};

export default nextConfig;
