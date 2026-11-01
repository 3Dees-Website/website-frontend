import { useCallback, useEffect, useRef, useState } from 'react';
import { jobsService } from '../services/jobsService';
import { useToast } from './useToast';

export const JOBS_PAGE_SIZE = 12;

// Server-paginated list for the Jobs page. A change to search/category/type
// fetches page 1 and replaces the list; loadMore fetches the next page and
// appends. `isLoading` covers every page-1 fetch, `hasLoaded` flips once the
// first response (or failure) is in, so the page can keep showing the previous
// results while a refetch is in flight.
export function useJobsList({ search = '', category = '', type = '', pageSize = JOBS_PAGE_SIZE } = {}) {
  const { addToast } = useToast();
  const key = JSON.stringify([search, category, type, pageSize]);
  const isUnfiltered = !search && !category && !type;

  // `key` records which filter set the stored jobs belong to; the list is
  // loading whenever it differs from the current one.
  const [state, setState] = useState({
    key: null, jobs: [], total: 0, page: 0, pageSize, error: null, openTotal: null,
  });
  const [moreKey, setMoreKey] = useState(null);
  const moreAbort = useRef(null);

  useEffect(() => {
    const controller = new AbortController();
    moreAbort.current?.abort();

    jobsService
      .getJobs({ page: 1, pageSize, search, category, type, signal: controller.signal })
      .then((r) =>
        setState((prev) => ({
          key,
          jobs: r.items,
          total: r.total,
          page: r.page,
          pageSize: r.pageSize,
          error: null,
          // The unfiltered total is what tells "no vacancies matched" from "no vacancies".
          openTotal: isUnfiltered ? r.total : prev.openTotal,
        })),
      )
      .catch((err) => {
        if (controller.signal.aborted) return;
        setState((prev) => ({ ...prev, key, jobs: [], total: 0, page: 0, error: err }));
        addToast('error', 'Connection Error', 'Could not load job listings. Please check your connection.');
      });

    return () => controller.abort();
  }, [key, search, category, type, pageSize, isUnfiltered, addToast]);

  const isLoading = state.key !== key;
  const isLoadingMore = moreKey === key;
  // The server's page size is authoritative (it may clamp the one requested).
  const hasMore = !isLoading && state.page * state.pageSize < state.total;

  const loadMore = useCallback(() => {
    if (isLoading || isLoadingMore || !hasMore) return;
    const controller = new AbortController();
    moreAbort.current = controller;
    setMoreKey(key);

    jobsService
      .getJobs({ page: state.page + 1, pageSize: state.pageSize, search, category, type, signal: controller.signal })
      .then((r) => {
        setState((prev) => {
          const seen = new Set(prev.jobs.map((j) => j.id));
          return {
            ...prev,
            jobs: [...prev.jobs, ...r.items.filter((j) => !seen.has(j.id))],
            total: r.total,
            page: r.page,
          };
        });
        setMoreKey(null);
      })
      .catch((err) => {
        if (controller.signal.aborted) return;
        setMoreKey(null);
        addToast('error', 'Connection Error', err.message || 'Could not load more vacancies.');
      });
  }, [isLoading, isLoadingMore, hasMore, key, state.page, state.pageSize, search, category, type, addToast]);

  return {
    jobs: state.jobs,
    total: state.total,
    error: state.error,
    openTotal: state.openTotal,
    hasLoaded: state.key !== null,
    isLoading,
    isLoadingMore,
    hasMore,
    loadMore,
  };
}
