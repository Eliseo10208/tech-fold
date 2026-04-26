import Image from "next/image";
import type { ProjectMediaKind } from "@/types/portfolio";

type WorkMediaFrameProps = {
  mediaAlt?: string;
  mediaBackground?: string;
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
  mediaBackground,
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
  const chromeCtaLabel =
    mediaKind === "website" && mediaSrc ? `${chromeLabel} · Abrir` : chromeLabel;
  const isLogoMedia = mediaKind === "image" && /logo/i.test(`${mediaLabel} ${mediaTitle}`);
  const hasWebsiteBackground = mediaKind === "website" && Boolean(mediaBackground);

  return (
    <div className="showcase-mediaPanel" data-media-kind={mediaKind}>
      <div className="showcase-windowBar">
        <div className="showcase-windowControls" aria-hidden="true">
          <span className="showcase-windowDot" />
          <span className="showcase-windowDot" />
          <span className="showcase-windowDot" />
        </div>

        {mediaKind === "website" && mediaSrc ? (
          <a
            aria-label={`Abrir ${chromeLabel}`}
            className="showcase-windowAddress showcase-windowAddressLink"
            href={mediaSrc}
            rel="noreferrer"
            target="_blank"
          >
            <span className="showcase-windowAddressText">{chromeCtaLabel}</span>
          </a>
        ) : (
          <div className="showcase-windowAddress">
            <span className="showcase-windowAddressText">{chromeLabel}</span>
          </div>
        )}
      </div>

      <div className="showcase-screen">
        <div className={isLogoMedia ? "showcase-mediaAssetWrap showcase-mediaAssetWrapLogo" : "showcase-mediaAssetWrap"}>
          {mediaSrc ? (
            mediaKind === "image" ? (
              <Image
                alt={mediaAlt ?? mediaTitle}
                className={isLogoMedia ? "showcase-mediaAsset showcase-mediaAssetLogo" : "showcase-mediaAsset"}
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
                {mediaBackground ? (
                  <Image
                    alt=""
                    aria-hidden="true"
                    className="showcase-siteBackground"
                    fill
                    priority={priority}
                    sizes="(max-width: 960px) 100vw, 50vw"
                    src={mediaBackground}
                  />
                ) : null}
                {hasWebsiteBackground ? (
                  <div className="showcase-siteOverlay">
                    <span className="showcase-siteDomain">{mediaHostname || mediaTitle}</span>
                  </div>
                ) : (
                  <div className="showcase-siteCanvas">
                    <span className="showcase-siteEyebrow">{mediaLabel}</span>
                    <h4 className="showcase-siteTitle">{mediaHostname || mediaTitle}</h4>
                    <p className="showcase-siteUrl">{mediaSrc}</p>
                  </div>
                )}
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
