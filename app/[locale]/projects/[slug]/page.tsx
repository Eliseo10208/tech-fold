import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { SiteHeader } from "@/components/SiteHeader";
import { ProjectPreview } from "@/components/ProjectCard";
import { CV_URL, EMAIL, getContent, pageMetadata } from "@/lib/portfolio";

type Props = { params: Promise<{ locale: string; slug: string }> };
export function generateStaticParams() {
  return getContent("es").Projects.map(project => ({ slug: project.slug }));
}
export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params;
  const project = getContent(locale).Projects.find(item => item.slug === slug);
  if (!project) notFound();
  return pageMetadata(locale, `${project.name} | Rodrigo Eliseo García`, project.summary, `/projects/${slug}`);
}
export default async function ProjectPage({ params }: Props) {
  const { locale, slug } = await params;
  const { Site: copy, Projects: projects } = getContent(locale);
  const project = projects.find(item => item.slug === slug);
  if (!project) notFound();
  setRequestLocale(locale);
  const next = projects[(projects.indexOf(project) + 1) % projects.length];
  return (
    <>
      <a className="skip-link" href="#content">{copy.skip}</a>
      <SiteHeader locale={locale} copy={copy} path={`/projects/${slug}`} />
      <main className="site-shell case-page" id="content" tabIndex={-1}>
        <a className="text-link case-back" href={`/${locale}#${project.kind === "demo" ? "demos" : "selected-work"}`}>← {copy.project.back}</a>
        <header className="case-header">
          <p className="eyebrow">{project.company}</p><h1>{project.title}</h1><p className="case-summary">{project.summary}</p>
          <p className="case-role">{project.role} <span>· {project.period}</span></p>
          <ul className="tags tags-large">{project.tags.map(tag => <li key={tag}>{tag}</li>)}</ul>
          <div className="project-actions">
            {project.url && <a className="button button-primary" href={project.url} target="_blank" rel="noopener noreferrer">{project.kind === "demo" ? copy.project.demo : copy.project.company} ↗</a>}
            {project.code && <a className="button button-secondary" href={project.code} target="_blank" rel="noopener noreferrer">{copy.project.code} ↗</a>}
          </div>
          {slug === "pou-v2" && <p className="project-caveat">{copy.project.keyboard}</p>}
        </header>
        <div className="case-preview"><ProjectPreview project={project} locale={locale} sizes="(min-width: 964px) 900px, 100vw" /></div>
        <div className="case-sections">
          <section><span className="case-number" aria-hidden="true">01</span><div><h2>{copy.project.problem}</h2><p>{project.problem}</p></div></section>
          <section><span className="case-number" aria-hidden="true">02</span><div><h2>{copy.project.contribution}</h2><p>{project.contribution}</p></div></section>
          <section><span className="case-number" aria-hidden="true">03</span><div><h2>{copy.project.implementation}</h2><ul>{project.implementation.map(item => <li key={item}>{item}</li>)}</ul></div></section>
          <section className="case-limits"><span className="case-number" aria-hidden="true">04</span><div><h2>{copy.project.limits}</h2><p>{project.limits}</p></div></section>
        </div>
        <div className="case-next"><span>{copy.project.more}</span><a href={`/${locale}/projects/${next.slug}`}>{next.name} →</a></div>
      </main>
      <footer className="site-shell site-footer"><a href={`/${locale}#contact`}>{copy.contact.email} →</a><span>{copy.name}</span></footer>
      <nav className="mobile-contact-bar" aria-label={copy.contact.stickyLabel}><a href={CV_URL} download>{copy.hero.cv} ↓</a><a href={EMAIL}>{copy.contact.email} ↗</a></nav>
    </>
  );
}
