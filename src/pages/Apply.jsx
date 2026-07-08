/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useJobs } from '../hooks/useJobs';
import { useApplications } from '../hooks/useApplications';
import { useToast } from '../hooks/useToast';
import { ChevronRight, ChevronLeft, Upload, Check, AlertCircle, FileCheck, MapPin, Briefcase } from 'lucide-react';
import './styles/Apply.css';

export function Apply() {
  const { id } = useParams();
  const { jobs, isLoadingJobs } = useJobs();
  const { applyToJob } = useApplications();
  const { addToast } = useToast();
  const navigate = useNavigate();

  // All hooks must be declared unconditionally before any early returns.
  const job = useMemo(() => jobs.find((j) => j.id === id), [jobs, id]);

  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [refId, setRefId] = useState(null);

  const [personalInfo, setPersonalInfo] = useState({
    fullName: '', email: '', phone: '', dob: '',
    gender: '', stateOfOrigin: '', lga: '', residentialAddress: ''
  });

  const [educationInfo, setEducationInfo] = useState({
    highestQualification: '', institution: '', yearOfGraduation: '',
    yearsOfExperience: '', currentEmployer: '', workSummary: ''
  });

  const [documents, setDocuments] = useState({});
  const [declaration, setDeclaration] = useState(false);
  const [errors, setErrors] = useState({});

  if (isLoadingJobs) {
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

  const reqs = job.applicationRequirements;

  const handleFileUpload = (field, e, allowedTypes, maxMb = 5) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileMb = file.size / (1024 * 1024);
    const fileExt = '.' + file.name.split('.').pop()?.toLowerCase();

    const matchesType = allowedTypes.some((t) => {
      if (t.startsWith('.')) return fileExt === t;
      return file.type.includes(t);
    });

    if (!matchesType) {
      setErrors((prev) => ({ ...prev, [field]: `Invalid format. Expected: ${allowedTypes.join(', ')}` }));
      addToast('error', 'File Upload Error', `File format must be: ${allowedTypes.join(', ')}`);
      return;
    }

    if (fileMb > maxMb) {
      setErrors((prev) => ({ ...prev, [field]: `File size exceeds ${maxMb}MB threshold (Found: ${fileMb.toFixed(1)}MB)` }));
      addToast('error', 'File Upload Error', `Single files cannot exceed ${maxMb}MB.`);
      return;
    }

    setDocuments((prev) => ({
      ...prev,
      [field]: {
        name: file.name,
        size: `${fileMb.toFixed(1)} MB`,
        type: file.type,
        url: URL.createObjectURL(file),
        fileRef: file,   // actual File object for multipart API submission
      },
    }));

    setErrors((prev) => {
      const rest = { ...prev };
      delete rest[field];
      return rest;
    });

    addToast('success', 'Document Attached', `Attached: ${file.name}`);
  };

  const validateStep = (s) => {
    const tempErrors = {};

    if (s === 1) {
      if (!personalInfo.fullName.trim()) tempErrors.fullName = 'Full Name is required.';
      if (!personalInfo.email.trim()) {
        tempErrors.email = 'Email address is required.';
      } else if (!/\S+@\S+\.\S+/.test(personalInfo.email)) {
        tempErrors.email = 'Specify a valid email address.';
      }
      if (!personalInfo.phone.trim()) {
        tempErrors.phone = 'Active phone contact is required.';
      } else if (personalInfo.phone.trim().length < 8) {
        tempErrors.phone = 'Specify a valid phone number.';
      }
      if (!personalInfo.residentialAddress.trim()) tempErrors.residentialAddress = 'Provide your primary residential address.';
      if (!personalInfo.gender) tempErrors.gender = 'Select your gender.';
      if (reqs.dobRequired && !personalInfo.dob) tempErrors.dob = 'Date of birth is mandatory for this vacancy.';
      if (reqs.stateOfOriginRequired && !personalInfo.stateOfOrigin.trim()) tempErrors.stateOfOrigin = 'Specify your State of Origin.';
      if (reqs.lgaRequired && !personalInfo.lga.trim()) tempErrors.lga = 'Specify your local government area (LGA).';
    } else if (s === 2) {
      if (!educationInfo.highestQualification.trim()) tempErrors.highestQualification = 'Select or enter your highest degree.';
      if (!educationInfo.institution.trim()) tempErrors.institution = 'Enter graduating academy name.';
      if (!educationInfo.yearOfGraduation.trim()) {
        tempErrors.yearOfGraduation = 'Graduation year is required.';
      } else if (isNaN(Number(educationInfo.yearOfGraduation)) || educationInfo.yearOfGraduation.length !== 4) {
        tempErrors.yearOfGraduation = 'Provide a valid 4-digit graduation year.';
      }
      if (!educationInfo.workSummary.trim()) tempErrors.workSummary = 'A brief summary of your work or academic history is required.';
      if (reqs.yearsOfExpRequired && !educationInfo.yearsOfExperience.trim()) {
        tempErrors.yearsOfExperience = 'Years of active experience are required.';
      }
    } else if (s === 3) {
      if (reqs.cvRequired && !documents.cv) tempErrors.cv = 'CV / Resume uploading is mandatory.';
      if (reqs.coverLetterRequired && !documents.coverLetter) tempErrors.coverLetter = 'Cover Letter uploading is mandatory.';
      if (reqs.academicCertRequired && !documents.academicCert) tempErrors.academicCert = 'Academic Certificate uploading is mandatory.';
      if (reqs.nyscCertRequired && !documents.nyscCert) tempErrors.nyscCert = 'NYSC Certificate listing is mandatory.';
      if (reqs.passportPhotoRequired && !documents.passportPhoto) tempErrors.passportPhoto = 'Colored Passport photo is mandatory.';
      if (reqs.nationalIdRequired && !documents.nationalId) tempErrors.nationalId = 'National Identity slip/card is mandatory.';
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
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
    if (!declaration) {
      addToast('error', 'Declaration Required', 'You must verify the legal liability declaration box.');
      return;
    }
    setIsSubmitting(true);
    try {
      const referenceCode = await applyToJob({
        jobId: job.id, personalInfo, educationInfo, documents,
      });
      setRefId(referenceCode);
      addToast('success', 'Application Submitted', 'Your application file was successfully transmitted.');
    } catch (err) {
      addToast('error', 'Submission Failed', err.message || 'Could not submit your application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const stepsList = [
    { num: 1, text: 'Bio-Data' },
    { num: 2, text: 'Education' },
    { num: 3, text: 'Documents' },
    { num: 4, text: 'Review' }
  ];

  const slideVariants = {
    enter: (dir) => ({ x: dir > 0 ? 150 : -150, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir) => ({ x: dir < 0 ? 150 : -150, opacity: 0 })
  };

  // Reusable file upload block
  const FileUploadBlock = ({ field, label, accept, allowedTypes, actionLabel = 'Attach File' }) => (
    <div className="apply-doc-block">
      <span className="apply-doc-label">{label} <span className="apply-required">*</span></span>
      <div className="apply-doc-row">
        <label className="apply-upload-btn">
          <Upload className="apply-upload-icon" />
          <span>{actionLabel}</span>
          <input
            type="file"
            required={!documents[field]}
            onChange={(e) => handleFileUpload(field, e, allowedTypes)}
            className="apply-file-hidden"
            accept={accept}
          />
        </label>
        {documents[field] ? (
          <div className="apply-doc-attached">
            <FileCheck className="apply-doc-check" />
            <span className="apply-doc-name">{documents[field].name} ({documents[field].size})</span>
          </div>
        ) : (
          <span className="apply-doc-none">No file selected</span>
        )}
      </div>
      {errors[field] && <span className="apply-error-msg">{errors[field]}</span>}
    </div>
  );

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
            An email confirmation was queued for {personalInfo.email}. Our board agents will contact you via {personalInfo.phone} to schedule qualifying assessment loops.
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
              {stepsList.map((st) => (
                <div key={st.num} className="apply-step-item">
                  <div className={`apply-step-circle ${step >= st.num ? 'apply-step-active' : 'apply-step-inactive'}`}>
                    {step > st.num ? <Check className="apply-step-check" /> : st.num}
                  </div>
                  <span className={`apply-step-label ${step === st.num ? 'apply-step-label-active' : 'apply-step-label-dim'}`}>
                    {st.text}
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

                    {/* ── STEP 1: PERSONAL ── */}
                    {step === 1 && (
                      <div className="apply-step-body">
                        <h2 className="apply-step-title">Personal Particulars</h2>
                        <div className="apply-fields-grid">

                          <div className="apply-field">
                            <label className="apply-label">Full Name <span className="apply-required">*</span></label>
                            <input type="text" placeholder="e.g. Chidi Henry Nnaji" value={personalInfo.fullName}
                              onChange={(e) => setPersonalInfo({ ...personalInfo, fullName: e.target.value })}
                              className={`apply-input ${errors.fullName ? 'apply-input-err' : ''}`} />
                            {errors.fullName && <span className="apply-error-msg">{errors.fullName}</span>}
                          </div>

                          <div className="apply-field">
                            <label className="apply-label">Email Address <span className="apply-required">*</span></label>
                            <input type="email" placeholder="e.g. candidate@domain.com" value={personalInfo.email}
                              onChange={(e) => setPersonalInfo({ ...personalInfo, email: e.target.value })}
                              className={`apply-input ${errors.email ? 'apply-input-err' : ''}`} />
                            {errors.email && <span className="apply-error-msg">{errors.email}</span>}
                          </div>

                          <div className="apply-field">
                            <label className="apply-label">Phone Contact <span className="apply-required">*</span></label>
                            <input type="tel" placeholder="e.g. +2348034567890" value={personalInfo.phone}
                              onChange={(e) => setPersonalInfo({ ...personalInfo, phone: e.target.value })}
                              className={`apply-input ${errors.phone ? 'apply-input-err' : ''}`} />
                            {errors.phone && <span className="apply-error-msg">{errors.phone}</span>}
                          </div>

                          <div className="apply-field">
                            <label className="apply-label">Gender <span className="apply-required">*</span></label>
                            <select value={personalInfo.gender}
                              onChange={(e) => setPersonalInfo({ ...personalInfo, gender: e.target.value })}
                              className="apply-select">
                              <option value="">Select Gender</option>
                              <option value="Male">Male</option>
                              <option value="Female">Female</option>
                              <option value="Other">Other</option>
                            </select>
                            {errors.gender && <span className="apply-error-msg">{errors.gender}</span>}
                          </div>

                          {reqs.dobRequired && (
                            <div className="apply-field">
                              <label className="apply-label">Date of Birth <span className="apply-required">*</span></label>
                              <input type="date" value={personalInfo.dob}
                                onChange={(e) => setPersonalInfo({ ...personalInfo, dob: e.target.value })}
                                className="apply-input" />
                              {errors.dob && <span className="apply-error-msg">{errors.dob}</span>}
                            </div>
                          )}

                          {reqs.stateOfOriginRequired && (
                            <div className="apply-field">
                              <label className="apply-label">State of Origin <span className="apply-required">*</span></label>
                              <input type="text" placeholder="e.g. Anambra" value={personalInfo.stateOfOrigin}
                                onChange={(e) => setPersonalInfo({ ...personalInfo, stateOfOrigin: e.target.value })}
                                className="apply-input" />
                              {errors.stateOfOrigin && <span className="apply-error-msg">{errors.stateOfOrigin}</span>}
                            </div>
                          )}

                          {reqs.lgaRequired && (
                            <div className="apply-field apply-field-full">
                              <label className="apply-label">Local Govt Area (LGA) <span className="apply-required">*</span></label>
                              <input type="text" placeholder="e.g. Awka South" value={personalInfo.lga}
                                onChange={(e) => setPersonalInfo({ ...personalInfo, lga: e.target.value })}
                                className="apply-input" />
                              {errors.lga && <span className="apply-error-msg">{errors.lga}</span>}
                            </div>
                          )}

                          <div className="apply-field apply-field-full">
                            <label className="apply-label">Residential Address <span className="apply-required">*</span></label>
                            <textarea rows={2} placeholder="House No, Street name, City, State"
                              value={personalInfo.residentialAddress}
                              onChange={(e) => setPersonalInfo({ ...personalInfo, residentialAddress: e.target.value })}
                              className="apply-textarea" />
                            {errors.residentialAddress && <span className="apply-error-msg">{errors.residentialAddress}</span>}
                          </div>

                        </div>
                      </div>
                    )}

                    {/* ── STEP 2: EDUCATION ── */}
                    {step === 2 && (
                      <div className="apply-step-body">
                        <h2 className="apply-step-title">Academics & Experience</h2>
                        <div className="apply-fields-grid">

                          <div className="apply-field">
                            <label className="apply-label">Highest Qualification <span className="apply-required">*</span></label>
                            <select value={educationInfo.highestQualification}
                              onChange={(e) => setEducationInfo({ ...educationInfo, highestQualification: e.target.value })}
                              className="apply-select">
                              <option value="">Select Qualification</option>
                              <option value="B.Sc. / B.Eng. / B.Tech">Bachelor's Degree</option>
                              <option value="M.Sc. / MBA">Master's Degree</option>
                              <option value="HND">Higher National Diploma</option>
                              <option value="OND / NCE">OND / NCE</option>
                              <option value="SSCE / WAEC">SSCE / WAEC</option>
                              <option value="PhD">Doctorate Portfolio</option>
                            </select>
                            {errors.highestQualification && <span className="apply-error-msg">{errors.highestQualification}</span>}
                          </div>

                          <div className="apply-field">
                            <label className="apply-label">Graduating Institution <span className="apply-required">*</span></label>
                            <input type="text" placeholder="e.g. University of Ibadan" value={educationInfo.institution}
                              onChange={(e) => setEducationInfo({ ...educationInfo, institution: e.target.value })}
                              className="apply-input" />
                            {errors.institution && <span className="apply-error-msg">{errors.institution}</span>}
                          </div>

                          <div className="apply-field">
                            <label className="apply-label">Year of Graduation <span className="apply-required">*</span></label>
                            <input type="text" maxLength={4} placeholder="e.g. 2019" value={educationInfo.yearOfGraduation}
                              onChange={(e) => setEducationInfo({ ...educationInfo, yearOfGraduation: e.target.value })}
                              className="apply-input" />
                            {errors.yearOfGraduation && <span className="apply-error-msg">{errors.yearOfGraduation}</span>}
                          </div>

                          <div className="apply-field">
                            <label className="apply-label">
                              Years of Experience {reqs.yearsOfExpRequired ? <span className="apply-required">*</span> : '(Optional)'}
                            </label>
                            <input type="number" min={0} placeholder="Years active" value={educationInfo.yearsOfExperience}
                              onChange={(e) => setEducationInfo({ ...educationInfo, yearsOfExperience: e.target.value })}
                              className="apply-input" />
                            {errors.yearsOfExperience && <span className="apply-error-msg">{errors.yearsOfExperience}</span>}
                          </div>

                          <div className="apply-field apply-field-full">
                            <label className="apply-label">
                              Current Employer {reqs.currentEmployerRequired ? <span className="apply-required">*</span> : '(Optional)'}
                            </label>
                            <input type="text"
                              placeholder={reqs.currentEmployerRequired ? 'Current Company / Enterprise name' : 'Your last company role (if none, write None)'}
                              value={educationInfo.currentEmployer}
                              onChange={(e) => setEducationInfo({ ...educationInfo, currentEmployer: e.target.value })}
                              className="apply-input" />
                          </div>

                          <div className="apply-field apply-field-full">
                            <label className="apply-label">Core Work Summary <span className="apply-required">*</span></label>
                            <textarea rows={3} placeholder="Briefly review your primary daily responsibilities and career milestones..."
                              value={educationInfo.workSummary}
                              onChange={(e) => setEducationInfo({ ...educationInfo, workSummary: e.target.value })}
                              className="apply-textarea" />
                            {errors.workSummary && <span className="apply-error-msg">{errors.workSummary}</span>}
                          </div>

                        </div>
                      </div>
                    )}

                    {/* ── STEP 3: DOCUMENTS ── */}
                    {step === 3 && (
                      <div className="apply-step-body">
                        <h2 className="apply-step-title">Document Dossier File Attachments</h2>
                        <span className="apply-doc-hint">Maximum file limit: 5 MB per single attachment. Accepted formats are restricted individually.</span>
                        <div className="apply-docs-grid">
                          {reqs.cvRequired && <FileUploadBlock field="cv" label="CV / Resume Document (PDF/DOCX)"
                            accept=".pdf,.docx" allowedTypes={['.pdf', '.docx', 'application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']} />}
                          {reqs.coverLetterRequired && <FileUploadBlock field="coverLetter" label="Cover Letter Statement (PDF/DOCX)"
                            accept=".pdf,.docx" allowedTypes={['.pdf', '.docx', 'application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']} />}
                          {reqs.academicCertRequired && <FileUploadBlock field="academicCert" label="Degree Certificate (PDF/JPG)"
                            accept=".pdf,.jpg,.jpeg" allowedTypes={['.pdf', '.jpg', '.jpeg', 'application/pdf', 'image/jpeg']} />}
                          {reqs.nyscCertRequired && <FileUploadBlock field="nyscCert" label="NYSC Certificate / Exemption Slip"
                            accept=".pdf,.jpg,.jpeg" allowedTypes={['.pdf', '.jpg', '.jpeg', 'application/pdf', 'image/jpeg']} />}
                          {reqs.passportPhotoRequired && <FileUploadBlock field="passportPhoto" label="Passport Photograph (JPG/PNG)"
                            accept=".jpg,.jpeg,.png" allowedTypes={['.jpg', '.jpeg', '.png', 'image/jpeg', 'image/png']} actionLabel="Attach Photo" />}
                          {reqs.nationalIdRequired && <FileUploadBlock field="nationalId" label="National Identity NIN Card/Slip"
                            accept=".pdf,.jpg,.jpeg,.png" allowedTypes={['.pdf', '.jpg', '.jpeg', '.png', 'application/pdf', 'image/jpeg', 'image/png']} actionLabel="Attach NIN" />}
                        </div>
                      </div>
                    )}

                    {/* ── STEP 4: REVIEW ── */}
                    {step === 4 && (
                      <div className="apply-step-body">
                        <h2 className="apply-step-title">Review Dossier & Legal Declaration</h2>
                        <div className="apply-review-grid">

                          <div className="apply-review-card">
                            <h4 className="apply-review-heading">Candidate Particulars</h4>
                            <div className="apply-review-rows">
                              <div><strong>Full Name:</strong> {personalInfo.fullName}</div>
                              <div><strong>Email contact:</strong> {personalInfo.email}</div>
                              <div><strong>Phone Contact:</strong> {personalInfo.phone}</div>
                              <div><strong>Sex / Gender:</strong> {personalInfo.gender}</div>
                              {reqs.dobRequired && <div><strong>Date of Birth:</strong> {personalInfo.dob}</div>}
                              {reqs.stateOfOriginRequired && <div><strong>State of Origin:</strong> {personalInfo.stateOfOrigin} (LGA: {personalInfo.lga || 'N/A'})</div>}
                              <div className="apply-review-clamp"><strong>Residence:</strong> {personalInfo.residentialAddress}</div>
                            </div>
                          </div>

                          <div className="apply-review-card">
                            <h4 className="apply-review-heading">Intellectual Assets</h4>
                            <div className="apply-review-rows">
                              <div><strong>Qualification:</strong> {educationInfo.highestQualification}</div>
                              <div><strong>Graduating Academy:</strong> {educationInfo.institution} (Class of {educationInfo.yearOfGraduation})</div>
                              <div><strong>Work duration:</strong> {educationInfo.yearsOfExperience || '0'} Years</div>
                              <div><strong>Active Sponsor:</strong> {educationInfo.currentEmployer || 'Unemployed'}</div>
                              <div className="apply-review-clamp"><strong>Dossier:</strong> {educationInfo.workSummary}</div>
                            </div>
                          </div>

                          <div className="apply-review-card apply-review-card-full">
                            <h4 className="apply-review-heading">Attached Dossier Files</h4>
                            <div className="apply-attached-grid">
                              {Object.entries(documents).map(([key, doc]) => (
                                <div key={key} className="apply-attached-item">
                                  <Check className="apply-attached-check" />
                                  <span className="apply-attached-name">{key}: {doc?.name}</span>
                                </div>
                              ))}
                              {Object.keys(documents).length === 0 && (
                                <span className="apply-attached-empty">None configured or attached.</span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Declaration */}
                        <div className="apply-declaration">
                          <label className="apply-declaration-label">
                            <input type="checkbox" required checked={declaration}
                              onChange={(e) => setDeclaration(e.target.checked)}
                              className="apply-checkbox" id="legal-declaration-box" />
                            <span className="apply-declaration-text">
                              Declaration Statement: I hereby declare that all entries, file attachments, qualifications, and national identity particulars provided under this 3DEES career profile are valid, uncompromised, and factual. I understand background discrepancies disqualify my candidacy.
                            </span>
                          </label>
                        </div>
                      </div>
                    )}

                    {/* Nav Buttons */}
                    <div className="apply-nav-row">
                      {step > 1 ? (
                        <button type="button" onClick={handleBack} className="apply-back-btn" id="form-back-btn">
                          <ChevronLeft className="apply-nav-icon" />
                          <span>Back</span>
                        </button>
                      ) : <div />}

                      {step < 4 ? (
                        <button type="button" onClick={handleNext} className="apply-next-btn" id="form-next-btn">
                          <span>Next Step</span>
                          <ChevronRight className="apply-nav-icon" />
                        </button>
                      ) : (
                        <button type="submit" disabled={isSubmitting || !declaration}
                          className={`apply-submit-btn ${declaration && !isSubmitting ? 'apply-submit-active' : 'apply-submit-disabled'}`}
                          id="form-submit-btn">
                          {isSubmitting ? (
                            <>
                              <svg className="apply-spinner" fill="none" viewBox="0 0 24 24">
                                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                              </svg>
                              <span>Encrypting & Saving Dossier...</span>
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
              3DEES Consulting works enforces strict biometric and qualification compliance checkpoints.
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