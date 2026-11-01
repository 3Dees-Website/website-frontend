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

  /**
   * One page of open jobs. Accepts { page, pageSize, search, category, type,
   * location, signal }; empty values are not sent. Resolves to
   * { items, page, pageSize, total }.
   */
  getJobs: async ({ signal, ...params } = {}) => {
    const query = Object.fromEntries(
      Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== ''),
    );
    const { data } = await api.get('/jobs', { params: query, signal });
    const { items, page, pageSize, total } = data.data;
    return { items: items.map(normalizeJob), page, pageSize, total };
  },

  /** Category and type options across every open job (not just one page). */
  getJobFilters: async ({ signal } = {}) => {
    const { data } = await api.get('/jobs/filters', { signal });
    return {
      categories: data.data.categories ?? [],
      types: data.data.types ?? [],
    };
  },

  /** Fetch a single job by ID (works for any status). */
  getJob: async (id, { signal } = {}) => {
    const { data } = await api.get(`/jobs/${id}`, { signal });
    return normalizeJob(data.data);
  },
};
