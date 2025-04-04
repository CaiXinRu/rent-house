import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/",
        permanent: false,
        destination: "/rental-map",
      },
      {
        source: "/en",
        permanent: false,
        destination: "/en/rental-map",
      },
      {
        source: "/zh",
        permanent: false,
        destination: "/zh/rental-map",
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
    ],
  },
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
