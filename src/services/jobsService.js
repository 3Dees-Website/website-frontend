import api from './api';

// Map snake_case API response → camelCase frontend shape.
const normalizeJob = (job) => ({
  id: job.id,
  title: job.title,
  clientOrg: job.client_org,
  category: job.category,
  type: job.type,
  location: job.location,
  openings: job.openings,
  salaryRange: job.salary_range,
  description: job.description,
  responsibilities: job.responsibilities,
  requirements: job.requirements,
  closingDate: job.closing_date,
  status: job.status,
  postedBy: job.posted_by,
  applicationRequirements: job.application_requirements,
  createdAt: job.created_at,
  isExpired: job.is_expired,
});

export const jobsService = {
  // ── Public (no auth) ──────────────────────────────────────────────────────

  /** List all Active jobs. Accepts optional { search, category, location, type }. */
  getJobs: async (params = {}) => {
    const { data } = await api.get('/jobs', { params });
    return data.data.map(normalizeJob);
  },

  /** Fetch a single job by ID (works for any status). */
  getJob: async (id) => {
    const { data } = await api.get(`/jobs/${id}`);
    return normalizeJob(data.data);
  },
};
