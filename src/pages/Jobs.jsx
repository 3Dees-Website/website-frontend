/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useJobsList } from '../hooks/useJobsList';
import { useJobFilters } from '../hooks/useJobFilters';
import { useLoadingGate } from '../hooks/useLoadingGate';
import { Search, MapPin, Briefcase, Calendar, RotateCcw, ChevronRight, Inbox } from 'lucide-react';
import './styles/Jobs.css';

const SEARCH_DEBOUNCE_MS = 350;

export function Jobs() {
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedType, setSelectedType] = useState('All');

  // Typing waits for a pause; dropdown changes apply immediately.
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchInput.trim()), SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const {
    jobs, error, openTotal, hasLoaded, isLoading, isLoadingMore, hasMore, loadMore,
  } = useJobsList({
    search: debouncedSearch,
    category: selectedCategory === 'All' ? '' : selectedCategory,
    type: selectedType === 'All' ? '' : selectedType,
  });
  const filters = useJobFilters();

  // Nothing to show yet -> skeletons straight away. A refetch keeps the previous
  // results on screen and only shows skeletons if it runs past the loading gate.
  const isInitialLoading = isLoading && !hasLoaded;
  const { visible: refetchSkeletons } = useLoadingGate(isLoading && hasLoaded);
  const showSkeletons = isInitialLoading || refetchSkeletons;

  // Whether any job is open at all: the unfiltered page-1 total when we have
  // it, the filter options otherwise (only if that first request failed).
  const hasActiveJobs =
    openTotal !== null ? openTotal > 0 : filters.categories.length > 0 || filters.types.length > 0;

  const categories = ['All', ...filters.categories];
  const types = ['All', ...filters.types];

  const handleResetFilters = () => {
    setSearchInput('');
    setDebouncedSearch('');
    setSelectedCategory('All');
    setSelectedType('All');
  };

  const hasActiveFilters = searchInput || selectedCategory !== 'All' || selectedType !== 'All';

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="jobs-page"
      id="jobs-page"
    >
      <title>Jobs | 3DEES</title>
      {/* Breadcrumbs */}
      <div className="jobs-breadcrumb">
        <Link to="/" className="jobs-breadcrumb-link">Home</Link>
        <ChevronRight className="jobs-breadcrumb-chevron" />
        <span className="jobs-breadcrumb-current">Open Vacancies</span>
      </div>

      {/* Header */}
      <div className="jobs-header">
        <h1 className="jobs-title">Active Recruitment Portals</h1>
        <p className="jobs-subtitle">
          Select open careers across multi-sector corporate sponsor organizations. Fully compliant screening and verification protocols applied to all submissions.
        </p>
      </div>

      {/* Filters Card */}
      {(isInitialLoading || hasActiveJobs) && (
        <div className="jobs-filters-card" id="filter-wrapper-card">
          <div className="jobs-filters-grid">

            <div className="jobs-filter-group">
              <label className="jobs-filter-label">Keyword Search</label>
              <div className="jobs-search-wrapper">
                <Search className="jobs-search-icon" />
                <input
                  type="text"
                  placeholder="Job title, client, keyword..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="jobs-search-input"
                  id="search-input-field"
                />
              </div>
            </div>

            <div className="jobs-filter-group">
              <label className="jobs-filter-label">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="jobs-select"
                id="filter-category-select"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat === 'All' ? 'All Categories' : cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="jobs-filter-group">
              <label className="jobs-filter-label">Employment Type</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="jobs-select"
                id="filter-type-select"
              >
                {types.map((tp) => (
                  <option key={tp} value={tp}>
                    {tp === 'All' ? 'All Types' : tp}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {hasActiveFilters && (
            <div className="jobs-reset-row">
              <button
                onClick={handleResetFilters}
                className="jobs-reset-btn"
                id="reset-filters-btn"
              >
                <RotateCcw className="jobs-reset-icon" />
                <span>Reset Filters</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Job Listings */}
      <div className="jobs-listings">
        {showSkeletons && (
          <div className="jobs-loading" aria-live="polite">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="job-card job-card-skeleton" aria-hidden="true">
                <div className="skeleton-line skeleton-line-short" />
                <div className="skeleton-line skeleton-line-long" />
                <div className="skeleton-line skeleton-line-medium" />
              </div>
            ))}
          </div>
        )}
        <AnimatePresence mode="popLayout">
          {!showSkeletons && jobs.length > 0 ? (
            <div className="jobs-grid" id="job-listing-container">
              {jobs.map((job) => (
                <motion.div
                  key={job.id}
                  layout
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="job-card"
                  id={`job-card-${job.id}`}
                >
                  <div>
                    <div className="job-card-top">
                      <span className="job-category-badge">{job.category}</span>
                      <span className="job-posted-date">
                        Posted {new Date(job.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <h3 className="job-card-title">{job.title}</h3>
                    <div className="job-card-org">{job.clientOrg}</div>

                    <p className="job-card-desc">{job.description}</p>

                    <div className="job-card-meta">
                      <div className="job-meta-item">
                        <MapPin className="job-meta-icon" />
                        <span>{job.location}</span>
                      </div>
                      <div className="job-meta-item">
                        <Briefcase className="job-meta-icon" />
                        <span>{job.type}</span>
                      </div>
                      <div className="job-meta-item job-meta-full">
                        <Calendar className="job-meta-icon" />
                        <span>Deadline: <strong className="job-meta-deadline">{new Date(job.closingDate).toLocaleDateString()}</strong></span>
                      </div>
                    </div>
                  </div>

                  <div className="job-card-actions">
                    <Link
                      to={`/jobs/${job.id}`}
                      className="job-btn-detail"
                      id={`job-detail-btn-${job.id}`}
                    >
                      View Details
                    </Link>
                    <Link
                      to={`/apply/${job.id}`}
                      className="job-btn-apply"
                      id={`job-apply-btn-${job.id}`}
                    >
                      Apply Now
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : !showSkeletons ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="jobs-empty"
              id="empty-jobs-view"
            >
              <div className="jobs-empty-icon-wrap">
                <Inbox className="jobs-empty-icon" />
              </div>
              {error ? (
                <>
                  <h3 className="jobs-empty-title">Could Not Load Vacancies</h3>
                  <p className="jobs-empty-desc">
                    Something went wrong reaching the server. Please check your connection and try again shortly.
                  </p>
                </>
              ) : hasActiveJobs ? (
                <>
                  <h3 className="jobs-empty-title">No Vacancies Matched</h3>
                  <p className="jobs-empty-desc">
                    We could not locate active recruitment projects matching your current filters. Try a different keyword, category or employment type.
                  </p>
                  <button onClick={handleResetFilters} className="jobs-empty-btn">
                    Clear Search & View All
                  </button>
                </>
              ) : (
                <>
                  <h3 className="jobs-empty-title">No Open Positions Right Now</h3>
                  <p className="jobs-empty-desc">
                    There are currently no active job openings. Check back soon.
                  </p>
                </>
              )}
            </motion.div>
          ) : null}
        </AnimatePresence>

        {/* Load More */}
        {!showSkeletons && hasMore && (
          <div className="jobs-load-more-row">
            <button
              onClick={loadMore}
              disabled={isLoadingMore}
              className="jobs-load-more-btn"
              id="load-more-btn"
            >
              {isLoadingMore ? 'Loading…' : 'Load More Vacancies'}
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}