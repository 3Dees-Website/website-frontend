import { useEffect, useState } from 'react';
import { jobsService } from '../services/jobsService';
import { useToast } from './useToast';

// Jobs already fetched this session, so JobDetail -> Apply (or back) does not
// request the same job twice. A reload starts empty.
const jobCache = new Map();

// The API answers a malformed id with a 500, so catch those here as "not found".
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// A single job by id. `notFound` means the API said the job is not open (404 or
// a malformed id); `error` is any other failure.
export function useJob(id) {
  const { addToast } = useToast();
  const [state, setState] = useState({ id: null, job: null, notFound: false, error: null });
  const cached = (id && jobCache.get(id)) || null;

  useEffect(() => {
    if (!UUID.test(id ?? '') || jobCache.has(id)) return undefined;
    const controller = new AbortController();

    jobsService
      .getJob(id, { signal: controller.signal })
      .then((job) => {
        jobCache.set(id, job);
        setState({ id, job, notFound: false, error: null });
      })
      .catch((err) => {
        if (controller.signal.aborted) return;
        const notFound = err.status === 404 || err.status === 400;
        setState({ id, job: null, notFound, error: notFound ? null : err });
        if (!notFound) {
          addToast('error', 'Connection Error', 'Could not load this vacancy. Please check your connection.');
        }
      });

    return () => controller.abort();
  }, [id, addToast]);

  if (cached) return { job: cached, isLoading: false, notFound: false, error: null };
  if (!UUID.test(id ?? '')) return { job: null, isLoading: false, notFound: true, error: null };
  if (state.id !== id) return { job: null, isLoading: true, notFound: false, error: null };
  return { job: state.job, isLoading: false, notFound: state.notFound, error: state.error };
}
