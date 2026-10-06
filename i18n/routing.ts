import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["es", "en"],
  defaultLocale: "es",
  // Canonical language alternates are emitted by pageMetadata, including x-default.
  alternateLinks: false,
});
