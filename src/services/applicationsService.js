import api from './api';

export const applicationsService = {
  // ── Public (no auth) ──────────────────────────────────────────────────────

  /**
   * Submit a job application.
   * @param {FormData} formData - jobId plus one flat field per answer key and per file (no JSON blobs).
   * @returns {{ id, referenceId, status }}
   */
  submitApplication: async (formData) => {
    const { data } = await api.post('/applications', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data.data;
  },
};
