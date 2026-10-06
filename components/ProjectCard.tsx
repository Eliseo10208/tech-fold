import Image from "next/image";
import { type PortfolioProject, type SiteCopy } from "@/lib/portfolio";

export function ProjectPreview({ project, locale, sizes = "(min-width: 1144px) 340px, (min-width: 1000px) 30vw, (min-width: 700px) 48vw, 100vw" }: { project: PortfolioProject; locale: string; sizes?: string }) {
  if (project.image) return (
    <div className={`project-preview preview-${project.slug}`}>
      <Image src={project.image} alt={project.imageAlt} fill sizes={sizes} />
    </div>
  );
  const rag = project.slug === "nom-rag";
  return (
    <div className={`project-preview technical-preview ${rag ? "preview-rag" : "preview-workers"}`}>
      <span className="preview-label">{locale === "es" ? "Esquema técnico" : "Technical outline"}</span>
      <div className="flow-outline">
        {(rag ? ["Query", "Retrieval", "Citations"] : ["Main thread", "Workers", "postMessage"]).map((node, index) => (
          <span key={node} className="flow-node"><small>0{index + 1}</small>{node}</span>
        ))}
      </div>
      <span className="preview-caption">{rag ? "FastAPI + ChromaDB" : "Phaser + JavaScript"}</span>
    </div>
  );
}
export function ProjectCard({ project, locale, copy, featured = false }: { project: PortfolioProject; locale: string; copy: SiteCopy; featured?: boolean }) {
  const href = `/${locale}/projects/${project.slug}`;
  const demo = project.kind === "demo";
  return (
    <article className={`project-card ${featured ? "project-featured" : ""}`}>
      <a href={href} className="preview-link">
        <span className="sr-only">{copy.project.case}: {project.name}. </span>
        <ProjectPreview project={project} locale={locale} sizes={demo ? undefined : "(min-width: 1000px) 360px, (min-width: 700px) 35vw, 100vw"} />
      </a>
      <div className="project-card-body">
        <p className="project-kicker">{project.name}<span>{demo ? copy.project.note : project.period}</span></p>
        <h3><a href={href}>{project.title}</a></h3>
        <p className="project-summary">{project.summary}</p>
        <ul className="tags" aria-label={copy.project.stack}>{project.tags.slice(0, 4).map(tag => <li key={tag}>{tag}</li>)}</ul>
        {project.slug === "pou-v2" && <p className="project-caveat">{copy.project.keyboard}</p>}
        <div className="project-actions">
          {demo && <a className="button button-primary button-small" href={project.url} target="_blank" rel="noopener noreferrer">{copy.project.demo}<span aria-hidden="true">↗</span></a>}
          <a className="text-link" href={href}>{demo ? copy.project.details : copy.project.case}<span aria-hidden="true">→</span></a>
          {demo && <a className="text-link code-link" href={project.code} target="_blank" rel="noopener noreferrer">{copy.project.code}<span aria-hidden="true">↗</span></a>}
        </div>
      </div>
    </article>
  );
}
