import api from './api';

let cachedCatalog = null;
let inflightRequest = null;

/**
 * GET /api/field-catalog — cacheable, so fetched once per page load and
 * reused by every Apply/JobDetail instance regardless of which job is open.
 */
export const fieldCatalogService = {
  getCatalog: async () => {
    if (cachedCatalog) return cachedCatalog;
    if (!inflightRequest) {
      inflightRequest = api
        .get('/field-catalog')
        .then(({ data }) => {
          cachedCatalog = data.data;
          return cachedCatalog;
        })
        .finally(() => {
          inflightRequest = null;
        });
    }
    return inflightRequest;
  },
};
