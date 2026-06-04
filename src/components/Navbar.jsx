import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, LogOut, User, ChevronRight } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import './styles/Navbar.css';

export function LogoSVG() {
  return (
    <div className="logo-wrap">
      <img src="/3dees_Logo.png" alt="" width={120} />
    </div>
  );
}

export function Navbar() {
  const { currentUser, logout } = useAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navigation = [
    { name: 'Home', path: '/' },
    { name: 'Jobs', path: '/jobs' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const handleLinkClick = () => setMobileOpen(false);

  const getDashboardPath = () => {
    if (!currentUser) return '/admin/login';
    return currentUser.role === 'superadmin' ? '/superadmin/dashboard' : '/admin/dashboard';
  };

  const isActive = (path) =>
    location.pathname === path || (path !== '/' && location.pathname.startsWith(path));

  return (
    <nav className="navbar" id="portal-navbar">
      <div className="navbar-inner">

        {/* Logo */}
        <Link to="/" className="navbar-logo-link" onClick={handleLinkClick}>
          <LogoSVG light={true} />
        </Link>

        {/* Desktop Menu */}
        <div className="navbar-desktop-links">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`nav-link${isActive(item.path) ? ' nav-link--active' : ''}`}
              id={`nav-link-${item.name.toLowerCase().replace(' ', '-')}`}
            >
              {item.name}
              {isActive(item.path) && (
                <motion.div
                  layoutId="activeNavLine"
                  className="nav-active-line"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
            </Link>
          ))}
        </div>

        {/* Desktop CTAs */}
        <div className="navbar-desktop-ctas">
          {currentUser ? (
            <div className="navbar-user-actions">
              <Link
                to={getDashboardPath()}
                className="btn-nav-dashboard"
                id="navbar-dashboard-link"
              >
                <User size={14} className="btn-nav-icon" />
                <span>Dashboard</span>
              </Link>
              <button
                onClick={logout}
                className="btn-nav-logout"
                id="navbar-logout-btn"
              >
                <LogOut size={14} />
                <span>Sign Out</span>
              </button>
            </div>
          ) : (
            <Link to="/admin/login" className="btn-nav-login" id="navbar-login-btn">
              Admin Login
            </Link>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="navbar-mobile-toggle"
          id="navbar-mobile-toggle"
          aria-label="Toggle navigation"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mobile-drawer"
            id="mobile-nav-drawer"
          >
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                onClick={handleLinkClick}
                className={`mobile-nav-link${isActive(item.path) ? ' mobile-nav-link--active' : ''}`}
              >
                {item.name}
              </Link>
            ))}

            <div className="mobile-nav-cta-group">
              {currentUser ? (
                <>
                  <div className="mobile-user-label">
                    <User size={14} className="mobile-user-icon" />
                    <span>Representative: {currentUser.name}</span>
                  </div>
                  <Link
                    to={getDashboardPath()}
                    onClick={handleLinkClick}
                    className="btn-mobile-dashboard"
                  >
                    Manage Dashboard
                  </Link>
                  <button
                    onClick={() => { logout(); handleLinkClick(); }}
                    className="btn-mobile-logout"
                  >
                    <LogOut size={16} />
                    <span>Sign Out</span>
                  </button>
                </>
              ) : (
                <Link
                  to="/admin/login"
                  onClick={handleLinkClick}
                  className="btn-mobile-login"
                >
                  <span>Portal Login</span>
                  <ChevronRight size={16} />
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}