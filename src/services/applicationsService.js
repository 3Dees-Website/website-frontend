import api from './api';

const normalizeApplication = (app) => ({
  id: app.id,
  jobId: app.job_id,
  referenceId: app.reference_id,
  personalInfo: app.personal_info,
  educationInfo: app.education_info,
  documents: app.documents,
  status: app.status,
  statusHistory: app.status_history,
  notes: app.notes,
  egiSyncStatus: app.egi_sync_status,
  submittedAt: app.submitted_at,
  jobTitle: app.job_title,
  clientOrg: app.client_org,
  category: app.category,
});

export const applicationsService = {
  // ── Public (no auth) ──────────────────────────────────────────────────────

  /**
   * Submit a job application.
   * @param {FormData} formData - Must include jobId, personalInfo (JSON string),
   *   educationInfo (JSON string), and any required document files.
   * @returns {{ id, referenceId, status }}
   */
  submitApplication: async (formData) => {
    const { data } = await api.post('/applications', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data.data;
  },

  // ── Admin (Bearer token required) ────────────────────────────────────────

  /** List all applications. Accepts optional { jobId, status, search }. */
  getApplications: async (params = {}) => {
    const { data } = await api.get('/admin/applications', { params });
    return data.data.map(normalizeApplication);
  },

  /** Download CSV of applications as a Blob. */
  exportApplications: (params = {}) =>
    api
      .get('/admin/applications/export', { params, responseType: 'blob' })
      .then((r) => r.data),

  getApplication: async (id) => {
    const { data } = await api.get(`/admin/applications/${id}`);
    return normalizeApplication(data.data);
  },

  /**
   * Update the status of a single application.
   * Allowed transitions: Pending → Shortlisted/Rejected, Shortlisted → Approved/Rejected.
   */
  updateStatus: async (id, status, notes, changedBy) => {
    const { data } = await api.patch(`/admin/applications/${id}/status`, {
      status,
      notes,
      changedBy,
    });
    return normalizeApplication(data.data);
  },

  /**
   * Bulk-update status for multiple applications.
   * @returns {{ success: string[], failed: { id, reason }[] }}
   */
  bulkUpdateStatus: async (ids, status, changedBy) => {
    const { data } = await api.patch('/admin/applications/bulk-status', {
      ids,
      status,
      changedBy,
    });
    return data.data;
  },
};
