/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useJobs } from '../hooks/useJobs';
import { Search, MapPin, Briefcase, Calendar, RotateCcw, ChevronRight, Inbox } from 'lucide-react';
import './styles/Jobs.css';

export function Jobs() {
  const { jobs, isLoadingJobs } = useJobs();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [visibleCount, setVisibleCount] = useState(6);

  const categories = useMemo(() => {
    const activeJobs = jobs.filter((j) => j.status === 'Active');
    const set = new Set(activeJobs.map((j) => j.category));
    return ['All', ...Array.from(set)];
  }, [jobs]);

  const locations = useMemo(() => {
    const activeJobs = jobs.filter((j) => j.status === 'Active');
    const set = new Set(activeJobs.map((j) => j.location.split(' ')[0]));
    return ['All', ...Array.from(set)];
  }, [jobs]);

  const types = useMemo(() => {
    const activeJobs = jobs.filter((j) => j.status === 'Active');
    const set = new Set(activeJobs.map((j) => j.type));
    return ['All', ...Array.from(set)];
  }, [jobs]);

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      if (job.status !== 'Active') return false;
      const matchesSearch =
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.clientOrg.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || job.category === selectedCategory;
      const matchesLocation = selectedLocation === 'All' || job.location.startsWith(selectedLocation);
      const matchesType = selectedType === 'All' || job.type === selectedType;
      return matchesSearch && matchesCategory && matchesLocation && matchesType;
    });
  }, [jobs, searchTerm, selectedCategory, selectedLocation, selectedType]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setSelectedLocation('All');
    setSelectedType('All');
    setVisibleCount(6);
  };

  const paginatedJobs = filteredJobs.slice(0, visibleCount);
  const hasActiveFilters = searchTerm || selectedCategory !== 'All' || selectedLocation !== 'All' || selectedType !== 'All';

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="jobs-page"
      id="jobs-page"
    >
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
      <div className="jobs-filters-card" id="filter-wrapper-card">
        <div className="jobs-filters-grid">

          <div className="jobs-filter-group">
            <label className="jobs-filter-label">Keyword Search</label>
            <div className="jobs-search-wrapper">
              <Search className="jobs-search-icon" />
              <input
                type="text"
                placeholder="Job title, client, keyword..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
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
            <label className="jobs-filter-label">State Location</label>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="jobs-select"
              id="filter-location-select"
            >
              {locations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc === 'All' ? 'All States' : loc}
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

      {/* Job Listings */}
      <div className="jobs-listings">
        {isLoadingJobs && (
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
          {!isLoadingJobs && filteredJobs.length > 0 ? (
            <div className="jobs-grid" id="job-listing-container">
              {paginatedJobs.map((job) => (
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
          ) : !isLoadingJobs ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="jobs-empty"
              id="empty-jobs-view"
            >
              <div className="jobs-empty-icon-wrap">
                <Inbox className="jobs-empty-icon" />
              </div>
              <h3 className="jobs-empty-title">No Vacancies Matched</h3>
              <p className="jobs-empty-desc">
                We could not locate active recruitment projects matching your current filters. Try relaxing keywords or state parameters.
              </p>
              <button onClick={handleResetFilters} className="jobs-empty-btn">
                Clear Search & View All
              </button>
            </motion.div>
          ) : null}
        </AnimatePresence>

        {/* Load More */}
        {filteredJobs.length > visibleCount && (
          <div className="jobs-load-more-row">
            <button
              onClick={() => setVisibleCount((prev) => prev + 4)}
              className="jobs-load-more-btn"
              id="load-more-btn"
            >
              Load More Vacancies
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}