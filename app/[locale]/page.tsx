import { setRequestLocale } from "next-intl/server";
import Image from "next/image";
import { SiteHeader } from "@/components/SiteHeader";
import { ProjectCard } from "@/components/ProjectCard";
import { CALENDAR, CV_URL, EMAIL, getContent, pageMetadata, SITE_URL, SOCIAL } from "@/lib/portfolio";

type Props = { params: Promise<{ locale: string }> };
export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const { Metadata } = getContent(locale);
  return pageMetadata(locale, Metadata.title, Metadata.description);
}
export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  const { Site: copy, Projects: projects } = getContent(locale);
  setRequestLocale(locale);
  const work = projects.filter(project => project.kind === "work" && project.slug !== "voting");
  const demos = projects.filter(project => project.kind === "demo");
  const profile = {
    "@context": "https://schema.org", "@type": "ProfilePage",
    url: `${SITE_URL}/${locale}`, inLanguage: locale,
    mainEntity: {
      "@type": "Person", "@id": `${SITE_URL}/#person`,
      name: copy.name, jobTitle: copy.role, url: SITE_URL,
      sameAs: [SOCIAL.github, SOCIAL.linkedin],
      homeLocation: { "@type": "Place", name: "Tuxtla Gutiérrez, Chiapas, México" },
      knowsAbout: ["TypeScript", "React", "Next.js", "Node.js", "Python", "PostgreSQL", "AI integrations"],
    },
  };
  return (
    <>
      <a href="#content" className="skip-link">{copy.skip}</a>
      <SiteHeader locale={locale} copy={copy} />
      <main id="content" className="site-shell" tabIndex={-1}>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(profile).replace(/</g, "\\u003c") }} />
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-main">
            <p className="hero-greeting">{copy.hero.greeting}</p>
            <h1 id="hero-title">{copy.hero.title}<span>{copy.hero.accent}</span></h1>
            <p className="hero-role">{copy.hero.role}</p>
            <p className="hero-description">{copy.hero.description}</p>
            <div className="hero-actions">
              <a className="button button-primary" href="#demos">{copy.hero.projects}<span aria-hidden="true">↓</span></a>
              <a className="button button-secondary" href={CV_URL} download>{copy.hero.cv}<span aria-hidden="true">↓</span></a>
            </div>
            <p className="hero-location">{copy.hero.location}</p>
            <div className="hero-social">
              <a href={SOCIAL.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn ↗</a>
              <a href={SOCIAL.github} target="_blank" rel="noopener noreferrer">GitHub ↗</a>
              <span>{copy.hero.cvLanguage}</span>
            </div>
          </div>
          <div className="hero-illustration" aria-hidden="true">
            <span className="illustration-heading">{copy.hero.sketchLabel}</span>
            <Image src="/decor/whale-shark.png" width={380} height={380} sizes="(min-width: 700px) 330px, 120px" alt="" className="whale-sketch" />
            <span className="illustration-caption">Rodrigo E. G. / {copy.hero.sketchCaption}</span>
          </div>
          <aside className="recent-work" aria-label={copy.hero.proof}>
            <div><span className="eyebrow">{copy.hero.proof}</span><p>{copy.hero.proofTitle}</p></div>
            <span className="recent-period">{copy.hero.proofPeriod}</span>
            <a className="text-link" href={`/${locale}/projects/handbook`}>{copy.hero.proofLink} ↗</a>
          </aside>
        </section>

        <section id="selected-work" className="section-block" aria-labelledby="work-title">
          <div className="section-heading"><span className="eyebrow">{copy.work.eyebrow}</span><h2 id="work-title">{copy.work.title}</h2><p>{copy.work.description}</p></div>
          <div className="work-grid">{work.map((project, index) => <ProjectCard key={project.slug} project={project} locale={locale} copy={copy} featured={index === 0} />)}</div>
          <details className="more-experience">
            <summary>{copy.work.other}<span aria-hidden="true">+</span></summary>
            <div className="other-grid">
              <article><h3><a href={`/${locale}/projects/voting`}>{copy.work.voting} →</a></h3><p>{copy.work.votingNote}</p></article>
              <article><h3>{copy.work.freelance}</h3><p>{copy.work.freelanceNote}</p></article>
            </div>
          </details>
        </section>

        <section id="demos" className="section-block" aria-labelledby="demos-title">
          <div className="section-heading"><span className="eyebrow">{copy.demos.eyebrow}</span><h2 id="demos-title">{copy.demos.title}</h2><p>{copy.demos.description}</p></div>
          <div className="demo-grid">{demos.map(project => <ProjectCard key={project.slug} project={project} locale={locale} copy={copy} />)}</div>
        </section>

        <section id="stack" className="section-block" aria-labelledby="stack-title">
          <div className="section-heading"><span className="eyebrow">{copy.stack.eyebrow}</span><h2 id="stack-title">{copy.stack.title}</h2></div>
          <div className="stack-grid">
            <div><h3>{copy.stack.core}</h3><ul className="stack-list">{copy.stack.coreItems.map(item => <li key={item}>{item}</li>)}</ul></div>
            <div><h3>{copy.stack.extra}</h3><ul className="tags tags-large">{copy.stack.extraItems.map(item => <li key={item}>{item}</li>)}</ul></div>
          </div>
          <p className="section-note">{copy.stack.note}</p>
        </section>

        <section id="about" className="section-block about-section" aria-labelledby="about-title">
          <div className="section-heading"><span className="eyebrow">{copy.about.eyebrow}</span><h2 id="about-title">{copy.about.title}</h2><p>{copy.about.description}</p></div>
          <div className="about-facts">
            <article><h3>{copy.about.education}</h3><p>{copy.about.school}</p><span>{copy.about.degree}</span></article>
            <article><h3>{copy.about.languages}</h3><p>{copy.about.languageText}</p><span>{copy.about.languageNote}</span></article>
            <article><h3>{copy.about.training}</h3><p>{copy.about.trainingText}</p><a className="text-link" href="https://www.credly.com/badges/3431ddd3-2f89-4c29-8da1-b87aecab4f91" target="_blank" rel="noopener noreferrer">{copy.about.badges} ↗</a></article>
          </div>
        </section>

        <section id="contact" className="contact-section" aria-labelledby="contact-title">
          <Image src="/icons/cat-peek.png" alt="" aria-hidden="true" width={58} height={43} className="contact-cat" />
          <span className="eyebrow">{copy.contact.eyebrow}</span><h2 id="contact-title">{copy.contact.title}</h2><p>{copy.contact.description}</p>
          <div className="contact-actions"><a className="button button-light" href={EMAIL}>{copy.contact.email} ↗</a><a className="button button-outline-light" href={CALENDAR} target="_blank" rel="noopener noreferrer">{copy.contact.calendar} ↗</a></div>
          <p className="contact-availability">{copy.contact.availability}</p>
        </section>
      </main>
      <footer className="site-shell site-footer"><p>{copy.name}</p><span>{copy.contact.footer}</span></footer>
      <nav className="mobile-contact-bar" aria-label={copy.contact.stickyLabel}><a href={CV_URL} download>{copy.hero.cv} ↓</a><a href={EMAIL}>{copy.contact.email} ↗</a></nav>
    </>
  );
}
