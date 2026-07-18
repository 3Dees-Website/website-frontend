import { createContext, useReducer, useEffect } from 'react';
import { authService } from '../services/authService';
import { jobsService } from '../services/jobsService';
import { applicationsService } from '../services/applicationsService';
import { usersService } from '../services/usersService';
import { auditLogsService } from '../services/auditLogsService';
import { fieldCatalogService } from '../services/fieldCatalogService';

const initialState = {
  currentUser: null,
  token: null,              // access token (15 min TTL)
  pendingAuthToken: null,   // holds pendingToken between OTP login steps
  jobs: [],
  isLoadingJobs: true,
  fieldCatalog: null,       // { sections, fields, mandatoryKeys, lgasByState }
  isLoadingCatalog: true,
  applications: [],
  admins: [],
  auditLogs: [],
  toasts: [],
};

function portalReducer(state, action) {
  switch (action.type) {
    case 'SET_AUTH':
      return {
        ...state,
        currentUser: action.payload ? action.payload.user : null,
        token: action.payload ? action.payload.token : null,
        pendingAuthToken: null,
      };
    case 'SET_PENDING_AUTH':
      return { ...state, pendingAuthToken: action.payload };
    case 'SET_JOBS_LOADING':
      return { ...state, isLoadingJobs: action.payload };
    case 'SET_JOBS':
      return { ...state, jobs: action.payload };
    case 'SET_CATALOG_LOADING':
      return { ...state, isLoadingCatalog: action.payload };
    case 'SET_FIELD_CATALOG':
      return { ...state, fieldCatalog: action.payload };
    case 'ADD_JOB':
      return { ...state, jobs: [...state.jobs, action.payload] };
    case 'UPDATE_JOB':
      return {
        ...state,
        jobs: state.jobs.map((j) => (j.id === action.payload.id ? action.payload : j)),
      };
    case 'DELETE_JOB':
      return { ...state, jobs: state.jobs.filter((j) => j.id !== action.payload) };
    case 'SET_APPLICATIONS':
      return { ...state, applications: action.payload };
    case 'UPDATE_APPLICATION_STATUS':
      return {
        ...state,
        applications: state.applications.map((app) =>
          app.id === action.payload.id ? action.payload : app
        ),
      };
    case 'BULK_UPDATE_APPLICATIONS':
      return {
        ...state,
        applications: state.applications.map((app) =>
          action.payload.updatedMap[app.id] ? action.payload.updatedMap[app.id] : app
        ),
      };
    case 'SET_ADMINS':
      return { ...state, admins: action.payload };
    case 'ADD_ADMIN':
      return { ...state, admins: [...state.admins, action.payload] };
    case 'UPDATE_ADMIN':
      return {
        ...state,
        admins: state.admins.map((a) => (a.id === action.payload.id ? action.payload : a)),
      };
    case 'DELETE_ADMIN':
      return { ...state, admins: state.admins.filter((a) => a.id !== action.payload) };
    case 'SET_AUDIT_LOGS':
      return { ...state, auditLogs: action.payload };
    case 'ADD_TOAST':
      return { ...state, toasts: [...state.toasts, action.payload] };
    case 'DISMISS_TOAST':
      return { ...state, toasts: state.toasts.filter((t) => t.id !== action.payload) };
    default:
      return state;
  }
}

