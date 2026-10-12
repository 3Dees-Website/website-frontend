/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo, useRef, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useJobs } from '../hooks/useJobs';
import { useApplications } from '../hooks/useApplications';
import { useFieldCatalog } from '../hooks/useFieldCatalog';
import { useToast } from '../hooks/useToast';
import { FieldRenderer } from '../components/FieldRenderer';
import {
  getEnabledSections,
  getVisibleSectionFields,
  validateSectionFields,
  deriveFullName,
  deriveAge,
  isEmptyValue,
  formatAnswerForReview,
} from '../utils/fieldCatalogHelpers';
import { DECLARATION_PANEL, DECLARATION_PANEL_ORDER } from '../constants/declarationPanel';
import { ChevronRight, ChevronLeft, Check, AlertCircle, MapPin, Briefcase } from 'lucide-react';
import './styles/Apply.css';

const REVIEW_STEP_KEY = '__review';

export function Apply() {
  const { id } = useParams();
  const { jobs, isLoadingJobs } = useJobs();
  const { catalog, isLoadingCatalog } = useFieldCatalog();
  const { applyToJob } = useApplications();
  const { addToast } = useToast();
  const navigate = useNavigate();

  // All hooks must be declared unconditionally before any early returns.
  const job = useMemo(() => jobs.find((j) => j.id === id), [jobs, id]);
  const reqs = useMemo(() => job?.applicationRequirements || {}, [job]);

  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [refId, setRefId] = useState(null);
  const activeStepRef = useRef(null);

  useEffect(() => {
    activeStepRef.current?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  }, [step]);

  const [answers, setAnswers] = useState({});
  const [files, setFiles] = useState({});
  const [errors, setErrors] = useState({});

  // Reset the wizard whenever the applicant lands on a different job — an
  // in-render state adjustment (React's recommended pattern for "reset state
  // when a prop changes"), not an effect, so it doesn't cascade an extra render.
  const [wizardJobId, setWizardJobId] = useState(id);
  if (wizardJobId !== id) {
    setWizardJobId(id);
    setStep(0);
    setAnswers({});
    setFiles({});
    setErrors({});
    setRefId(null);
  }

  const enabledSections = useMemo(
    () => (catalog ? getEnabledSections(catalog, reqs) : []),
    [catalog, reqs]
  );

  const steps = useMemo(
    () => [...enabledSections, { key: REVIEW_STEP_KEY, title: 'Review' }],
    [enabledSections]
  );

  if (isLoadingJobs || isLoadingCatalog) {
    return (
      <div className="apply-not-found">
        <p className="apply-not-found-desc">Loading vacancy details…</p>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="apply-not-found">
        <h2 className="apply-not-found-title">Invalid Application Route</h2>
        <p className="apply-not-found-desc">
          The careers portal you are trying to access does not match any active recruitment workflows.
        </p>
        <Link to="/jobs" className="apply-not-found-btn">Browse Open Positions</Link>
      </div>
    );
  }

  if (!catalog) {
    return (
      <div className="apply-not-found">
        <h2 className="apply-not-found-title">Application Form Unavailable</h2>
        <p className="apply-not-found-desc">
          We could not load the application form definitions. Please check your connection and try again.
        </p>
      </div>
    );
  }

  const currentStep = steps[step];
  const isReviewStep = currentStep.key === REVIEW_STEP_KEY;

  const handleAnswerChange = (key, value) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => {
      if (!(key in prev)) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const handleFileChange = (key, file) => {
    setFiles((prev) => ({ ...prev, [key]: file }));
    setErrors((prev) => {
      if (!(key in prev)) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
    addToast('success', 'Document Attached', `Attached: ${file.name}`);
  };

  const handleFileAdd = (key, file) => {
    setFiles((prev) => ({ ...prev, [key]: [...(prev[key] || []), file] }));
    setErrors((prev) => {
      if (!(key in prev)) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
    addToast('success', 'Document Attached', `Attached: ${file.name}`);
  };

  const handleFileRemoveAt = (key, idx) => {
    setFiles((prev) => {
      if (idx === undefined) {
        const next = { ...prev };
        delete next[key];
        return next;
      }
      const arr = [...(prev[key] || [])];
      arr.splice(idx, 1);
      const next = { ...prev };
      if (arr.length) next[key] = arr;
      else delete next[key];
      return next;
    });
  };

  const validateStep = (idx) => {
    const section = steps[idx];
    if (section.key === REVIEW_STEP_KEY) return true;
    const fields = getVisibleSectionFields(catalog, section.key, reqs, answers);
    const stepErrors = validateSectionFields(fields, reqs, answers, files);
    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setDirection(1);
      setStep((p) => p + 1);
    } else {
      addToast('error', 'Validation Failure', 'Please resolve highlighted details before advancing.');
    }
  };

  const handleBack = () => {
    setDirection(-1);
    setStep((p) => p - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Defensive full pass across every enabled section before transmitting —
    // per-step validation already gates forward navigation, but this catches
    // anything left over if the applicant backtracked.
    for (let i = 0; i < steps.length - 1; i++) {
      if (!validateStep(i)) {
        addToast('error', 'Validation Failure', `Please resolve details in "${steps[i].title}" before submitting.`);
        setDirection(-1);
        setStep(i);
        return;
      }
    }

    setIsSubmitting(true);
    try {
      const submissionAnswers = {};
      const submissionFiles = {};
      enabledSections.forEach((section) => {
        getVisibleSectionFields(catalog, section.key, reqs, answers).forEach((f) => {
          if (f.type === 'file') {
            if (files[f.key] !== undefined) submissionFiles[f.key] = files[f.key];
          } else if (answers[f.key] !== undefined) {
            submissionAnswers[f.key] = answers[f.key];
          }
        });
      });

      const referenceCode = await applyToJob({ jobId: job.id, answers: submissionAnswers, files: submissionFiles });
      setRefId(referenceCode);
      addToast('success', 'Application Submitted', 'Your application file was successfully transmitted.');
    } catch (err) {
      addToast('error', 'Submission Failed', err.message || 'Could not submit your application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const slideVariants = {
    enter: (dir) => ({ x: dir > 0 ? 150 : -150, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir) => ({ x: dir < 0 ? 150 : -150, opacity: 0 })
  };

  return (
    <div className="apply-page" id="apply-workflow-page">

      {/* Title */}
      <div className="apply-page-header">
        <h1 className="apply-page-title">Recruitment Intake Form</h1>
        <div className="apply-page-meta">
          <span className="apply-meta-job">{job.title}</span>
          <span className="apply-meta-divider">|</span>
          <span className="apply-meta-item"><MapPin className="apply-meta-icon" /> {job.location}</span>
          <span className="apply-meta-divider">|</span>
          <span className="apply-meta-item"><Briefcase className="apply-meta-icon" /> {job.type}</span>
        </div>
      </div>

      {/* Success View */}
      {refId ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="apply-success"
          id="success-application-frame"
        >
          <div className="apply-success-icon-wrap">
            <Check className="apply-success-icon" />
          </div>
          <h2 className="apply-success-title">Application Transmitted</h2>
          <p className="apply-success-desc">
            Excellent! Your profile files have been securely indexed. Please record your unique Application Reference Stamp below.
          </p>
          <div className="apply-ref-stamp" id="application-ref-stamp">{refId}</div>
          <div className="apply-success-note">
            An email confirmation was queued for {answers.email}. Our board agents will contact you via {answers.phone} to schedule qualifying assessment loops.
          </div>
          <button onClick={() => navigate('/jobs')} className="apply-success-btn">
            Back to Open Positions
          </button>
        </motion.div>
      ) : (
        <div className="apply-body">

          {/* Form Side */}
          <div className="apply-form-side">

            {/* Step Indicator */}
            <div className="apply-steps-bar">
              {steps.map((st, idx) => (
                <div
                  key={st.key}
                  className="apply-step-item"
                  ref={step === idx ? activeStepRef : null}
                >
                  <div className={`apply-step-circle ${step >= idx ? 'apply-step-active' : 'apply-step-inactive'}`}>
                    {step > idx ? <Check className="apply-step-check" /> : idx + 1}
                  </div>
                  <span className={`apply-step-label ${step === idx ? 'apply-step-label-active' : 'apply-step-label-dim'}`}>
                    {st.title}
                  </span>
                </div>
              ))}
            </div>

            {/* Form Card */}
            <div className="apply-form-card">
              <AnimatePresence custom={direction} mode="wait">
                <motion.div
                  key={step}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.35, ease: 'easeInOut' }}
                  className="apply-motion-wrap"
                >
                  <form onSubmit={handleSubmit} className="apply-form">

                    {/* ── SECTION STEP ── */}
                    {!isReviewStep && (
                      <div className="apply-step-body">
                        <h2 className="apply-step-title">{currentStep.title}</h2>

                        {currentStep.key === 'jobInfo' && (
                          <div className="apply-auto-info">
                            <div><strong>Position Applying For:</strong> {job.title}</div>
                            <div><strong>Employment Type:</strong> {job.type}</div>
                          </div>
                        )}

                        {(() => {
                          const visibleFields = getVisibleSectionFields(catalog, currentStep.key, reqs, answers)
                            .filter((field) => !field.conditionalOn); // subfields render recursively inside their yesno parent
                          const fileFields = visibleFields.filter((f) => f.type === 'file');
                          // Declarations with panel text render together in one panel, in
                          // the panel's own order; unmapped ones stay in the grid.
                          const isPanelField = (f) => f.type === 'declaration' && f.key in DECLARATION_PANEL;
                          const panelFields = visibleFields
                            .filter(isPanelField)
                            .sort((a, b) => DECLARATION_PANEL_ORDER.indexOf(a.key) - DECLARATION_PANEL_ORDER.indexOf(b.key));
                          const otherFields = visibleFields.filter((f) => f.type !== 'file' && !isPanelField(f));
                          const renderField = (field) => (
                            <FieldRenderer
                              key={field.key}
                              field={field}
                              required={reqs[field.key] === 'required'}
                              answers={answers}
                              files={files}
                              errors={errors}
                              catalog={catalog}
                              onAnswerChange={handleAnswerChange}
                              onFileChange={handleFileChange}
                              onFileAdd={handleFileAdd}
                              onFileRemoveAt={handleFileRemoveAt}
                              addToast={addToast}
                            />
                          );
                          return (
                            <>
                              {otherFields.length > 0 && (
                                <div className="apply-fields-grid">
                                  {otherFields.map(renderField)}
                                </div>
                              )}
                              {panelFields.length > 0 && (
                                <div className="apply-decl-panel" role="group" aria-label={currentStep.title}>
                                  {panelFields.map(renderField)}
                                </div>
                              )}
                              {fileFields.length > 0 && (
                                <div className="apply-file-grid">
                                  {fileFields.map(renderField)}
                                </div>
                              )}
                            </>
                          );
                        })()}
                      </div>
                    )}

                    {/* ── REVIEW STEP ── */}
                    {isReviewStep && (
                      <div className="apply-step-body">
                        <h2 className="apply-step-title">Review & Submit</h2>
                        <div className="apply-review-grid">

                          {enabledSections.map((section) => {
                            const fields = getVisibleSectionFields(catalog, section.key, reqs, answers)
                              .filter((f) => f.type !== 'file');
                            const answeredFields = fields.filter(
                              (f) => f.type === 'declaration' || !isEmptyValue(answers[f.key])
                            );
                            const showFullName = section.key === 'personal';
                            if (!showFullName && answeredFields.length === 0) return null;

                            return (
                              <div key={section.key} className="apply-review-card">
                                <h4 className="apply-review-heading">{section.title}</h4>
                                <div className="apply-review-rows">
                                  {showFullName && (
                                    <>
                                      <div><strong>Full Name:</strong> {deriveFullName(answers) || '—'}</div>
                                      {!isEmptyValue(answers.dateOfBirth) && (
                                        <div><strong>Age:</strong> {deriveAge(answers.dateOfBirth)} years</div>
                                      )}
                                    </>
                                  )}
                                  {answeredFields.map((f) => (
                                    <div key={f.key}>
                                      <strong>{f.label}:</strong> {formatAnswerForReview(f, answers[f.key])}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            );
                          })}

                          <div className="apply-review-card apply-review-card-full">
                            <h4 className="apply-review-heading">Attached Documents</h4>
                            <div className="apply-attached-grid">
                              {Object.entries(files).flatMap(([key, val]) => {
                                const field = catalog.fields.find((f) => f.key === key);
                                if (!field) return [];
                                const list = Array.isArray(val) ? val : [val];
                                return list.map((file, idx) => (
                                  <div key={`${key}-${idx}`} className="apply-attached-item">
                                    <Check className="apply-attached-check" />
                                    <span className="apply-attached-name">{field.label}: {file.name}</span>
                                  </div>
                                ));
                              })}
                              {Object.keys(files).length === 0 && (
                                <span className="apply-attached-empty">None configured or attached.</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Nav Buttons */}
                    <div className="apply-nav-row">
                      {step > 0 ? (
                        <button type="button" onClick={handleBack} className="apply-back-btn" id="form-back-btn">
                          <ChevronLeft className="apply-nav-icon" />
                          <span>Back</span>
                        </button>
                      ) : <div />}

                      {!isReviewStep ? (
                        <button type="button" onClick={handleNext} className="apply-next-btn" id="form-next-btn">
                          <span>Next Step</span>
                          <ChevronRight className="apply-nav-icon" />
                        </button>
                      ) : (
                        <button type="submit" disabled={isSubmitting}
                          className={`apply-submit-btn ${!isSubmitting ? 'apply-submit-active' : 'apply-submit-disabled'}`}
                          id="form-submit-btn">
                          {isSubmitting ? (
                            <>
                              <svg className="apply-spinner" fill="none" viewBox="0 0 24 24">
                                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                              </svg>
                              <span>Submitting your application…</span>
                            </>
                          ) : (
                            <>
                              <Check className="apply-nav-icon" />
                              <span>Submit Clean Dossier</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>

                  </form>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Sidebar */}
          <div className="apply-sidebar">
            <h4 className="apply-sidebar-title">
              <AlertCircle className="apply-sidebar-icon" />
              <span>Intake Instructions</span>
            </h4>
            <p className="apply-sidebar-desc">
              Your information is handled in line with our{' '}
              <Link to="/privacy" target="_blank" rel="noopener noreferrer" className="apply-sidebar-link">Privacy Policy</Link>
              {' '}and the Nigeria Data Protection Act 2023.
            </p>
            <ul className="apply-sidebar-list">
              <li>Ensure spelling matches NIN details exactly.</li>
              <li>Scans of degrees or certificates must clearly display seal details.</li>
              <li>Attachments must remain legible under 5MB sizes.</li>
            </ul>
          </div>

        </div>
      )}
    </div>
  );
}
