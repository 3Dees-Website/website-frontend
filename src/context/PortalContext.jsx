import { useReducer, useEffect } from 'react';
import { PortalContext } from './portalContextObject';
import { jobsService } from '../services/jobsService';
import { applicationsService } from '../services/applicationsService';
import { fieldCatalogService } from '../services/fieldCatalogService';

const initialState = {
  jobs: [],
  isLoadingJobs: true,
  fieldCatalog: null,       // { sections, fields, mandatoryKeys, lgasByState }
  isLoadingCatalog: true,
  toasts: [],
};

function portalReducer(state, action) {
  switch (action.type) {
    case 'SET_JOBS_LOADING':
      return { ...state, isLoadingJobs: action.payload };
    case 'SET_JOBS':
      return { ...state, jobs: action.payload };
    case 'SET_CATALOG_LOADING':
      return { ...state, isLoadingCatalog: action.payload };
    case 'SET_FIELD_CATALOG':
      return { ...state, fieldCatalog: action.payload };
    case 'ADD_TOAST':
      return { ...state, toasts: [...state.toasts, action.payload] };
    case 'DISMISS_TOAST':
      return { ...state, toasts: state.toasts.filter((t) => t.id !== action.payload) };
    default:
      return state;
  }
}

export function PortalProvider({ children }) {
  const [state, dispatch] = useReducer(portalReducer, initialState);

  // ── Helpers ──────────────────────────────────────────────────────────────

  const toast = (type, title, message) =>
    dispatch({
      type: 'ADD_TOAST',
      payload: { id: Math.random().toString(36).substring(2, 9), type, title, message },
    });

  const addToast = (type, title, message) => toast(type, title, message);
  const removeToast = (id) => dispatch({ type: 'DISMISS_TOAST', payload: id });

  // ── Bootstrap on mount ───────────────────────────────────────────────────

  useEffect(() => {
    // Load public jobs (no auth required).
    jobsService
      .getJobs()
      .then((jobs) => dispatch({ type: 'SET_JOBS', payload: jobs }))
      .catch(() =>
        dispatch({
          type: 'ADD_TOAST',
          payload: {
            id: Math.random().toString(36).substring(2, 9),
            type: 'error',
            title: 'Connection Error',
            message: 'Could not load job listings. Please check your connection.',
          },
        })
      )
      .finally(() => dispatch({ type: 'SET_JOBS_LOADING', payload: false }));

    // Load the field catalog (no auth required, cached by the service).
    fieldCatalogService
      .getCatalog()
      .then((catalog) => dispatch({ type: 'SET_FIELD_CATALOG', payload: catalog }))
      .catch(() =>
        dispatch({
          type: 'ADD_TOAST',
          payload: {
            id: Math.random().toString(36).substring(2, 9),
            type: 'error',
            title: 'Connection Error',
            message: 'Could not load the application form definitions. Please check your connection.',
          },
        })
      )
      .finally(() => dispatch({ type: 'SET_CATALOG_LOADING', payload: false }));
  }, []);

  // ── Applications ──────────────────────────────────────────────────────────

  /**
   * Submit a job application from the public Apply page.
   * `answers` is { [fieldKey]: string|boolean } for every non-file field the
   * applicant answered; `files` is { [fieldKey]: File | File[] } — only
   * `otherDocsUpload` carries an array. One multipart field per answer key
   * (matches how the backend's multer/validator read req.body directly —
   * there is no JSON-blob field to unwrap server-side).
   * Returns the referenceId string.
   */
  const applyToJob = async ({ jobId, answers, files }) => {
    const formData = new FormData();
    formData.append('jobId', jobId);

    Object.entries(answers).forEach(([key, value]) => {
      if (value === undefined || value === null || value === '') return;
      formData.append(key, typeof value === 'boolean' ? String(value) : value);
    });

    Object.entries(files).forEach(([key, fileOrFiles]) => {
      if (!fileOrFiles) return;
      if (Array.isArray(fileOrFiles)) {
        fileOrFiles.forEach((file) => formData.append(key, file));
      } else {
        formData.append(key, fileOrFiles);
      }
    });

    const result = await applicationsService.submitApplication(formData);
    return result.referenceId;
  };

  return (
    <PortalContext.Provider
      value={{
        ...state,
        // Toasts
        addToast,
        removeToast,
        // Applications
        applyToJob,
      }}
    >
      {children}
    </PortalContext.Provider>
  );
}
