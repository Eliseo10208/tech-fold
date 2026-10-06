import Image from "next/image";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { MobileNav } from "./MobileNav";
import { CV_URL, type SiteCopy } from "@/lib/portfolio";

export function SiteHeader({ locale, copy, path = "" }: { locale: string; copy: SiteCopy; path?: string }) {
  const links = [
    { href: `/${locale}#selected-work`, label: copy.nav.work },
    { href: `/${locale}#demos`, label: copy.nav.demos },
    { href: `/${locale}#about`, label: copy.nav.about },
    { href: `/${locale}#contact`, label: copy.nav.contact },
  ];
  return (
    <header className="site-headerShell">
      <div className="site-shell site-header">
        <a className="brand-mark" href={`/${locale}`}>
          <Image src="/icons/cat-peek.png" width={32} height={24} alt="" />
          <span>{copy.shortName}<small>Full Stack Engineer</small></span>
        </a>
        <nav className="header-nav" aria-label={copy.navLabel}>
          {links.map(link => <a href={link.href} key={link.href}>{link.label}</a>)}
        </nav>
        <div className="header-actions">
          <LocaleSwitcher currentLocale={locale} path={path} />
          <a className="header-cv" href={CV_URL} download>{copy.hero.cv}</a>
          <MobileNav currentLocale={locale} ariaLabel={copy.navLabel} links={links} />
        </div>
      </div>
    </header>
  );
}
