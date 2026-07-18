/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, AnimatePresence } from 'motion/react';
import { Upload, FileCheck, X } from 'lucide-react';
import { getSubfieldsOf, validateFile, deriveAge } from '../utils/fieldCatalogHelpers';
import '../pages/styles/Apply.css';

/**
 * Renders a single catalog field's input control, driven entirely by the
 * field's `type`. Also recurses to render an experience-trio's Years/Detail/
 * Proof sub-fields (animated in/out) directly beneath a "Yes"-answered
 * yesno field.
 */
export function FieldRenderer({
  field,
  required,
  answers,
  files,
  errors,
  catalog,
  onAnswerChange,
  onFileChange,
  onFileAdd,
  onFileRemoveAt,
  addToast,
}) {
  const value = answers[field.key];
  const error = errors[field.key];
  const labelNode = (
    <label className="apply-label">
      {field.label} {required ? <span className="apply-required">*</span> : <span className="apply-optional">(Optional)</span>}
    </label>
  );

  const handleTextLikeChange = (e) => onAnswerChange(field.key, e.target.value);

  switch (field.type) {
    case 'text':
    case 'tel':
    case 'email': {
      return (
        <div className="apply-field">
          {labelNode}
          <input
            type={field.type === 'email' ? 'email' : field.type === 'tel' ? 'tel' : 'text'}
            value={value ?? ''}
            onChange={handleTextLikeChange}
            className={`apply-input ${error ? 'apply-input-err' : ''}`}
          />
          {error && <span className="apply-error-msg">{error}</span>}
        </div>
      );
    }

    case 'textarea': {
      return (
        <div className="apply-field apply-field-full">
          {labelNode}
          <textarea
            rows={3}
            value={value ?? ''}
            onChange={handleTextLikeChange}
            className={`apply-textarea ${error ? 'apply-input-err' : ''}`}
          />
          {error && <span className="apply-error-msg">{error}</span>}
        </div>
      );
    }

    case 'number':
    case 'year': {
      return (
        <div className="apply-field">
          {labelNode}
          <input
            type="number"
            value={value ?? ''}
            min={field.validation?.min}
            max={field.validation?.max}
            onChange={handleTextLikeChange}
            className={`apply-input ${error ? 'apply-input-err' : ''}`}
          />
          {error && <span className="apply-error-msg">{error}</span>}
        </div>
      );
    }

    case 'date': {
      const isDob = field.key === 'dateOfBirth';
      const age = isDob ? deriveAge(value) : null;
      return (
        <div className="apply-field">
          {labelNode}
          <input
            type="date"
            value={value ?? ''}
            onChange={handleTextLikeChange}
            className={`apply-input ${error ? 'apply-input-err' : ''}`}
          />
          {isDob && age !== null && (
            <span className="apply-age-preview">Age: {age} years</span>
          )}
          {error && <span className="apply-error-msg">{error}</span>}
        </div>
      );
    }

    case 'select': {
      if (field.key === 'lga') {
        const stateValue = answers.stateOfOrigin;
        const lgaOptions = stateValue ? catalog.lgasByState?.[stateValue] : null;
        if (!lgaOptions || lgaOptions.length === 0) {
          // Falls back to free text when the state isn't selected/known yet.
          return (
            <div className="apply-field">
              {labelNode}
              <input
                type="text"
                placeholder={stateValue ? 'Enter your LGA' : 'Select a State of Origin first'}
                value={value ?? ''}
                onChange={handleTextLikeChange}
                className={`apply-input ${error ? 'apply-input-err' : ''}`}
              />
              {error && <span className="apply-error-msg">{error}</span>}
            </div>
          );
        }
        return (
          <div className="apply-field">
            {labelNode}
            <select
              value={value ?? ''}
              onChange={handleTextLikeChange}
              className={`apply-select ${error ? 'apply-input-err' : ''}`}
            >
              <option value="">Select LGA</option>
              {lgaOptions.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
            {error && <span className="apply-error-msg">{error}</span>}
          </div>
        );
      }

      return (
        <div className="apply-field">
          {labelNode}
          <select
            value={value ?? ''}
            onChange={handleTextLikeChange}
            className={`apply-select ${error ? 'apply-input-err' : ''}`}
          >
            <option value="">Select {field.label}</option>
            {field.options?.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
          {error && <span className="apply-error-msg">{error}</span>}
        </div>
      );
    }

    case 'yesno': {
      const subfields = getSubfieldsOf(catalog, field.key);
      return (
        <div className={`apply-field ${subfields.length ? 'apply-field-full' : ''}`}>
          {labelNode}
          <div className="apply-yesno-group">
            {['Yes', 'No'].map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => onAnswerChange(field.key, opt)}
                className={`apply-yesno-btn ${value === opt ? 'apply-yesno-active' : ''}`}
                aria-pressed={value === opt}
              >
                {opt}
              </button>
            ))}
          </div>
          {error && <span className="apply-error-msg">{error}</span>}

          <AnimatePresence initial={false}>
            {subfields.length > 0 && value === 'Yes' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25, ease: 'easeInOut' }}
                className="apply-experience-trio"
              >
                {subfields.map((sub) => (
                  <FieldRenderer
                    key={sub.key}
                    field={sub}
                    required={false}
                    answers={answers}
                    files={files}
                    errors={errors}
                    catalog={catalog}
                    onAnswerChange={onAnswerChange}
                    onFileChange={onFileChange}
                    onFileAdd={onFileAdd}
                    onFileRemoveAt={onFileRemoveAt}
                    addToast={addToast}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      );
    }

    case 'declaration': {
      return (
        <div className="apply-declaration">
          <label className="apply-declaration-label">
            <input
              type="checkbox"
              checked={value === true}
              onChange={(e) => onAnswerChange(field.key, e.target.checked)}
              className="apply-checkbox"
            />
            <span className="apply-declaration-text">
              {field.label} {required && <span className="apply-required">*</span>}
            </span>
          </label>
          {error && <span className="apply-error-msg">{error}</span>}
        </div>
      );
    }

    case 'file': {
      const accept = field.validation?.mimeTypes?.join(',');
      const maxFiles = field.multiple ? (field.validation?.maxFiles ?? 5) : 1;
      const current = files[field.key];
      const currentList = field.multiple ? (current || []) : (current ? [current] : []);

      const handlePick = (e) => {
        const picked = Array.from(e.target.files || []);
        e.target.value = ''; // allow re-picking the same file after removal
        picked.forEach((file) => {
          const err = validateFile(field, file);
          if (err) {
            addToast('error', 'File Upload Error', err);
            return;
          }
          if (field.multiple) {
            if (currentList.length >= maxFiles) {
              addToast('error', 'File Upload Error', `Maximum of ${maxFiles} files.`);
              return;
            }
            onFileAdd(field.key, file);
          } else {
            onFileChange(field.key, file);
          }
        });
      };

      return (
        <div className="apply-doc-block">
          <span className="apply-doc-label">
            {field.label} {required ? <span className="apply-required">*</span> : <span className="apply-optional">(Optional)</span>}
          </span>

          {(!field.multiple ? currentList.length === 0 : currentList.length < maxFiles) && (
            <label className="apply-upload-btn">
              <Upload className="apply-upload-icon" />
              <span>{field.multiple ? 'Attach File' : 'Choose File'}</span>
              <input
                type="file"
                multiple={field.multiple}
                accept={accept}
                onChange={handlePick}
                className="apply-file-hidden"
              />
            </label>
          )}

          {currentList.length > 0 && (
            <div className="apply-doc-list">
              {currentList.map((file, idx) => (
                <div key={`${file.name}-${idx}`} className="apply-doc-attached">
                  <FileCheck className="apply-doc-check" />
                  <span className="apply-doc-name">
                    {file.name} ({(file.size / (1024 * 1024)).toFixed(1)} MB)
                  </span>
                  <button
                    type="button"
                    className="apply-doc-remove"
                    onClick={() => onFileRemoveAt(field.key, field.multiple ? idx : undefined)}
                    aria-label={`Remove ${file.name}`}
                  >
                    <X className="apply-doc-remove-icon" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {field.multiple && (
            <span className="apply-doc-hint">{currentList.length}/{maxFiles} files attached</span>
          )}
          {error && <span className="apply-error-msg">{error}</span>}
        </div>
      );
    }

    default:
      return null;
  }
}
