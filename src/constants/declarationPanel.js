/**
 * Text for the Declarations step's checkbox panel, keyed by catalog field
 * key. Entry order is the order the panel renders in. A declaration-type
 * field with no entry here keeps the plain checkbox rendering.
 *
 * agreeTerms deliberately covers the accuracy, background/reference-check,
 * eligibility and fitness declarations (Terms section 5) — there are no
 * separate tick-boxes. LAWYER REVIEW NEEDED: bundling background/reference
 * check consent into one general agreement may be weaker consent under the
 * NDPA 2023 / GAID. See docs/legal-pages-content.md.
 */
export const DECLARATION_PANEL = {
  agreeTerms: {
    title: 'Terms & Conditions',
    explanation:
      'The rules for applying through 3DEES. By ticking, you also confirm your information is true, consent to background and reference checks, and declare you are eligible and fit for the role.',
    href: '/terms#declarations',
  },
  agreePrivacy: {
    title: 'Privacy Policy',
    explanation: 'How we collect, use and share your information, including with the employer.',
    href: '/privacy',
  },
};

export const DECLARATION_PANEL_ORDER = Object.keys(DECLARATION_PANEL);
