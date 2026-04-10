import { LocaleSwitcher } from "@/components/LocaleSwitcher";
import { ProjectExplorer } from "@/components/ProjectExplorer";
import type { ProjectItem } from "@/types/portfolio";
import { getTranslations, setRequestLocale } from "next-intl/server";

type CredibilityItem = {
  label: string;
  value: string;
};

type MetricItem = {
  label: string;
  title: string;
  description: string;
};

type InfoItem = {
  title: string;
  description: string;
};

type AboutHighlight = {
  eyebrow: string;
  title: string;
  description: string;
  points: string[];
};

type ExperienceItem = {
  company: string;
  role: string;
  period: string;
  location: string;
  summary: string;
};

type ProcessItem = {
  step: string;
  title: string;
  description: string;
};

type StackItem = {
  title: string;
  items: string[];
};

type ContactLink = {
  label: string;
  value: string;
  href: string;
};

type FooterCopy = {
  availability: string;
  note: string;
};

type HomePageProps = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "HomePage" });

  const identity = t.raw("identity") as {
    name: string;
    role: string;
    eyebrow: string;
  };

  const heroBadges = t.raw("hero.badges") as string[];
  const credibilityItems = t.raw("credibility.items") as CredibilityItem[];
  const metricItems = t.raw("metrics.items") as MetricItem[];
  const aboutItems = t.raw("about.items") as InfoItem[];
  const aboutHighlight = t.raw("about.highlight") as AboutHighlight;
  const workItems = t.raw("work.items") as ProjectItem[];
  const experienceItems = t.raw("experience.items") as ExperienceItem[];
  const processItems = t.raw("process.items") as ProcessItem[];
  const stackItems = t.raw("stack.items") as StackItem[];
  const contactLinks = t.raw("contact.links") as ContactLink[];
  const footerCopy = t.raw("footer") as FooterCopy;

  return (
    <main className="site-page">
      <div className="site-shell">
        <header className="site-headerShell">
          <div className="site-header">
            <a className="brand-mark" href="#top">
              {identity.name}
            </a>

            <nav aria-label={t("navigation.ariaLabel")} className="header-nav">
              <a className="header-link" href="#about">
                {t("navigation.about")}
              </a>
              <a className="header-link" href="#selected-work">
                {t("navigation.work")}
              </a>
              <a className="header-link" href="#experience">
                {t("navigation.experience")}
              </a>
              <a className="header-link" href="#stack">
                {t("navigation.stack")}
              </a>
              <a className="header-link" href="#contact">
                {t("navigation.contact")}
              </a>
            </nav>

            <div className="header-actions">
              <LocaleSwitcher currentLocale={locale} />
              <a className="header-cta" href="#contact">
                {t("navigation.cta")}
              </a>
            </div>
          </div>
        </header>

        <section className="site-topStage" id="top">
          <div className="hero-panel">
            <div className="hero-copy">
              <span className="eyebrow">{identity.eyebrow}</span>
              <h1 className="hero-title">{t("hero.title")}</h1>
              <p className="hero-description">{t("hero.description")}</p>

              <div className="hero-actions">
                <a className="primary-button" href="#selected-work">
                  {t("hero.primaryCta")}
                </a>
                <a className="secondary-button" href="#experience">
                  {t("hero.secondaryCta")}
                </a>
              </div>

              <div className="hero-badgeRow">
                {heroBadges.map((badgeItem) => (
                  <span className="hero-badge" key={badgeItem}>
                    {badgeItem}
                  </span>
                ))}
              </div>
            </div>

            <div className="hero-aside">
              <article className="signal-card">
                <span className="eyebrow">{identity.role}</span>
                <h2 className="signal-title">{t("hero.sideTitle")}</h2>
                <p className="signal-copy">{t("hero.sideDescription")}</p>
              </article>

              <div className="hero-miniGrid">
                {aboutHighlight.points.map((pointItem) => (
                  <article className="hero-miniCard" key={`${aboutHighlight.eyebrow}-${pointItem}`}>
                    <span className="metric-label">{aboutHighlight.eyebrow}</span>
                    <p className="hero-miniCopy">{pointItem}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="credibilityStrip" aria-label={t("credibility.ariaLabel")}>
          {credibilityItems.map((item) => (
            <article className="credibilityItem" key={item.label}>
              <span className="credibilityLabel">{item.label}</span>
              <p className="credibilityValue">{item.value}</p>
            </article>
          ))}
        </section>

        <section className="section-block" id="about">
          <div className="section-intro">
            <div>
              <span className="eyebrow">{t("about.eyebrow")}</span>
              <h2 className="section-title">{t("about.title")}</h2>
            </div>

            <p className="section-copy">{t("about.description")}</p>
          </div>

          <div className="aboutBento">
            <article className="aboutHighlightCard">
              <span className="eyebrow">{aboutHighlight.eyebrow}</span>
              <h3 className="aboutHighlightTitle">{aboutHighlight.title}</h3>
              <p className="aboutHighlightDescription">{aboutHighlight.description}</p>

              <ul className="aboutPointList">
                {aboutHighlight.points.map((pointItem) => (
                  <li key={pointItem}>{pointItem}</li>
                ))}
              </ul>
            </article>

            {aboutItems.map((item) => (
              <article className="pillar-card" key={item.title}>
                <h3 className="pillar-title">{item.title}</h3>
                <p className="pillar-copy">{item.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section-block" id="selected-work">
          <div className="section-intro">
            <div>
              <span className="eyebrow">{t("work.eyebrow")}</span>
              <h2 className="section-title">{t("work.title")}</h2>
            </div>

            <p className="section-copy">{t("work.description")}</p>
          </div>

          <ProjectExplorer projectItems={workItems} />
        </section>

        <section className="section-block" id="experience">
          <div className="section-intro">
            <div>
              <span className="eyebrow">{t("experience.eyebrow")}</span>
              <h2 className="section-title">{t("experience.title")}</h2>
            </div>

            <p className="section-copy">{t("experience.description")}</p>
          </div>

          <div className="experience-list">
            {experienceItems.map((item) => (
              <article className="experience-card" key={`${item.company}-${item.role}`}>
                <div className="experience-head">
                  <div>
                    <h3 className="experience-company">{item.company}</h3>
                    <span className="experience-role">{item.role}</span>
                  </div>
                  <span className="project-index">{item.period}</span>
                </div>

                <div className="experience-meta">
                  <span>{item.location}</span>
                </div>

                <p className="experience-summary">{item.summary}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section-block" id="process">
          <div className="section-intro">
            <div>
              <span className="eyebrow">{t("process.eyebrow")}</span>
              <h2 className="section-title">{t("process.title")}</h2>
            </div>

            <p className="section-copy">{t("process.description")}</p>
          </div>

          <div className="processGrid">
            {processItems.map((item) => (
              <article className="processCard" key={item.step}>
                <span className="processStep">{item.step}</span>
                <h3 className="processTitle">{item.title}</h3>
                <p className="processDescription">{item.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section-block" id="outcomes">
          <div className="section-intro">
            <div>
              <span className="eyebrow">{t("outcomes.eyebrow")}</span>
              <h2 className="section-title">{t("outcomes.title")}</h2>
            </div>

            <p className="section-copy">{t("outcomes.description")}</p>
          </div>

          <div className="outcomesGrid">
            {metricItems.map((item) => (
              <article className="metric-card outcomeCard" key={item.title}>
                <span className="metric-label">{item.label}</span>
                <h3 className="metric-title">{item.title}</h3>
                <p className="metric-copy">{item.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section-block" id="stack">
          <div className="section-intro">
            <div>
              <span className="eyebrow">{t("stack.eyebrow")}</span>
              <h2 className="section-title">{t("stack.title")}</h2>
            </div>

            <p className="section-copy">{t("stack.description")}</p>
          </div>

          <div className="stack-grid">
            {stackItems.map((item) => (
              <article className="stack-card" key={item.title}>
                <span className="eyebrow">{t("stack.groupLabel")}</span>
                <h3 className="stack-title">{item.title}</h3>
                <ul className="stack-list">
                  {item.items.map((stackItem) => (
                    <li key={stackItem}>{stackItem}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className="section-block" id="contact">
          <div className="surface-panel surface-panel-light contact-panel">
            <div className="contact-copy">
              <span className="eyebrow">{t("contact.eyebrow")}</span>
              <h2 className="section-title">{t("contact.title")}</h2>
              <p className="section-copy">{t("contact.description")}</p>

              <div className="hero-actions">
                <a className="primary-button" href={t("contact.primaryHref")}>
                  {t("contact.primaryCta")}
                </a>
                <a
                  className="secondary-button"
                  href={t("contact.secondaryHref")}
                  rel="noreferrer"
                  target="_blank"
                >
                  {t("contact.secondaryCta")}
                </a>
              </div>
            </div>

            <div className="contact-list">
              {contactLinks.map((item) => (
                <a
                  className="contact-item contact-link"
                  href={item.href}
                  key={item.label}
                  rel="noreferrer"
                  target="_blank"
                >
                  <span className="contact-key">{item.label}</span>
                  <span className="contact-value">{item.value}</span>
                </a>
              ))}
            </div>
          </div>
        </section>

        <footer className="site-footer">
          <p className="footerTitle">{footerCopy.availability}</p>
          <p className="footerNote">{footerCopy.note}</p>
        </footer>
      </div>
    </main>
  );
}
