import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // One-hop permanent redirects from the old site (guide pp.11–13).
  // /ip-litigation and /ip-prosecution are added once their replacement service pages are approved.
  async redirects() {
    return [{ source: "/practices", destination: "/services", statusCode: 301 }];
  },
};

export default nextConfig;