export const PortalContext = createContext(undefined);

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
    // One-time migration: remove keys written by the old localStorage-based system.
    ['3dees_users', '3dees_jobs', '3dees_applications', '3dees_audit_log', '3dees_token'].forEach(
      (key) => localStorage.removeItem(key)
    );

    // Restore persisted auth state (tokens survive page refresh).
    const storedUser = localStorage.getItem('3dees_current_user');
    const storedToken = localStorage.getItem('3dees_access_token');
    if (storedUser && storedToken) {
      dispatch({
        type: 'SET_AUTH',
        payload: { user: JSON.parse(storedUser), token: storedToken },
      });
    }

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

    // Clear auth state when the refresh token becomes invalid.
    const handleSessionExpired = () => {
      dispatch({ type: 'SET_AUTH', payload: null });
      dispatch({
        type: 'ADD_TOAST',
        payload: {
          id: Math.random().toString(36).substring(2, 9),
          type: 'warning',
          title: 'Session Expired',
          message: 'Your session has expired. Please log in again.',
        },
      });
    };

    window.addEventListener('auth:session-expired', handleSessionExpired);
    return () => window.removeEventListener('auth:session-expired', handleSessionExpired);
  }, []);

  // ── Auth ─────────────────────────────────────────────────────────────────

  /**
   * Step 1 — validate credentials and trigger OTP email.
   * Returns { pendingToken, destination } on success; throws on failure.
   */
  const login = async (email, password) => {
    const result = await authService.login(email, password);
    dispatch({ type: 'SET_PENDING_AUTH', payload: result.pendingToken });
    return result; // { pendingToken, destination }
  };

  /**
   * Step 2 — submit the OTP to obtain access + refresh tokens.
   * Returns true on success; throws on failure.
   */
  const verifyOtp = async (pendingToken, otpCode) => {
    const result = await authService.verifyOtp(pendingToken, otpCode);
    const { accessToken, refreshToken, user } = result;

    localStorage.setItem('3dees_access_token', accessToken);
    localStorage.setItem('3dees_refresh_token', refreshToken);
    localStorage.setItem('3dees_current_user', JSON.stringify(user));

    dispatch({ type: 'SET_AUTH', payload: { user, token: accessToken } });
    toast('success', 'Logged In Successfully', `Welcome back, ${user.name}`);

    // Eagerly load admin data after successful login.
    loadAdminData();
    return true;
  };

  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem('3dees_refresh_token');
      if (refreshToken) await authService.logout(refreshToken);
    } catch {
      // Ignore logout API errors — always clear local state.
    }

    localStorage.removeItem('3dees_access_token');
    localStorage.removeItem('3dees_refresh_token');
    localStorage.removeItem('3dees_current_user');
    dispatch({ type: 'SET_AUTH', payload: null });
    toast('info', 'Logged Out', 'You have been securely logged out.');
  };

  // ── Admin data loader ─────────────────────────────────────────────────────

  const loadAdminData = async () => {
    try {
      const [applications, admins, auditLogs] = await Promise.all([
        applicationsService.getApplications(),
        usersService.getUsers(),
        auditLogsService.getLogs(),
      ]);
      dispatch({ type: 'SET_APPLICATIONS', payload: applications });
      dispatch({ type: 'SET_ADMINS', payload: admins });
      dispatch({ type: 'SET_AUDIT_LOGS', payload: auditLogs });
    } catch {
      // Admin data load failure is non-fatal; the UI shows empty states.
    }
  };

  const refreshAdminData = () => loadAdminData();

  // ── Jobs (admin) ──────────────────────────────────────────────────────────

  const postJob = async (jobData) => {
    const newJob = await jobsService.adminCreateJob(jobData);
    dispatch({ type: 'ADD_JOB', payload: newJob });
    toast('success', 'Job Posted', `"${newJob.title}" has been successfully published.`);
    // Refresh to include all statuses in the admin view.
    jobsService.adminGetJobs().then((jobs) => dispatch({ type: 'SET_JOBS', payload: jobs }));
  };

  const editJob = async (id, jobData) => {
    const updated = await jobsService.adminUpdateJob(id, jobData);
    dispatch({ type: 'UPDATE_JOB', payload: updated });
    toast('success', 'Job Updated', `Changes to "${updated.title}" saved.`);
  };

  const removeJob = async (jobId) => {
    const target = state.jobs.find((j) => j.id === jobId);
    await jobsService.adminDeleteJob(jobId);
    dispatch({ type: 'DELETE_JOB', payload: jobId });
    toast('info', 'Job Deleted', `"${target?.title || 'Job'}" was removed.`);
  };

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

  const reviewApplication = async (appId, status, notes) => {
    const adminName = state.currentUser?.name || 'Admin';
    const updated = await applicationsService.updateStatus(appId, status, notes, adminName);
    dispatch({ type: 'UPDATE_APPLICATION_STATUS', payload: updated });
    toast('info', 'Status Updated', `Application status set to ${status}.`);

    if (status === 'Approved') {
      toast('success', 'Client Sync Queued', 'Approved candidate synced to EGI Portal.');
    }

    // Reload logs to reflect the new audit entry.
    auditLogsService.getLogs().then((logs) =>
      dispatch({ type: 'SET_AUDIT_LOGS', payload: logs })
    );
  };

  const bulkReviewApplications = async (appIds, status) => {
    const adminName = state.currentUser?.name || 'Admin';
    const result = await applicationsService.bulkUpdateStatus(appIds, status, adminName);

    // Rebuild succeeded applications from the full list via a reload.
    applicationsService.getApplications().then((apps) =>
      dispatch({ type: 'SET_APPLICATIONS', payload: apps })
    );

    const successCount = result.success?.length ?? appIds.length;
    const failCount = result.failed?.length ?? 0;

    toast(
      failCount ? 'warning' : 'success',
      'Bulk Action Complete',
      `${successCount} updated to ${status}${failCount ? `, ${failCount} failed.` : '.'}`
    );

    auditLogsService.getLogs().then((logs) =>
      dispatch({ type: 'SET_AUDIT_LOGS', payload: logs })
    );
  };

  // ── Admin users ───────────────────────────────────────────────────────────

  const registerAdmin = async (name, email, password, role = 'admin') => {
    const newAdmin = await usersService.createUser({ name, email, password, role });
    dispatch({ type: 'ADD_ADMIN', payload: newAdmin });
    toast('success', 'Admin Account Created', `${name} has been added.`);
    return true;
  };

  const toggleAdminSuspension = async (adminId) => {
    const updated = await usersService.toggleStatus(adminId);
    dispatch({ type: 'UPDATE_ADMIN', payload: updated });
    toast('info', 'Status Changed', `${updated.name}'s account is now ${updated.status}.`);
  };

  const resetAdminPass = async (adminId, newPassword) => {
    await usersService.resetPassword(adminId, newPassword);
    toast('success', 'Password Updated', 'Administrator password has been reset.');
  };

  const removeAdmin = async (adminId) => {
    const target = state.admins.find((a) => a.id === adminId);
    await usersService.deleteUser(adminId);
    dispatch({ type: 'DELETE_ADMIN', payload: adminId });
    toast('info', 'Admin Deleted', `${target?.name || 'Admin'} account was deleted.`);
  };

  return (
    <PortalContext.Provider
      value={{
        ...state,
        // Auth
        login,
        verifyOtp,
        logout,
        // Toasts
        addToast,
        removeToast,
        // Jobs
        postJob,
        editJob,
        removeJob,
        // Applications
        applyToJob,
        reviewApplication,
        bulkReviewApplications,
        // Admin users
        registerAdmin,
        toggleAdminSuspension,
        resetAdminPass,
        removeAdmin,
        // Data refresh
        refreshAdminData,
      }}
    >
      {children}
    </PortalContext.Provider>
  );
}
