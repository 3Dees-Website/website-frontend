/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { useJobs } from '../hooks/useJobs';
import {
  ArrowRight, CheckCircle, ShieldCheck, Zap, ChevronRight,
  UserPlus, FileText, ClipboardList, Users, ClipboardCheck, Award
} from 'lucide-react';
import './styles/Home.css';

function StatCounter({ end, text, suffix = '+' }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 1.5;
    const endValue = end;
    if (endValue === 0) return;

    const intervalTime = Math.min(50, Math.floor((duration * 1000) / endValue));
    const step = Math.ceil(endValue / (1500 / intervalTime));

    const counterTimer = setInterval(() => {
      start += step;
      if (start >= endValue) {
        setCount(endValue);
        clearInterval(counterTimer);
      } else {
        setCount(start);
      }
    }, intervalTime);

    return () => clearInterval(counterTimer);
  }, [end]);

  return (
    <div className="home-stat-card">
      <span className="home-stat-value">
        {count.toLocaleString()}{suffix}
      </span>
      <span className="home-stat-label">{text}</span>
    </div>
  );
}

export function Home() {
  const { jobs } = useJobs();

  const featuredRoles = jobs.filter((j) => j.status === 'Active').slice(0, 3);

  const steps = [
    { num: '01', title: 'Register',  icon: <UserPlus className="home-step-icon" />,      desc: 'Upload professional CV' },
    { num: '02', title: 'Screen',    icon: <FileText className="home-step-icon" />,       desc: 'Credentials vetting' },
    { num: '03', title: 'Test',      icon: <ClipboardList className="home-step-icon" />,  desc: 'Aptitude evaluation' },
    { num: '04', title: 'Interview', icon: <Users className="home-step-icon" />,          desc: 'Interactive review' },
    { num: '05', title: 'Verify',    icon: <ClipboardCheck className="home-step-icon" />, desc: 'Background check' },
    { num: '06', title: 'Offer',     icon: <Award className="home-step-icon" />,          desc: 'Direct onboarding' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="home-wrapper"
      id="home-page-container"
    >

      {/* ── Hero ── */}
      <section className="home-hero">
        {/* Left */}
        <div className="home-hero-left">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.6 }}
          >
            <span className="home-hero-eyebrow">Bridging the Workforce Gap</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="home-hero-heading"
          >
            Connecting Talent with Opportunity{' '}
            <span className="home-hero-heading-accent">Across Nigeria.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="home-hero-desc"
          >
            A globally competitive workforce solutions provider specialized in mass recruitment, workforce planning, and HR consulting. Browse premium vacancy portals managed by industry veterans.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="home-hero-ctas"
          >
            <Link to="/jobs" className="home-btn-primary" id="hero-cta-browse">
              Browse Open Roles
            </Link>
            <Link to="/about" className="home-btn-outline" id="hero-cta-about">
              Our Process
            </Link>
          </motion.div>
        </div>

        {/* Right */}
        <div className="home-hero-right">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="home-hero-stats-card"
          >
            <div className="home-hero-stats-row">
              <div className="home-hero-stat">
                <div className="home-hero-stat-value">5,000+</div>
                <div className="home-hero-stat-label">Roles Managed</div>
              </div>
              <div className="home-hero-divider" />
              <div className="home-hero-stat">
                <div className="home-hero-stat-value home-hero-stat-dark">16+</div>
                <div className="home-hero-stat-label">Years Active</div>
              </div>
            </div>
            <div className="home-hero-badge">
              Nigeria's Premier Recruitment Partner
            </div>
          </motion.div>
          <div className="home-hero-glow" />
        </div>
      </section>

      {/* ── Intro & Counters ── */}
      <section className="home-intro-section">
        <div className="home-intro-text">
          <span className="home-section-eyebrow">Who We Are</span>
          <h2 className="home-section-heading">
            Expert Workforce Placements Anchored in Transparency & Compliance
          </h2>
          <p className="home-section-body">
            3DEES Consulting works has spearheaded recruitment logistics, mass screening, and verification management for commercial agricultural farms, federal contractors, and private conglomerates.
          </p>
          <p className="home-section-body">
            Our governance-driven approach minimizes hiring cycle overhead while securing strict, non-compromised background verifications for your high-growth project setups.
          </p>
          <Link to="/about" className="home-charter-link">
            <span>Read Our Recruitment Charter</span>
            <ArrowRight className="home-charter-arrow" />
          </Link>
        </div>

        <div className="home-counters-grid">
          <StatCounter end={5000} text="Placements Administered" />
          <StatCounter end={12}   text="Partner Corporations" />
          <StatCounter end={16}   text="Years in Operations" suffix=" Yrs" />
          <StatCounter end={36}   text="Nigerian States Active" suffix=" States" />
        </div>
      </section>

      {/* ── Featured Jobs ── */}
      <section className="home-featured-section">
        <div className="home-featured-inner">
          <div className="home-featured-header">
            <div className="home-featured-header-left">
              <span className="home-section-eyebrow">Immediate Openings</span>
              <h2 className="home-section-heading">Featured Vacancies</h2>
              <p className="home-featured-sub">
                These roles represent urgent briefs from verified partner organizations. Fast screening process applied.
              </p>
            </div>
            <Link to="/jobs" className="home-view-all-link">
              <span>View All Listings</span>
              <ChevronRight className="home-view-all-chevron" />
            </Link>
          </div>

          <div className="home-featured-grid">
            {featuredRoles.length > 0 ? (
              featuredRoles.map((role, idx) => (
                <motion.div
                  key={role.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1, duration: 0.5 }}
                  className="home-featured-card"
                  id={`featured-${role.id}`}
                >
                  <div>
                    <span className="home-featured-category">{role.category}</span>
                    <h3 className="home-featured-title">{role.title}</h3>
                    <span className="home-featured-org">{role.clientOrg}</span>
                    <p className="home-featured-desc">{role.description}</p>
                  </div>

                  <div className="home-featured-footer">
                    <div className="home-featured-meta">
                      <div className="home-featured-meta-row">
                        <span>Location:</span>
                        <span className="home-featured-meta-value">{role.location}</span>
                      </div>
                      <div className="home-featured-meta-row">
                        <span>Type:</span>
                        <span className="home-featured-meta-value">{role.type}</span>
                      </div>
                    </div>
                    <div className="home-featured-actions">
                      <Link to={`/jobs/${role.id}`} className="home-featured-btn-detail">
                        View Details
                      </Link>
                      <Link to={`/apply/${role.id}`} className="home-featured-btn-apply">
                        Apply Now
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="home-featured-empty">
                <span>No active roles are currently featured. Please visit our jobs catalog.</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Recruitment Process ── */}
      <section className="home-process-section">
        <div className="home-process-header">
          <span className="home-section-eyebrow">Procedural Pipeline</span>
          <h2 className="home-section-heading">Our Recruitment Process</h2>
          <p className="home-process-sub">
            A meticulous 6-stage lifecycle designed to guarantee standard compliance and professional applicant evaluation.
          </p>
        </div>

        <div className="home-steps-grid">
          <div className="home-steps-connector" />
          {steps.map((st, sIdx) => (
            <motion.div
              key={st.title}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: sIdx * 0.1, duration: 0.4 }}
              className="home-step"
              id={`stepper-idx-${st.num}`}
            >
              <div className="home-step-circle">
                {st.icon}
              </div>
              <span className="home-step-label">{st.num} • {st.title}</span>
              <p className="home-step-desc">{st.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

    </motion.div>
  );
}