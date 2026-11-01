/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { useJob } from '../hooks/useJob';
import { useFieldCatalog } from '../hooks/useFieldCatalog';
import { MapPin, Briefcase, Calendar, Clipboard, ShieldCheck, CheckCircle2, Circle, ChevronRight } from 'lucide-react';
import './styles/JobDetail.css';

export function JobDetail() {
  const { id } = useParams();
  const { job, isLoading: isLoadingJob, error: jobError } = useJob(id);
  const { catalog } = useFieldCatalog();

  // All hooks must run unconditionally before any early returns.

  // "What you'll need" checklist — generated from the job's per-field
  // application_requirements config + catalog labels. Conditional sub-fields
  // (the experience trio) are never independently listed in a job's config,
  // so they never appear here on their own.
  const checklist = useMemo(() => {
    const empty = { requiredDocs: [], optionalDocs: [], requiredOther: [], optionalOther: [] };
    if (!catalog || !job?.applicationRequirements) return empty;
    const reqs = job.applicationRequirements;

    return catalog.fields.reduce((acc, field) => {
      if (field.conditionalOn) return acc;
      const requirement = reqs[field.key];
      if (!requirement) return acc;

      if (field.type === 'file') {
        (requirement === 'required' ? acc.requiredDocs : acc.optionalDocs).push(field.label);
      } else {
        (requirement === 'required' ? acc.requiredOther : acc.optionalOther).push(field.label);
      }
      return acc;
    }, empty);
  }, [catalog, job]);

  const hasChecklist =
    checklist.requiredDocs.length || checklist.optionalDocs.length ||
    checklist.requiredOther.length || checklist.optionalOther.length;

  const splitItems = (str) => {
    if (!str) return [];
    return str.split('\n').filter((item) => item.trim() !== '');
  };

  if (isLoadingJob) {
    return (
      <div className="jd-loading" aria-live="polite">
        <title>Jobs | 3DEES</title>
        <div className="jd-skeleton-card">
          <div className="skeleton-line skeleton-line-short" />
          <div className="skeleton-line skeleton-line-long" />
          <div className="skeleton-line skeleton-line-medium" />
          <div className="skeleton-line skeleton-line-long" />
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="jd-not-found">
        <title>Jobs | 3DEES</title>
        <h2 className="jd-not-found-title">{jobError ? 'Could Not Load Vacancy' : 'Vacancy Not Found'}</h2>
        <p className="jd-not-found-desc">
          {jobError
            ? 'Something went wrong reaching the server. Please check your connection and try again shortly.'
            : 'The requested recruitment listing does not exist or has been withdrawn by administrative oversight.'}
        </p>
        <Link to="/jobs" className="jd-not-found-btn">
          Return to Jobs Catalog
        </Link>
      </div>
    );
  }

  const responsibilitiesList = splitItems(job.responsibilities);
  const requirementsList = splitItems(job.requirements);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="jd-page"
      id={`job-detail-page-${job.id}`}
    >
      <title>{`${job.title} | 3DEES`}</title>
      {/* Breadcrumb */}
      <div className="jd-breadcrumb">
        <Link to="/" className="jd-breadcrumb-link">Home</Link>
        <ChevronRight className="jd-breadcrumb-chevron" />
        <Link to="/jobs" className="jd-breadcrumb-link">Jobs</Link>
        <ChevronRight className="jd-breadcrumb-chevron" />
        <span className="jd-breadcrumb-current">{job.title}</span>
      </div>

      <div className="jd-layout">

        {/* ── Main Panel ── */}
        <div className="jd-main" id="job-detail-main">

          {/* Header Card */}
          <div className="jd-card">
            <span className="jd-category-badge">{job.category}</span>
            <h1 className="jd-title">{job.title}</h1>
            <p className="jd-org">{job.clientOrg}</p>

            <div className="jd-meta-row">
              <span className="jd-meta-item">
                <MapPin className="jd-meta-icon" />
                <span className="jd-meta-value">{job.location}</span>
              </span>
              <span className="jd-meta-item">
                <Briefcase className="jd-meta-icon" />
                <span className="jd-meta-value">{job.type}</span>
              </span>
              <span className="jd-meta-item">
                <Calendar className="jd-meta-icon" />
                <span>Deadline: <strong className="jd-meta-value">{new Date(job.closingDate).toLocaleDateString()}</strong></span>
              </span>
            </div>
          </div>

          {/* Overview */}
          <div className="jd-card jd-section">
            <h2 className="jd-section-title">
              <Clipboard className="jd-section-icon" />
              <span>Role Overview</span>
            </h2>
            <p className="jd-body-text jd-preline">{job.description}</p>
          </div>

          {/* Responsibilities */}
          {responsibilitiesList.length > 0 && (
            <div className="jd-card jd-section">
              <h2 className="jd-section-title">
                <ShieldCheck className="jd-section-icon" />
                <span>Core Responsibilities</span>
              </h2>
              <ul className="jd-list">
                {responsibilitiesList.map((resp, index) => (
                  <li key={index} className="jd-list-item">
                    <span className="jd-bullet">•</span>
                    <span>{resp}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Requirements */}
          {requirementsList.length > 0 && (
            <div className="jd-card jd-section">
              <h2 className="jd-section-title">
                <CheckCircle2 className="jd-section-icon" />
                <span>Qualifications & Specifications</span>
              </h2>
              <ul className="jd-list">
                {requirementsList.map((req, index) => (
                  <li key={index} className="jd-list-item">
                    <span className="jd-bullet">•</span>
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Benefits */}
          <div className="jd-card jd-section">
            <h3 className="jd-section-title jd-section-title-plain">Benefits & Retainership</h3>
            <p className="jd-body-text">
              3DEES Consulting works operates high-compliance placements. For approved candidates, benefits usually encompass healthcare packages, mandatory employee pension compliance matching, skills development, and safe transport provisions. Details are formalized upon contract dispatch.
            </p>
          </div>
        </div>

        {/* ── Sidebar ── */}
        <div className="jd-sidebar" id="job-detail-sidebar">

          {/* Dossier card */}
          <div className="jd-card jd-dossier">
            <h3 className="jd-dossier-title">Recruitment Dossier</h3>

            <div className="jd-dossier-rows">
              <div className="jd-dossier-row">
                <span className="jd-dossier-label">Salary Package</span>
                <span className="jd-dossier-value">
                  {job.salaryRange || 'Commensurate with Role'}
                </span>
              </div>
              <div className="jd-dossier-row">
                <span className="jd-dossier-label">Position Openings</span>
                <span className="jd-dossier-value">
                  {job.openings} {job.openings === 1 ? 'Slot' : 'Slots'}
                </span>
              </div>
              <div className="jd-dossier-row">
                <span className="jd-dossier-label">Closing Date</span>
                <span className="jd-dossier-value jd-dossier-primary">
                  {new Date(job.closingDate).toLocaleDateString()}
                </span>
              </div>
            </div>

            <Link
              to={`/apply/${job.id}`}
              className="jd-apply-btn"
              id="sidebar-apply-btn"
            >
              Apply Per This Vacancy
            </Link>
          </div>

          {/* Requirements checklist */}
          {hasChecklist > 0 && (
            <div className="jd-card jd-checklist">
              <h4 className="jd-checklist-title">Candidate Requirements Checklist</h4>
              <p className="jd-checklist-desc">
                This vacancy's application form asks for the following. Required items must be
                provided to submit; optional items strengthen your dossier but won't block it.
              </p>

              {(checklist.requiredDocs.length > 0 || checklist.optionalDocs.length > 0) && (
                <div className="jd-checklist-group">
                  <h5 className="jd-checklist-group-title">Documents</h5>
                  <ul className="jd-checklist-list">
                    {checklist.requiredDocs.map((label) => (
                      <li key={label} className="jd-checklist-item">
                        <CheckCircle2 className="jd-check-icon" />
                        <span>{label}</span>
                      </li>
                    ))}
                    {checklist.optionalDocs.map((label) => (
                      <li key={label} className="jd-checklist-item jd-checklist-item-optional">
                        <Circle className="jd-check-icon jd-check-icon-optional" />
                        <span>{label} <span className="jd-checklist-optional-tag">(Optional)</span></span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {(checklist.requiredOther.length > 0 || checklist.optionalOther.length > 0) && (
                <div className="jd-checklist-group">
                  <h5 className="jd-checklist-group-title">Other Information</h5>
                  <ul className="jd-checklist-list">
                    {checklist.requiredOther.map((label) => (
                      <li key={label} className="jd-checklist-item">
                        <CheckCircle2 className="jd-check-icon" />
                        <span>{label}</span>
                      </li>
                    ))}
                    {checklist.optionalOther.map((label) => (
                      <li key={label} className="jd-checklist-item jd-checklist-item-optional">
                        <Circle className="jd-check-icon jd-check-icon-optional" />
                        <span>{label} <span className="jd-checklist-optional-tag">(Optional)</span></span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}