import { motion } from 'motion/react';
import { COMPANY, COMPANY_PLACEHOLDERS } from '../constants/company';
import '../pages/styles/Legal.css';

/**
 * Shared shell for the legal pages: per-page <title>, dark hero with the
 * "Last updated" line, then a narrow reading column of section cards.
 * Fades in without a vertical slide so #anchor scroll targets land exactly.
 */
export function LegalLayout({ title, children }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="legal-page"
    >
      <title>{`${title} | 3DEES`}</title>

      <section className="legal-hero">
        <div className="legal-hero-inner">
          <h1 className="legal-hero-title">{title}</h1>
          <p className="legal-hero-updated">
            Last updated: <CompanyValue k="effectiveDate" />
          </p>
        </div>
      </section>

      <div className="legal-body">
        <article className="legal-column">{children}</article>
      </div>
    </motion.div>
  );
}

export function LegalSection({ id, title, children }) {
  return (
    <section id={id} className="legal-card legal-section">
      {title && <h2 className="legal-section-title">{title}</h2>}
      {children}
    </section>
  );
}

/** A COMPANY value, or its visibly marked [[...]] placeholder while unset. */
export function CompanyValue({ k }) {
  const value = COMPANY[k];
  if (value) return value;
  return <mark className="legal-placeholder">[[{COMPANY_PLACEHOLDERS[k]}]]</mark>;
}

export function CompanyEmail() {
  return (
    <a href={`mailto:${COMPANY.email}`} className="legal-link">{COMPANY.email}</a>
  );
}
