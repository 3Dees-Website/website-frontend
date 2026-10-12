/**
 * Company details used across the site and the legal pages.
 *
 * A `null` value is a placeholder still to be filled in: <CompanyValue />
 * renders it as a visibly marked [[...]] token until it is set here.
 */
export const COMPANY = {
  legalName: '3 Dees Consulting Works & Resourcing Ltd',
  rcNumber: '9160527',
  email: 'info@3deesrecruitment.com',
  registeredAddress: null, // [[REGISTERED ADDRESS]]
  effectiveDate: null,     // [[EFFECTIVE DATE]]
  courtLocation: null,     // [[COURT LOCATION]]
  hostingRegions: null,    // [[CONFIRM HOSTING REGIONS]]
  dataRequestDays: null,   // [[30 days]] — lawyer to confirm against the GAID
};

// The [[...]] text shown on the page while a value above is still null.
export const COMPANY_PLACEHOLDERS = {
  registeredAddress: 'REGISTERED ADDRESS',
  effectiveDate: 'EFFECTIVE DATE',
  courtLocation: 'COURT LOCATION',
  hostingRegions: 'CONFIRM HOSTING REGIONS',
  dataRequestDays: '30 days',
};
