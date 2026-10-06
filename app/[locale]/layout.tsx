import type { Metadata } from "next";
import { Newsreader, Source_Sans_3 } from "next/font/google";
import { hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { SITE_URL } from "@/lib/portfolio";
import "../globals.css";

const sourceSans = Source_Sans_3({ variable: "--font-sans-base", subsets: ["latin"], display: "swap" });
const newsreader = Newsreader({ variable: "--font-display-base", subsets: ["latin"], display: "swap" });
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  icons: {
    icon: { url: "/favicon.png", type: "image/png", sizes: "96x96" },
    apple: "/icons/cat-peek.png",
  },
};
export function generateStaticParams() {
  return routing.locales.map(locale => ({ locale }));
}
export default async function LocaleLayout({ children, params }: {
  children: React.ReactNode; params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  return <html lang={locale} className={`${sourceSans.variable} ${newsreader.variable}`}><body>{children}</body></html>;
}
