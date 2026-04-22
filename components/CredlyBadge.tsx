"use client";

type CredlyBadgeProps = {
  badgeId: string;
  title: string;
};

export function CredlyBadge({ badgeId, title }: CredlyBadgeProps) {
  return (
    <article className="credlyBadgeTile" aria-label={title}>
      <div
        className="credlyBadgeEmbed"
        data-iframe-height="270"
        data-iframe-width="150"
        data-share-badge-host="https://www.credly.com"
        data-share-badge-id={badgeId}
      />
    </article>
  );
}
