import { Link as RouterLink } from 'react-router-dom';
import { motion } from 'motion/react';
import { Users, Compass, BarChart, Server, Shield, ArrowRight, CheckCircle2, Camera } from 'lucide-react';
import './styles/About.css';

export function About() {
  const team = [
    {
      name: 'Dr. Chinedu Ugoh',
      role: 'Chief Executive Officer',
      bio: 'Former advisor with 20+ years of workforce structuring experience across Africa.',
      initials: 'CU',
    },
    {
      name: 'Ibrahim Danlami',
      role: 'Head of Credentials Verification',
      bio: 'Expert investigator focusing on biometric database alignment and credential audits.',
      initials: 'ID',
    },
    {
      name: 'Dr. Elizabeth Adebayo',
      role: 'Lead HR Consultant',
      bio: 'Chartered CIPM lead delivering mass human resource vetting modules.',
      initials: 'EA',
    },
    {
      name: 'Amara Nwachukwu',
      role: 'EGI Sync Integration Executive',
      bio: 'Coordinates digital sync pipelines with client databases and partner organizations.',
      initials: 'AN',
    },
    {
      name: 'Board Member',
      role: 'Role TBD',
      bio: 'Profile details to be added.',
      initials: 'BM',
    },
  ];

  const topCount = team.length % 3 || 3;
  const topTeam = team.slice(0, topCount);
  const bottomTeam = team.slice(topCount);

  const renderTeamCard = (t, idx) => (
    <motion.div
      key={t.name}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: idx * 0.1, duration: 0.4 }}
      className="team-card"
    >
      {/* Photo area — swap src when you have real photos */}
      <div className="team-photo-wrap">
        <div className="team-photo-placeholder">
          <Camera size={20} className="team-camera-icon" />
          <span className="team-initials-overlay">{t.initials}</span>
        </div>
        {/* To add a real photo, replace the div above with:
            <img src="/path/to/photo.jpg" alt={t.name} className="team-photo-img" />
        */}
      </div>
      <div className="team-card-body">
        <h4 className="team-name">{t.name}</h4>
        <span className="team-role">{t.role}</span>
        <p className="team-bio">{t.bio}</p>
      </div>
    </motion.div>
  );

  const services = [
    {
      title: 'Recruitment & Staffing',
      desc: 'Sourcing, screening, and validating specialized operators for agriculture, corporate finance, and tech clusters.',
      icon: <Compass size={22} className="service-icon" />,
    },
    {
      title: 'Workforce Planning',
      desc: 'Assisting corporate setups in detailing skills models, contract provisions, and structural hiring pipelines.',
      icon: <BarChart size={22} className="service-icon" />,
    },
    {
      title: 'HR Consulting',
      desc: 'Deploying organizational compliance diagnostics, salary scales benchmarking, and policy development.',
      icon: <Users size={22} className="service-icon" />,
    },
    {
      title: 'Mass Recruitment',
      desc: 'Coordinating high-volume state vetting, nationwide tests, and biometric onboarding structures.',
      icon: <Server size={22} className="service-icon" />,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="about-page"
      id="about-us-page"
    >
      {/* ── Hero ── */}
      <section className="about-hero">
        <div className="about-hero-inner">
          <span className="section-eyebrow">About 3DEES Consulting</span>
          <h1 className="about-hero-title">Workforce Solutions You Can Trust</h1>
          <p className="about-hero-subtitle">
            Leading Nigerian professional recruitment services. Unwavering transparency,
            verification, and legal governance in every placement.
          </p>
        </div>
      </section>

      {/* ── Profile Section ── */}
      <section className="about-profile">
        <div className="about-profile-text">
          <span className="section-eyebrow">Corporate Identity</span>
          <h2 className="section-title">Elevating Local Human Resources to Global Competence</h2>
          <p className="section-body">
            Established under Federal registration RC: 9160527, 3DEES Consulting bridges the
            talent gap across Nigeria by designing robust recruitment pipelines that do not
            falter under verification reviews.
          </p>
          <p className="section-body">
            We hold a strong belief that our homeland's economic acceleration thrives on honest
            alignment. Placing verified specialists inside organisations creates stable growth
            pools and secure investment setups. We construct deep background portfolios that
            verify NYSC status, degree validity, and national biometric markers.
          </p>
          <div className="mission-grid">
            <div className="mission-card">
              <span className="mission-card-title">Our Mission</span>
              <p className="mission-card-body">
                To coordinate transparent, compliance-first workforce acquisitions that guard
                partner resources while rewarding factual excellence in Nigerian jobseekers.
              </p>
            </div>
            <div className="mission-card">
              <span className="mission-card-title">Our Core Value</span>
              <p className="mission-card-body">
                Verification-First: Zero compromise on background parameters. Full transparency
                for every sponsor organisation.
              </p>
            </div>
          </div>
        </div>

        <div className="about-profile-widget">
          <div className="vetting-code-card">
            <div className="vetting-pulse" />
            <span className="vetting-eyebrow">Organisation Vetting Code</span>
            <div className="vetting-steps">
              <div className="vetting-step">
                <span className="step-badge step-badge--primary">1</span>
                <div>
                  <strong>NIN Registration ID Check:</strong> National database lookup
                  checking validity of biometric details.
                </div>
              </div>
              <div className="vetting-step">
                <span className="step-badge step-badge--dark">2</span>
                <div>
                  <strong>Academic Verification:</strong> Certificate check responses sourced
                  direct from registrar offices.
                </div>
              </div>
              <div className="vetting-step">
                <span className="step-badge step-badge--dark">3</span>
                <div>
                  <strong>NYSC State Records Validation:</strong> Cross-checking community
                  service discharge records.
                </div>
              </div>
            </div>
            <div className="vetting-footer">
              <span>Security Audited Daily</span>
              <span>ISO Compliant</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Services Section ── */}
      <section className="about-services">
        <div className="about-services-inner">
          <div className="section-header">
            <span className="section-eyebrow">Our Services</span>
            <h2 className="section-title">How We Engineer Workforce Excellence</h2>
            <p className="section-body">
              A modern HR suite configured to solve specialised personnel shortages across key
              Nigerian economic grids.
            </p>
          </div>
          <div className="services-grid">
            {services.map((ser, serIdx) => (
              <motion.div
                key={ser.title}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: serIdx * 0.1, duration: 0.4 }}
                className="service-card"
              >
                <div>
                  <div className="service-icon-wrap">{ser.icon}</div>
                  <h3 className="service-card-title">{ser.title}</h3>
                  <p className="service-card-body">{ser.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Governance Section ── */}
      <section className="about-governance">
        <div className="governance-card" id="recruitment-charter">
          <div className="governance-text">
            <span className="section-eyebrow">Standard Governance Code</span>
            <h3 className="governance-title">
              Vetted Talent Delivery Assured under 3DEES Charter Guidelines
            </h3>
            <p className="section-body">
              Our placement charter outlines strict parameters to prevent nepotical or
              non-compliant influences within state recruitment boards. Candidates are audited
              independently by secondary board review panels.
            </p>
            <ul className="governance-checklist">
              <li><CheckCircle2 size={14} /> Independent secondary board reviews on all placements</li>
              <li><CheckCircle2 size={14} /> Annual compliance audit by executive board counsel</li>
              <li><CheckCircle2 size={14} /> Zero-tolerance policy on credential misrepresentation</li>
            </ul>
          </div>
          <div className="governance-badge-wrap">
            <div className="governance-badge">
              <Shield size={36} className="governance-shield-icon" />
              <h4 className="governance-badge-title">Charter Vetted</h4>
              <p className="governance-badge-body">
                Compliance guidelines reviewed and validated annually by executive board counsel.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Team Section ── */}
      <section className="about-team">
        <div className="about-team-inner">
          <div className="section-header">
            <span className="section-eyebrow">Governance Leadership</span>
            <h2 className="section-title">Dedicated Executive Board</h2>
            <p className="section-body">
              The veterans coordinating administrative integrity and corporate integrations at
              our Abuja offices.
            </p>
          </div>
          <div className="team-grid">
            <div className="team-row">
              {topTeam.map((t, idx) => renderTeamCard(t, idx))}
            </div>
            <div className="team-row">
              {bottomTeam.map((t, i) => renderTeamCard(t, topCount + i))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA Strip — uses brand-light background, distinct from dark footer ── */}
      <section className="about-cta">
        <div className="about-cta-accent-bar" />
        <div className="about-cta-inner">
          <div className="about-cta-icon-wrap">
            <Users size={28} className="about-cta-icon" />
          </div>
          <h3 className="about-cta-title">Looking to Hire? Let's Talk</h3>
          <p className="about-cta-body">
            Configure a compliant careers tracking dashboard for your high-growth agricultural,
            tech, or corporate project operations today.
          </p>
          <RouterLink to="/contact" className="about-cta-btn">
            Partner with 3DEES <ArrowRight size={14} className="about-cta-btn-icon" />
          </RouterLink>
        </div>
      </section>
    </motion.div>
  );
}