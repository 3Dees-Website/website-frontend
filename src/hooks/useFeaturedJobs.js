import { useEffect, useState } from 'react';
import { jobsService } from '../services/jobsService';
import { useToast } from './useToast';

// The first `count` open jobs, newest first — one small request for the home page.
export function useFeaturedJobs(count = 3) {
  const { addToast } = useToast();
  const [state, setState] = useState({ count: null, jobs: [] });

  useEffect(() => {
    const controller = new AbortController();
    jobsService
      .getJobs({ page: 1, pageSize: count, signal: controller.signal })
      .then((r) => setState({ count, jobs: r.items }))
      .catch(() => {
        if (controller.signal.aborted) return;
        setState({ count, jobs: [] });
        addToast('error', 'Connection Error', 'Could not load job listings. Please check your connection.');
      });
    return () => controller.abort();
  }, [count, addToast]);

  return { jobs: state.jobs, isLoading: state.count !== count };
}
