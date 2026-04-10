import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

type LocaleSwitcherProps = {
  currentLocale: string;
};

const localeLabels: Record<(typeof routing.locales)[number], string> = {
  en: "EN",
  es: "ES",
};

export function LocaleSwitcher({ currentLocale }: LocaleSwitcherProps) {
  return (
    <div className="locale-switcher" aria-label="Locale switcher">
      {routing.locales.map((locale) => {
        const isActive = locale === currentLocale;

        return (
          <Link
            className={isActive ? "locale-pill locale-pill-active" : "locale-pill"}
            href="/"
            key={locale}
            locale={locale}
          >
            {localeLabels[locale]}
          </Link>
        );
      })}
    </div>
  );
}
