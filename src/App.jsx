import { BrowserRouter, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import { PortalProvider } from './context/PortalContext';
import { ToastContainer } from './components/Toast';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import './App.css';

// Public pages
import { Home } from './pages/Home';
import { Jobs } from './pages/Jobs';
import { JobDetail } from './pages/JobDetail';
import { Apply } from './pages/Apply';
import { About } from './pages/About';
import { Contact } from './pages/Contact';


function PublicBaseLayout() {
  return (
    <div className="public-base-layout">
      <Navbar />
      <main className="public-base-main">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <PortalProvider>
      <BrowserRouter>
        <ToastContainer />

        <Routes>
          {/* GENERAL GUEST DIRECTORIES CHANNELS */}
          <Route element={<PublicBaseLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/jobs/:id" element={<JobDetail />} />
            <Route path="/apply/:id" element={<Apply />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
          </Route>

          {/* CATCH ALL WILDCARDS */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter> 
    </PortalProvider>
  );
}