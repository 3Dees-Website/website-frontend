/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion } from 'motion/react';
import { useToast } from '../hooks/useToast';
import { contactService } from '../services/contactService';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';
import './styles/Contact.css';

export function Contact() {
  const { addToast } = useToast();
  const [isSending, setIsSending] = useState(false);

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    orgName: '',
    subject: '',
    message: ''
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const tempErrors = {};
    if (!form.fullName.trim()) tempErrors.fullName = 'Specify your full name.';
    if (!form.email.trim()) {
      tempErrors.email = 'Specify your business email.';
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      tempErrors.email = 'Specify a valid email address.';
    }
    if (!form.phone.trim()) tempErrors.phone = 'Specify an active phone number.';
    if (!form.subject) tempErrors.subject = 'Select an inquiry category.';
    if (!form.message.trim()) tempErrors.message = 'Compose a short message description.';

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      addToast('error', 'Form Discrepancies', 'Please resolve highlighted details before submitting.');
      return;
    }

    setIsSending(true);
    try {
      await contactService.submit(form);
      setForm({ fullName: '', email: '', phone: '', orgName: '', subject: '', message: '' });
      addToast('success', 'Inquiry Ingested', 'Your corporate brief has been successfully logged. Board experts will contact you.');
    } catch (err) {
      addToast('error', 'Submission Failed', err.message || 'Could not send your message. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="contact-page"
      id="contact-us-page"
    >
      {/* Header */}
      <div className="contact-header">
        <span className="contact-eyebrow">Connect with 3DEES</span>
        <h1 className="contact-title">Speak with Our Placements Team</h1>
        <p className="contact-subtitle">
          Have an urgent recruitment requirement or seeking a partnership? Our workforce coordinators are here to assist.
        </p>
      </div>

      <div className="contact-layout">

        {/* ── Left: Form ── */}
        <div className="contact-form-card" id="contact-form-grid">
          <h2 className="contact-form-heading">Business Lead Intake Form</h2>

          <form onSubmit={handleContactSubmit} className="contact-form">

            <div className="contact-fields-grid">
              {/* Full Name */}
              <div className="contact-field">
                <label className="contact-label">Your Name <span className="contact-required">*</span></label>
                <input
                  type="text"
                  placeholder="e.g. Kolawole Davies"
                  value={form.fullName}
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                  className={`contact-input ${errors.fullName ? 'contact-input-error' : ''}`}
                />
                {errors.fullName && <span className="contact-error-msg">{errors.fullName}</span>}
              </div>

              {/* Email */}
              <div className="contact-field">
                <label className="contact-label">Contact Email <span className="contact-required">*</span></label>
                <input
                  type="email"
                  placeholder="davies@enterprise.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className={`contact-input ${errors.email ? 'contact-input-error' : ''}`}
                />
                {errors.email && <span className="contact-error-msg">{errors.email}</span>}
              </div>

              {/* Phone */}
              <div className="contact-field">
                <label className="contact-label">Phone Contact <span className="contact-required">*</span></label>
                <input
                  type="tel"
                  placeholder="e.g. +2348056781234"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className={`contact-input ${errors.phone ? 'contact-input-error' : ''}`}
                />
                {errors.phone && <span className="contact-error-msg">{errors.phone}</span>}
              </div>

              {/* Org Name */}
              <div className="contact-field">
                <label className="contact-label">Organization Name (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Shell Nigeria"
                  value={form.orgName}
                  onChange={(e) => setForm({ ...form, orgName: e.target.value })}
                  className="contact-input"
                />
              </div>
            </div>

            {/* Subject */}
            <div className="contact-field">
              <label className="contact-label">Inquiry Category <span className="contact-required">*</span></label>
              <select
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                className={`contact-select ${errors.subject ? 'contact-input-error' : ''}`}
              >
                <option value="">Select Category</option>
                <option value="General Enquiry">General Enquiry</option>
                <option value="Partnership">Partnership</option>
                <option value="Recruitment Project">Recruitment Project Space</option>
                <option value="Other">Other</option>
              </select>
              {errors.subject && <span className="contact-error-msg">{errors.subject}</span>}
            </div>

            {/* Message */}
            <div className="contact-field">
              <label className="contact-label">Your Message / Brief <span className="contact-required">*</span></label>
              <textarea
                rows={4}
                placeholder="Include a description of vacancies, timelines, or partnership scopes..."
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className={`contact-textarea ${errors.message ? 'contact-input-error' : ''}`}
              />
              {errors.message && <span className="contact-error-msg">{errors.message}</span>}
            </div>

            <button
              type="submit"
              disabled={isSending}
              className="contact-submit-btn"
              id="contact-submit-btn"
            >
              {isSending ? (
                <>
                  <svg className="contact-spinner" fill="none" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Transmitting Brief...</span>
                </>
              ) : (
                <>
                  <Send className="contact-send-icon" />
                  <span>Transmit Inquiry</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* ── Right: Info & Map ── */}
        <div className="contact-info-col" id="contact-info-grid">

          {/* Office Coordinates */}
          <div className="contact-info-card">
            <h3 className="contact-info-heading">Direct Coordinates</h3>

            <div className="contact-info-items">
              <div className="contact-info-item">
                <MapPin className="contact-info-icon" />
                <div>
                  <h4 className="contact-info-label">Abuja Headquarters</h4>
                  <p className="contact-info-text">Suite D66 Efab Mall, Area 11, Garki Abuja FCT, Nigeria</p>
                </div>
              </div>

              <div className="contact-info-item">
                <Phone className="contact-info-icon" />
                <div>
                  <h4 className="contact-info-label">Contact Telephones</h4>
                  <p className="contact-info-text">+234-8149599505, +234-9071766667</p>
                </div>
              </div>

              <div className="contact-info-item">
                <Mail className="contact-info-icon" />
                <div>
                  <h4 className="contact-info-label">Support Email Address</h4>
                  <a href="mailto:consultingworks@3dees.net" className="contact-email-link">
                    consultingworks@3dees.net
                  </a>
                </div>
              </div>

              <div className="contact-info-item contact-info-item-bordered">
                <Clock className="contact-info-icon" />
                <div>
                  <h4 className="contact-info-label">Business Hours</h4>
                  <p className="contact-info-text">Mon - Fri: 8:00 AM - 5:00 PM (GMT +1)</p>
                </div>
              </div>
            </div>
          </div>

          {/* Map Placeholder */}
          {/* <div className="contact-map-card"> */}
            {/* <span className="contact-map-label">Simulated Google Maps Placement</span> */}

            {/* <div className="contact-map-box" id="simulated-google-map"> */}
              {/* Grid lines */}
              {/* <div className="contact-map-grid">
                <svg className="contact-map-svg">
                  <path d="M 0,20 L 500,20 M 0,60 L 500,60 M 0,100 L 500,100 M 0,140 L 500,140 M 0,180 L 500,180" stroke="#000" strokeWidth="1" />
                  <path d="M 50,0 L 50,300 M 120,0 L 120,300 M 190,0 L 190,300 M 260,0 L 260,300 M 330,0 L 330,300" stroke="#000" strokeWidth="1" />
                  <path d="M 0,0 L 400,250 M 200,0 L 400,100 M 0,150 L 300,300" stroke="#FF6600" strokeWidth="2" strokeDasharray="3,3" />
                </svg>
              </div> */}

              {/* Pin */}
              {/* <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
                className="contact-map-pin"
              >
                <div className="contact-map-pin-circle">
                  <Navigation className="contact-map-pin-icon" />
                </div>
                <div className="contact-map-pin-label">
                  Abuja: Suite D66 Efab Mall
                </div>
              </motion.div> */}

              {/* GPS badge */}
              {/* <div className="contact-map-gps">
                GPS Pin Lock: Suite D66 Efab
              </div> */}
            {/* </div> */}

            {/* <p className="contact-map-note">
              <ShieldAlert className="contact-map-note-icon" />
              Our administrative coordinators welcome drop-ins for pre-scheduled credential verifications only. General job applications must be submitted via the online portal.
            </p> */}
          {/* </div> */}
        </div>
      </div>
    </motion.div>
  );
}