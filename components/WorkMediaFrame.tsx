import Image from "next/image";
import type { ProjectMediaKind } from "@/types/portfolio";

type WorkMediaFrameProps = {
  mediaAlt?: string;
  mediaCtaLabel?: string;
  mediaKind: ProjectMediaKind;
  mediaLabel: string;
  mediaPoster?: string;
  mediaSrc?: string;
  mediaTitle: string;
  mediaNote: string;
  priority?: boolean;
};

export function WorkMediaFrame({
  mediaAlt,
  mediaCtaLabel,
  mediaKind,
  mediaLabel,
  mediaPoster,
  mediaSrc,
  mediaTitle,
  mediaNote,
  priority = false,
}: WorkMediaFrameProps) {
  let mediaHostname = "";

  if (mediaKind === "website" && mediaSrc) {
    try {
      mediaHostname = new URL(mediaSrc).hostname.replace(/^www\./, "");
    } catch {
      mediaHostname = mediaSrc;
    }
  }

  const chromeLabel =
    mediaKind === "website" && mediaHostname.length > 0 ? mediaHostname : mediaTitle;

  return (
    <div className="showcase-mediaPanel" data-media-kind={mediaKind}>
      <div className="showcase-windowBar">
        <div className="showcase-windowControls" aria-hidden="true">
          <span className="showcase-windowDot" />
          <span className="showcase-windowDot" />
          <span className="showcase-windowDot" />
        </div>

        <div className="showcase-windowAddress">
          <span className="showcase-windowAddressText">{chromeLabel}</span>
        </div>
      </div>

      <div className="showcase-screen">
        <div className="showcase-mediaAssetWrap">
          {mediaSrc ? (
            mediaKind === "image" ? (
              <Image
                alt={mediaAlt ?? mediaTitle}
                className="showcase-mediaAsset"
                fill
                priority={priority}
                sizes="(max-width: 960px) 100vw, 50vw"
                src={mediaSrc}
              />
            ) : mediaKind === "video" ? (
              <video
                className="showcase-mediaAsset"
                controls
                playsInline
                poster={mediaPoster}
                preload="metadata"
              >
                <source src={mediaSrc} />
              </video>
            ) : (
              <div className="showcase-sitePreview">
                <div className="showcase-siteCanvas">
                  <span className="showcase-siteEyebrow">{mediaLabel}</span>
                  <h4 className="showcase-siteTitle">{mediaHostname || mediaTitle}</h4>
                  <p className="showcase-siteUrl">{mediaSrc}</p>
                  <a
                    className="showcase-siteButton"
                    href={mediaSrc}
                    rel="noreferrer"
                    target="_blank"
                  >
                    {mediaCtaLabel ?? "Visit site"}
                  </a>
                </div>
              </div>
            )
          ) : (
            <div className="showcase-mediaPreview" aria-hidden="true">
              <div className="showcase-previewLead" />
              <div className="showcase-previewRow">
                <span />
                <span />
                <span />
              </div>
              <div className="showcase-previewGrid">
                <span />
                <span />
                <span />
                <span />
              </div>
            </div>
          )}
        </div>

        <div className="showcase-mediaCaption">
          <span className="showcase-mediaBadge">{mediaLabel}</span>
          <h3 className="showcase-mediaTitle">{mediaTitle}</h3>
          <p className="showcase-mediaNote">{mediaNote}</p>
        </div>
      </div>
    </div>
  );
}
