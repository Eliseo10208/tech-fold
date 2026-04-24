"use client";

import { useState } from "react";
import { LocaleSwitcher } from "./LocaleSwitcher";

type MobileNavProps = {
  currentLocale: string;
  ariaLabel: string;
  links: Array<{ href: string; label: string }>;
  ctaLabel?: string;
  ctaHref?: string;
};

export function MobileNav({
  currentLocale,
  ariaLabel,
  links,
  ctaLabel,
  ctaHref,
}: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);

  function closeMenu() {
    setIsOpen(false);
  }

  return (
    <div className={isOpen ? "mobileNav mobileNavOpen" : "mobileNav"}>
      <button
        aria-expanded={isOpen}
        aria-label={ariaLabel}
        className="mobileNavToggle"
        onClick={() => setIsOpen((previous) => !previous)}
        type="button"
      >
        <span className="mobileNavToggleText">{isOpen ? "Cerrar" : "Menu"}</span>
        <span className="mobileNavHamburger" aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
      </button>

      {isOpen ? <button aria-label="Close menu overlay" className="mobileNavBackdrop" onClick={closeMenu} type="button" /> : null}

      {isOpen ? (
        <nav aria-label={ariaLabel} className="mobileNavPanel">
          <div className="mobileNavLocaleWrap">
            <LocaleSwitcher currentLocale={currentLocale} />
          </div>

          {links.map((link) => (
            <a className="mobileNavLink" href={link.href} key={link.href} onClick={closeMenu}>
              {link.label}
            </a>
          ))}

          {ctaLabel && ctaHref ? (
            <a className="mobileNavLink mobileNavLinkCta" href={ctaHref} onClick={closeMenu}>
              {ctaLabel}
            </a>
          ) : null}
        </nav>
      ) : null}
    </div>
  );
}
