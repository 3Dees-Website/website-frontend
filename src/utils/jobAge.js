/**
 * A job's optional age requirement. `minAge` alone means "at least this old";
 * with `maxAge` it is an inclusive range. Mirrors the backend's
 * utils/jobAge.js wording so the client and server messages read the same.
 * The backend remains authoritative.
 */

const hasValue = (v) => v !== null && v !== undefined;

/** Compact form for badges and rows: "21+", "21–35", or "21" when min equals max. null when there is no requirement. */
export const formatAgeRequirement = (minAge, maxAge) => {
  if (!hasValue(minAge) && !hasValue(maxAge)) return null;
  if (!hasValue(maxAge)) return `${minAge}+`;
  if (!hasValue(minAge)) return `up to ${maxAge}`;
  if (minAge === maxAge) return `${minAge}`;
  return `${minAge}–${maxAge}`;
};

/** Prose form, e.g. "between 21 and 35 years old". */
export const describeAgeRequirement = (minAge, maxAge) => {
  if (!hasValue(maxAge)) return `at least ${minAge} years old`;
  if (!hasValue(minAge)) return `at most ${maxAge} years old`;
  if (minAge === maxAge) return `${minAge} years old`;
  return `between ${minAge} and ${maxAge} years old`;
};

/** Why an applicant of `age` may not apply, or null when they may (or the age is unknown / no requirement). */
export const ageRequirementProblem = (age, minAge, maxAge) => {
  if (age === null || age === undefined) return null;
  if (!hasValue(minAge) && !hasValue(maxAge)) return null;
  if ((hasValue(minAge) && age < minAge) || (hasValue(maxAge) && age > maxAge)) {
    return `Applicants for this vacancy must be ${describeAgeRequirement(minAge, maxAge)}.`;
  }
  return null;
};
