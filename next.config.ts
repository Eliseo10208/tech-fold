import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "icon.icepanel.io",
        pathname: "/Technology/svg/**",
      },
    ],
  },
};

export default withNextIntl(nextConfig);
