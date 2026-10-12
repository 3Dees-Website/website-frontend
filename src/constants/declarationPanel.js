/**
 * Text for the Declarations step's checkbox panel, keyed by catalog field
 * key. Entry order is the order the panel renders in. A declaration-type
 * field with no entry here keeps the plain checkbox rendering.
 */
export const DECLARATION_PANEL = {
  agreeTerms: {
    title: 'Terms & Conditions',
    explanation: 'The rules for using this site and applying for jobs through 3DEES.',
    href: '/terms',
  },
  agreePrivacy: {
    title: 'Privacy Policy',
    explanation: 'How we collect, use and share your information, including with the employer.',
    href: '/privacy',
  },
  declarationAccurate: {
    title: 'Accuracy of information',
    explanation: 'Everything in your application is true, and your documents are genuine.',
    href: '/declaration#accuracy',
  },
  consentBackgroundCheck: {
    title: 'Background check',
    explanation: 'We and the employer may confirm your identity, qualifications and work history.',
    href: '/declaration#background-check',
  },
  consentReferenceCheck: {
    title: 'Reference check',
    explanation: 'We and the employer may contact the referees you have named.',
    href: '/declaration#reference-check',
  },
  medicalFitnessDecl: {
    title: 'Medical fitness',
    explanation: 'You are fit to carry out the duties of this role.',
    href: '/declaration#medical-fitness',
  },
};

export const DECLARATION_PANEL_ORDER = Object.keys(DECLARATION_PANEL);
