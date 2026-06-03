/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { useJobs } from '../hooks/useJobs';
import { MapPin, Briefcase, Calendar, Clipboard, ShieldCheck, CheckCircle2, ChevronRight } from 'lucide-react';
import './styles/JobDetail.css';

export function JobDetail() {
  const { id } = useParams();
  const { jobs } = useJobs();

  const job = useMemo(() => {
    return jobs.find((j) => j.id === id);
  }, [jobs, id]);

  if (!job) {
    return (
      <div className="jd-not-found">
        <h2 className="jd-not-found-title">Vacancy Not Found</h2>
        <p className="jd-not-found-desc">
          The requested recruitment listing does not exist or has been withdrawn by administrative oversight.
        </p>
        <Link to="/jobs" className="jd-not-found-btn">
          Return to Jobs Catalog
        </Link>
      </div>
    );
  }

  const splitItems = (str) => {
    if (!str) return [];
    return str.split('\n').filter((item) => item.trim() !== '');
  };

  const responsibilitiesList = splitItems(job.responsibilities);
  const requirementsList = splitItems(job.requirements);

  const formattedRequirements = useMemo(() => {
    const list = [];
    const reqs = job.applicationRequirements;
    if (!reqs) return [];

    if (reqs.cvRequired)             list.push('CV / Professional Resume');
    if (reqs.coverLetterRequired)    list.push('Cover Letter Statement');
    if (reqs.academicCertRequired)   list.push('Academic Certificates / Degrees');
    if (reqs.nyscCertRequired)       list.push('NYSC Discharge / Exemption Certificate');
    if (reqs.passportPhotoRequired)  list.push('Recent Passport Photograph (JPG/PNG)');
    if (reqs.nationalIdRequired)     list.push('National Identity Verification (NIN Slip)');
    if (reqs.dobRequired)            list.push('Proof of Date of Birth');
    if (reqs.stateOfOriginRequired)  list.push('State of Origin Verification');
    if (reqs.lgaRequired)            list.push('LGA Endorsement documentation');

    return list;
  }, [job]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="jd-page"
      id={`job-detail-page-${job.id}`}
    >
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
              <div className="jd-dossier-row">
                <span className="jd-dossier-label">Vetting Agent</span>
                <span className="jd-dossier-value">3DEES Garki II</span>
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
          {formattedRequirements.length > 0 && (
            <div className="jd-card jd-checklist">
              <h4 className="jd-checklist-title">Candidate Requirements Checklist</h4>
              <p className="jd-checklist-desc">
                The administrative panel requires verified uploads of the following documents to process this specific portal:
              </p>
              <ul className="jd-checklist-list">
                {formattedRequirements.map((reqName) => (
                  <li key={reqName} className="jd-checklist-item">
                    <CheckCircle2 className="jd-check-icon" />
                    <span>{reqName}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}