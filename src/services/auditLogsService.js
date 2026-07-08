import api from './api';

const normalizeLog = (log) => ({
  id: log.id,
  applicationId: log.application_id,
  applicantName: log.applicant_name,
  jobTitle: log.job_title,
  prevStatus: log.prev_status,
  newStatus: log.new_status,
  changedBy: log.changed_by,
  timestamp: log.timestamp,
});

export const auditLogsService = {
  /** List all status-change audit entries. Accepts optional { search, status, officer }. */
  getLogs: async (params = {}) => {
    const { data } = await api.get('/admin/audit-logs', { params });
    return data.data.map(normalizeLog);
  },

  /** Download CSV of audit logs as a Blob. */
  exportLogs: (params = {}) =>
    api
      .get('/admin/audit-logs/export', { params, responseType: 'blob' })
      .then((r) => r.data),
};
