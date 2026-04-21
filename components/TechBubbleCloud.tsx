import type { CSSProperties, ReactNode } from "react";
import Image from "next/image";

type TechBubbleCloudProps = {
  items: string[];
  className?: string;
  itemClassName?: string;
};

type GenericGlyphName =
  | "ai"
  | "api"
  | "architecture"
  | "browser"
  | "chat"
  | "cloud"
  | "data"
  | "delivery"
  | "layers"
  | "realtime"
  | "services";

type TechIconConfig =
  | {
      kind: "remote";
      src: string;
    }
  | {
      kind: "generic";
      glyph: GenericGlyphName;
    };

function buildTechIconUrl(iconName: string) {
  return `https://icon.icepanel.io/Technology/svg/${encodeURIComponent(iconName)}.svg`;
}

const techIconMap: Record<string, TechIconConfig> = {
  Angular: { kind: "remote", src: buildTechIconUrl("Angular") },
  "Apache Airflow": { kind: "remote", src: buildTechIconUrl("Apache-Airflow") },
  APIs: { kind: "generic", glyph: "api" },
  AWS: { kind: "remote", src: buildTechIconUrl("AWS") },
  "Analytics pipelines": { kind: "generic", glyph: "data" },
  "CI/CD": { kind: "generic", glyph: "delivery" },
  "Clean architecture": { kind: "generic", glyph: "architecture" },
  "Conversational automation": { kind: "generic", glyph: "chat" },
  Docker: { kind: "remote", src: buildTechIconUrl("Docker") },
  ETL: { kind: "generic", glyph: "data" },
  "Express.js": { kind: "remote", src: buildTechIconUrl("Express") },
  GitHub: { kind: "remote", src: buildTechIconUrl("GitHub") },
  GitLab: { kind: "remote", src: buildTechIconUrl("GitLab") },
  Microservices: { kind: "generic", glyph: "services" },
  MongoDB: { kind: "remote", src: buildTechIconUrl("MongoDB") },
  MariaDB: { kind: "generic", glyph: "data" },
  MySQL: { kind: "remote", src: buildTechIconUrl("MySQL") },
  "Nest.js": { kind: "remote", src: buildTechIconUrl("Nest.js") },
  "Next.js": { kind: "remote", src: buildTechIconUrl("Next.js") },
  "Node.js": { kind: "remote", src: buildTechIconUrl("Node.js") },
  "OpenAI API": { kind: "generic", glyph: "ai" },
  Python: { kind: "remote", src: buildTechIconUrl("Python") },
  "React.js": { kind: "remote", src: buildTechIconUrl("React") },
  Redux: { kind: "remote", src: buildTechIconUrl("Redux") },
  "SSR / SSG": { kind: "generic", glyph: "browser" },
  "Tailwind CSS": { kind: "remote", src: buildTechIconUrl("Tailwind-CSS") },
  TypeScript: { kind: "remote", src: buildTechIconUrl("TypeScript") },
  WebSockets: { kind: "generic", glyph: "realtime" },
  Zustand: { kind: "generic", glyph: "layers" },
};

