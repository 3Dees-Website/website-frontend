import { useEffect, useState } from 'react';
import { jobsService } from '../services/jobsService';

// Category and type options for the Jobs page dropdowns, fetched once on mount.
// Failure leaves the lists empty; the jobs list reports its own errors.
export function useJobFilters() {
  const [state, setState] = useState({ done: false, categories: [], types: [] });

  useEffect(() => {
    const controller = new AbortController();
    jobsService
      .getJobFilters({ signal: controller.signal })
      .then((f) => setState({ done: true, ...f }))
      .catch(() => {
        if (!controller.signal.aborted) setState({ done: true, categories: [], types: [] });
      });
    return () => controller.abort();
  }, []);

  return { categories: state.categories, types: state.types, isLoading: !state.done };
}
