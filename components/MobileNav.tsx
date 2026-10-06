"use client";
import { useEffect, useId, useRef, useState } from "react";
type Props = { currentLocale: string; ariaLabel: string; links: Array<{ href: string; label: string }> };
export function MobileNav({ currentLocale, ariaLabel, links }: Props) {
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const button = useRef<HTMLButtonElement>(null);
  const wrapper = useRef<HTMLDivElement>(null);
  const close = currentLocale === "es" ? "Cerrar menú" : "Close menu";
  useEffect(() => {
    if (!open) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") { setOpen(false); button.current?.focus(); }
    }
    function onPointer(event: PointerEvent) {
      if (!wrapper.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => { document.removeEventListener("keydown", onKey); document.removeEventListener("pointerdown", onPointer); };
  }, [open]);
  return (
    <div className="mobileNav" ref={wrapper} onBlur={event => {
      if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
    }}>
      <button className="mobileNavToggle" ref={button} aria-label={open ? close : ariaLabel} aria-expanded={open} aria-controls={menuId} onClick={() => setOpen(!open)} type="button">
        <span aria-hidden="true">{open ? "×" : "☰"}</span>
      </button>
      <nav id={menuId} hidden={!open} className="mobileNavPanel" aria-label={ariaLabel}>
        {links.map(link => <a key={link.href} href={link.href} onClick={() => setOpen(false)}>{link.label}</a>)}
      </nav>
    </div>
  );
}
