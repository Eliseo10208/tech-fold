import Image from "next/image";
import type { ProjectMediaKind } from "@/types/portfolio";

type WorkMediaFrameProps = {
  mediaAlt?: string;
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
  mediaKind,
  mediaLabel,
  mediaPoster,
  mediaSrc,
  mediaTitle,
  mediaNote,
  priority = false,
}: WorkMediaFrameProps) {
  return (
    <div className="showcase-mediaPanel" data-media-kind={mediaKind}>
      <div className="showcase-windowBar" aria-hidden="true">
        <span className="showcase-windowDot" />
        <span className="showcase-windowDot" />
        <span className="showcase-windowDot" />
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
            ) : (
              <video
                className="showcase-mediaAsset"
                controls
                playsInline
                poster={mediaPoster}
                preload="metadata"
              >
                <source src={mediaSrc} />
              </video>
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

          <div className="showcase-mediaOverlay">
            <span className="showcase-mediaBadge">{mediaLabel}</span>
            <h3 className="showcase-mediaTitle">{mediaTitle}</h3>
            <p className="showcase-mediaNote">{mediaNote}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
