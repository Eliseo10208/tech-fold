"use client";

import type { ProjectItem } from "@/types/portfolio";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { WorkMediaFrame } from "./WorkMediaFrame";

type ProjectExplorerProps = {
  projectItems: ProjectItem[];
};

export function ProjectExplorer({ projectItems }: ProjectExplorerProps) {
  const t = useTranslations("HomePage.work");
  const [activeProjectIndex, setActiveProjectIndex] = useState(0);
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);

  if (projectItems.length === 0) {
    return null;
  }

  const activeProject = projectItems[activeProjectIndex] ?? projectItems[0];
  const projectTags = Array.isArray(activeProject.tags) ? activeProject.tags : [];
  const projectDetails = Array.isArray(activeProject.detailItems)
    ? activeProject.detailItems
    : [];
  const projectHighlights = Array.isArray(activeProject.highlights)
    ? activeProject.highlights
    : [];
  const projectMedia = Array.isArray(activeProject.media)
    ? activeProject.media.filter((mediaItem) => {
        if (!mediaItem.src || mediaItem.src.trim().length === 0) {
          return false;
        }

        return true;
      })
    : [];
  const activeProjectMedia =
    projectMedia.length > 0
      ? projectMedia
      : [
          {
            kind: "image" as const,
            label: t("projectLabel"),
            note: activeProject.summary,
            title: activeProject.title,
          },
        ];
  const activeMedia = activeProjectMedia[activeMediaIndex] ?? activeProjectMedia[0];

  function selectProject(nextProjectIndex: number) {
    setActiveProjectIndex(nextProjectIndex);
    setActiveMediaIndex(0);
  }

  function goToAdjacentProject(direction: "previous" | "next") {
    const lastProjectIndex = projectItems.length - 1;
    const nextProjectIndex =
      direction === "next"
        ? activeProjectIndex === lastProjectIndex
          ? 0
          : activeProjectIndex + 1
        : activeProjectIndex === 0
          ? lastProjectIndex
          : activeProjectIndex - 1;

    selectProject(nextProjectIndex);
  }

  const projectIconBySlug: Record<string, { src: string; alt: string }> = {
    handbook: { src: "/icons/handbook-icon.png", alt: "Logo Handbook" },
    nanti: { src: "/icons/nanti-icon.png", alt: "Logo Nanti System" },
    agora: { src: "/icons/agora-icon.png", alt: "Logo Agora Partnerships" },
    voting: { src: "/icons/voting-icon.svg", alt: "Icono de seguridad de votacion" },
  };

  const projectTabs = projectItems.map((projectItem, projectIndex) => {
    const isActive = projectIndex === activeProjectIndex;
    const icon = projectIconBySlug[projectItem.slug];

    return (
      <button
        aria-controls={`project-panel-${projectItem.slug}`}
        aria-selected={isActive}
        className={
          isActive ? "projectTabButton projectTabButtonActive" : "projectTabButton"
        }
        id={`project-tab-${projectItem.slug}`}
        key={projectItem.slug}
        onClick={() => selectProject(projectIndex)}
        role="tab"
        tabIndex={isActive ? 0 : -1}
        type="button"
      >
        <span className="projectTabHeader">
          {icon ? (
            <span className="projectTabIconWrap" aria-hidden="true">
              <Image
                alt={icon.alt}
                className="projectTabIcon"
                fill
                sizes="40px"
                src={icon.src}
              />
            </span>
          ) : null}
          <span className="projectTabLabel">{projectItem.navLabel}</span>
        </span>
        <span className="projectTabHint">{projectItem.navHint}</span>
      </button>
    );
  });

  const projectTagItems = projectTags.map((tag) => (
    <span className="tag" key={`${activeProject.slug}-${tag}`}>
      {tag}
    </span>
  ));

  const projectMetaItems = [
    { label: t("meta.role"), value: activeProject.role },
    { label: t("meta.company"), value: activeProject.company },
    { label: t("meta.period"), value: activeProject.period },
  ].map((metaItem) => (
    <div className="projectMetaCard" key={metaItem.label}>
      <span className="metric-label">{metaItem.label}</span>
      <p className="projectMetaValue">{metaItem.value}</p>
    </div>
  ));

  const projectMediaItems = activeProjectMedia.map((mediaItem, mediaIndex) => {
    const isActive = mediaIndex === activeMediaIndex;

    return (
      <button
        className={
          isActive ? "projectMediaThumb projectMediaThumbActive" : "projectMediaThumb"
        }
        key={`${activeProject.slug}-${mediaItem.title}`}
        onClick={() => setActiveMediaIndex(mediaIndex)}
        type="button"
      >
        <span className="projectMediaThumbType">{mediaItem.kind}</span>
        <span className="projectMediaThumbTitle">{mediaItem.title}</span>
        <span className="projectMediaThumbNote">{mediaItem.label}</span>
      </button>
    );
  });

  const projectDetailItems = projectDetails.map((detailItem) => (
    <article className="projectDetailCard" key={detailItem.label}>
      <span className="metric-label">{detailItem.label}</span>
      <p className="projectDetailValue">{detailItem.value}</p>
    </article>
  ));

  const projectHighlightItems = projectHighlights.map((highlightItem) => (
    <li key={highlightItem}>{highlightItem}</li>
  ));
  return (
    <section className="projectExplorer">
      <div
        aria-label={t("navigatorLabel")}
        className="projectTabRail"
        role="tablist"
      >
        {projectTabs}
      </div>

      <article
        aria-labelledby={`project-tab-${activeProject.slug}`}
        className="projectStage"
        id={`project-panel-${activeProject.slug}`}
        role="tabpanel"
      >
        <div className="projectBoardCard projectBoardMediaCard">
          <WorkMediaFrame
            mediaAlt={activeMedia.alt}
            mediaBackground={activeMedia.background}
            mediaCtaLabel={activeMedia.ctaLabel}
            mediaKind={activeMedia.kind}
            mediaLabel={activeMedia.label}
            mediaNote={activeMedia.note}
            mediaPoster={activeMedia.poster}
            mediaSrc={activeMedia.src}
            mediaTitle={activeMedia.title}
            priority
          />
        </div>

        <article className="projectBoardCard projectBoardIntroCard">
          <div className="projectStageHeader">
            <span className="project-index">{t("projectLabel")}</span>
            <h3 className="projectStageTitle">{activeProject.title}</h3>
            <p className="projectStageSummary">{activeProject.summary}</p>

            <div className="tag-row">{projectTagItems}</div>
          </div>
        </article>

        <section className="projectBoardCard projectBoardMetaCard">
          <div className="projectMetaGrid">{projectMetaItems}</div>
        </section>

        <section className="projectBoardCard projectBoardDetailsCard projectHighlightsBlock">
          <div aria-label={t("mediaRailLabel")} className="projectMediaRail">
            {projectMediaItems}
          </div>
          <div className="projectDetailGrid">{projectDetailItems}</div>
          <span className="metric-label">{t("highlightsLabel")}</span>
          <ul className="projectHighlightList">{projectHighlightItems}</ul>
        </section>

        <nav className="projectBoardCard projectBoardFooterCard">
          <div className="projectFooterNav">
            <button
              className="projectFooterButton"
              onClick={() => goToAdjacentProject("previous")}
              type="button"
            >
              {t("previousProject")}
            </button>
            <button
              className="projectFooterButton projectFooterButtonPrimary"
              onClick={() => goToAdjacentProject("next")}
              type="button"
            >
              {t("nextProject")}
            </button>
          </div>
        </nav>
      </article>
    </section>
  );
}