function renderGenericGlyph(glyph: GenericGlyphName): ReactNode {
  switch (glyph) {
    case "ai":
      return (
        <path
          d="M12 2.75l1.52 3.5 3.73.34-2.82 2.43.85 3.61L12 10.9 8.72 12.63l.85-3.61-2.82-2.43 3.73-.34L12 2.75Zm0 11.25a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm0 2.25a1.75 1.75 0 1 1 0 3.5 1.75 1.75 0 0 1 0-3.5Z"
          fill="currentColor"
        />
      );
    case "api":
      return (
        <>
          <path
            d="M8.5 7.5 4 12l4.5 4.5"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.9"
          />
          <path
            d="M15.5 7.5 20 12l-4.5 4.5"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.9"
          />
          <path
            d="M13.5 5.5 10.5 18.5"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="1.9"
          />
        </>
      );
    case "architecture":
      return (
        <>
          <rect x="4" y="5" width="16" height="4" rx="1.2" fill="currentColor" />
          <rect x="6" y="11" width="12" height="4" rx="1.2" fill="currentColor" opacity="0.75" />
          <rect x="8" y="17" width="8" height="3" rx="1.2" fill="currentColor" opacity="0.5" />
        </>
      );
    case "browser":
      return (
        <>
          <rect
            x="3.5"
            y="5"
            width="17"
            height="14"
            rx="2"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
          />
          <path d="M3.5 9h17" fill="none" stroke="currentColor" strokeWidth="1.8" />
          <circle cx="7" cy="7" r="1" fill="currentColor" />
          <circle cx="10" cy="7" r="1" fill="currentColor" opacity="0.72" />
        </>
      );
    case "chat":
      return (
        <>
          <path
            d="M6 6.5h12a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H10l-4 3v-3H6a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2Z"
            fill="none"
            stroke="currentColor"
            strokeLinejoin="round"
            strokeWidth="1.8"
          />
          <circle cx="9" cy="11.5" r="1" fill="currentColor" />
          <circle cx="12" cy="11.5" r="1" fill="currentColor" />
          <circle cx="15" cy="11.5" r="1" fill="currentColor" />
        </>
      );
    case "cloud":
      return (
        <path
          d="M8.5 18.5h8a3.5 3.5 0 0 0 .6-6.95 4.75 4.75 0 0 0-9.1-1.15A3.25 3.25 0 0 0 8.5 18.5Z"
          fill="currentColor"
        />
      );
    case "data":
      return (
        <>
          <ellipse cx="12" cy="6.75" rx="5.75" ry="2.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
          <path
            d="M6.25 6.75v5.25c0 1.38 2.57 2.5 5.75 2.5s5.75-1.12 5.75-2.5V6.75"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
          />
          <path
            d="M6.25 12v5.25c0 1.38 2.57 2.5 5.75 2.5s5.75-1.12 5.75-2.5V12"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
          />
        </>
      );
    case "delivery":
      return (
        <>
          <path d="M5 7h14" fill="none" stroke="currentColor" strokeWidth="1.8" />
          <path d="M5 12h9" fill="none" stroke="currentColor" strokeWidth="1.8" />
          <path d="M5 17h14" fill="none" stroke="currentColor" strokeWidth="1.8" />
          <path
            d="m14 9 3 3-3 3"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.8"
          />
        </>
      );
    case "layers":
      return (
        <>
          <path d="m12 4 8 4-8 4-8-4 8-4Z" fill="currentColor" />
          <path
            d="m4 12 8 4 8-4"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.8"
          />
          <path
            d="m4 16 8 4 8-4"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.8"
          />
        </>
      );
    case "realtime":
      return (
        <>
          <path d="M4 12a8 8 0 0 1 16 0" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
          <path
            d="M7.5 12a4.5 4.5 0 0 1 9 0"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="1.8"
          />
          <circle cx="12" cy="12" r="1.6" fill="currentColor" />
        </>
      );
    case "services":
      return (
        <>
          <rect x="4" y="6" width="6" height="5" rx="1.2" fill="currentColor" />
          <rect x="14" y="6" width="6" height="5" rx="1.2" fill="currentColor" opacity="0.75" />
          <rect x="9" y="14" width="6" height="5" rx="1.2" fill="currentColor" opacity="0.5" />
          <path d="M10 8.5h4M12 11v3" fill="none" stroke="#fff" strokeLinecap="round" strokeWidth="1.6" />
        </>
      );
  }
}

function TechIcon({ item }: { item: string }) {
  const config = techIconMap[item];

  if (!config) {
    return <span className="techBubbleFallbackText">{item.slice(0, 2).toUpperCase()}</span>;
  }

  if (config.kind === "remote") {
    return (
      <div aria-hidden="true" className="techBubbleIcon techBubbleIconImage">
        <Image alt="" fill sizes="64px" src={config.src} unoptimized />
      </div>
    );
  }

  return (
    <svg
      aria-hidden="true"
      className="techBubbleIcon techBubbleIconGeneric"
      fill="none"
      viewBox="0 0 24 24"
    >
      {renderGenericGlyph(config.glyph)}
    </svg>
  );
}

function joinClassNames(...classNames: Array<string | undefined>) {
  return classNames.filter(Boolean).join(" ");
}

export function TechBubbleCloud({ items, className, itemClassName }: TechBubbleCloudProps) {
  return (
    <div className={joinClassNames("techBubbleCloud", className)} role="list">
      {items.map((item, index) => {
        const bubbleStyle = {
          "--bubble-index": index,
        } as CSSProperties;

        return (
          <span
            aria-label={item}
            className={joinClassNames("techBubble", itemClassName)}
            key={item}
            role="listitem"
            style={bubbleStyle}
            title={item}
          >
            <TechIcon item={item} />
            <span className="srOnly">{item}</span>
          </span>
        );
      })}
    </div>
  );
}
