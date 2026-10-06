import type { Metadata } from "next";
import { notFound } from "next/navigation";
import es from "@/messages/es.json";
import en from "@/messages/en.json";

export const SITE_URL = "https://rodrigo-e-g.lat";
export const CV_URL = "/Rodrigo_CV.pdf";
export const EMAIL = "mailto:eliseo10208@gmail.com";
export const CALENDAR = "https://calendar.app.google/Rsxk2CxtF3BsSYoPA";
export const SOCIAL = {
  github: "https://github.com/Eliseo10208",
  linkedin: "https://www.linkedin.com/in/rodrigo-eliseo-garcia/",
};
export type PortfolioProject = (typeof es.Projects)[number];
export type SiteCopy = typeof es.Site;
export function getContent(locale: string) {
  if (locale !== "es" && locale !== "en") notFound();
  return locale === "en" ? en : es;
}
export function pageMetadata(locale: string, title: string, description: string, path = ""): Metadata {
  const url = `${SITE_URL}/${locale}${path}`;
  return {
    title, description,
    alternates: {
      canonical: url,
      languages: { es: `${SITE_URL}/es${path}`, en: `${SITE_URL}/en${path}`, "x-default": `${SITE_URL}/es${path}` },
    },
    openGraph: {
      type: "website", url, title, description, siteName: "Rodrigo Eliseo García",
      locale: locale === "es" ? "es_MX" : "en_US",
      alternateLocale: locale === "es" ? "en_US" : "es_MX",
      images: [{ url: `${SITE_URL}/og.png`, width: 1200, height: 630, alt: "Rodrigo Eliseo García — Full Stack Engineer" }],
    },
    twitter: { card: "summary_large_image", title, description, images: [`${SITE_URL}/og.png`] },
  };
}
