"use client";

import { useEffect, useRef, useState } from "react";

type EmbeddedWebsiteFrameProps = {
  height: number;
  responsive?: boolean;
  src: string;
  title: string;
  width: number;
};

export function EmbeddedWebsiteFrame({
  height,
  responsive = false,
  src,
  title,
  width,
}: EmbeddedWebsiteFrameProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const [layout, setLayout] = useState({ left: 0, scale: 1 });

  useEffect(() => {
    const viewport = viewportRef.current;

    if (!viewport || responsive) {
      return;
    }

    const updateScale = () => {
      const nextScale = Math.min(viewport.clientWidth / width, 1);

      setLayout({
        left: Math.max((viewport.clientWidth - width * nextScale) / 2, 0),
        scale: nextScale,
      });
    };

    updateScale();

    const resizeObserver = new ResizeObserver(updateScale);
    resizeObserver.observe(viewport);

    return () => resizeObserver.disconnect();
  }, [width, responsive]);

  if (responsive) {
    return (
      <div
        className="showcase-siteEmbedViewport"
        style={{ height: `min(${height}px, 85svh)`, minHeight: "32rem" }}
      >
        <iframe
          allow="fullscreen"
          className="showcase-siteEmbed"
          loading="eager"
          src={src}
          title={title}
        />
      </div>
    );
  }

  return (
    <div
      className="showcase-siteEmbedViewport"
      ref={viewportRef}
      style={{ height: `${height * layout.scale}px` }}
    >
      <div
        className="showcase-siteEmbedCanvas"
        style={{
          left: `${layout.left}px`,
          transform: `scale(${layout.scale})`,
          height: `${height}px`,
          width: `${width}px`,
        }}
      >
        <iframe
          allow="fullscreen"
          className="showcase-siteEmbed"
          height={height}
          loading="eager"
          src={src}
          title={title}
          width={width}
        />
      </div>
    </div>
  );
}
