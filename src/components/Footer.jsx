import { Link } from 'react-router-dom';
import { Mail, MapPin, Phone } from 'lucide-react';
import { FaLinkedinIn, FaFacebookF } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { LogoSVG } from './Navbar';
import './styles/Footer.css';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer" id="3dees-system-footer">
      <div className="footer-grid">

        {/* Column 1: About */}
        <div className="footer-col">
          <LogoSVG light={true} />
          <p className="footer-about-text">
            3DEES Consulting Works (RC: 9160527) is a trusted, licensed Nigerian workforce solutions firm committed to aligning high-performing candidates with professional corporate sponsors across Sub-Saharan Africa.
          </p>
          <div className="footer-socials">
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="footer-social-link" aria-label="LinkedIn">
              <FaLinkedinIn size={16} />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="footer-social-link" aria-label="X / Twitter">
              <FaXTwitter size={16} />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="footer-social-link" aria-label="Facebook">
              <FaFacebookF size={16} />
            </a>
          </div>
        </div>

        {/* Column 2: Quick Links */}
        <div className="footer-col">
          <h4 className="footer-col-title">Quick Links</h4>
          <ul className="footer-link-list">
            <li><Link to="/" className="footer-link">Home Landing</Link></li>
            <li><Link to="/jobs" className="footer-link">Career Opportunities</Link></li>
            <li><Link to="/about" className="footer-link">Who We Are</Link></li>
            <li><Link to="/contact" className="footer-link">Get In Touch</Link></li>
            <li><Link to="/admin/login" className="footer-link footer-link--highlight">Portal Dashboard Login</Link></li>
          </ul>
        </div>

        {/* Column 3: Services */}
        <div className="footer-col">
          <h4 className="footer-col-title">Operations Spectrum</h4>
          <ul className="footer-link-list">
            <li>Recruitment &amp; Staffing</li>
            <li>Workforce Resource Planning</li>
            <li>Human Resource Consultation</li>
            <li>Organisational Compliance Audits</li>
            <li>EGI Portal Sync Partnerships</li>
          </ul>
        </div>

        {/* Column 4: Contact */}
        <div className="footer-col">
          <h4 className="footer-col-title">Headquarters</h4>
          <ul className="footer-contact-list">
            <li className="footer-contact-item">
              <MapPin size={16} className="footer-contact-icon" />
              <span>Suite D66 Efab Mall, Area 11, Garki Abuja FCT, Nigeria</span>
            </li>
            <li className="footer-contact-item">
              <Phone size={16} className="footer-contact-icon" />
              <span>+234-8149599505, +234-9071766667</span>
            </li>
            <li className="footer-contact-item">
              <Mail size={16} className="footer-contact-icon" />
              <a href="mailto:consultingworks@3dees.net" className="footer-link">
                consultingworks@3dees.net
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <p>© {currentYear} 3DEES Consulting Works. All Rights Reserved.</p>
        <div className="footer-bottom-right">
          <span>RC: 9160527</span>
          <span className="footer-dot">•</span>
          <span>Registered Corporate Workforce Solutions Provider</span>
        </div>
      </div>
    </footer>
  );
}