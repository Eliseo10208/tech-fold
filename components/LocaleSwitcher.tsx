import { routing } from "@/i18n/routing";
export function LocaleSwitcher({ currentLocale, path = "" }: { currentLocale: string; path?: string }) {
  return (
    <nav className="locale-switcher" aria-label={currentLocale === "es" ? "Idioma" : "Language"}>
      {routing.locales.map(locale => (
        <a href={`/${locale}${path}`} hrefLang={locale} lang={locale} className="locale-pill" aria-current={locale === currentLocale ? "page" : undefined} key={locale}>{locale.toUpperCase()}</a>
      ))}
    </nav>
  );
}
