import { LegalLayout, LegalSection, CompanyValue, CompanyEmail } from '../components/LegalLayout';
import { COMPANY } from '../constants/company';

// Wording from docs/legal-pages-content.md (Page 1) — do not edit here
// without updating that source; a lawyer reviews it before launch.
export function Terms() {
  return (
    <LegalLayout title="Terms & Conditions">
      <div className="legal-card">
        <p className="legal-text">
          These terms explain the rules for using the 3DEES recruitment website and applying for jobs through it. Please read them before you submit an application. By ticking the box to agree to these Terms & Conditions and submitting an application, you accept these terms.
        </p>
      </div>

      <LegalSection title="1. Who we are">
        <p className="legal-text">
          This website is operated by <strong>{COMPANY.legalName}</strong> ("3DEES", "we", "us"), a recruitment and resourcing company registered in Nigeria (RC {COMPANY.rcNumber}), with its registered office at <CompanyValue k="registeredAddress" />.
        </p>
        <p className="legal-text">
          We recruit on behalf of employers ("our clients"). When you apply for a job on this site, you are applying through us. We review your application and, if it is suitable, we put you forward to the employer for the role.
        </p>
      </LegalSection>

      <LegalSection title="2. What this website is for">
        <p className="legal-text">You can use this website to:</p>
        <ul className="legal-list">
          <li>view current job openings</li>
          <li>apply for a job by completing the online application form and uploading supporting documents</li>
          <li>contact us with an enquiry</li>
        </ul>
      </LegalSection>

      <LegalSection title="3. Who can apply">
        <p className="legal-text">To apply, you must:</p>
        <ul className="legal-list">
          <li>be at least 18 years old</li>
          <li>give information that is true, complete and your own</li>
          <li>apply only for yourself — you may not apply on behalf of someone else</li>
        </ul>
        <p className="legal-text">
          Some jobs have extra requirements (for example, a qualification, licence or location). These are shown on the job's page.
        </p>
      </LegalSection>

      <LegalSection title="4. Your application">
        <p className="legal-text">When you submit an application:</p>
        <ul className="legal-list">
          <li>You confirm that every answer you give and every document you upload is accurate and genuine. See our Applicant Declarations for details.</li>
          <li>You confirm that any documents you upload belong to you and that you have the right to share them.</li>
          <li>If you give details of referees, you confirm that they have agreed to be contacted about you.</li>
          <li>You understand that we may check the information you give us, including by contacting referees, schools, past employers or the issuers of your certificates.</li>
        </ul>
        <p className="legal-text">
          Once an application has been submitted, you cannot edit it yourself. If something needs correcting, contact us at <CompanyEmail /> and quote your application reference number.
        </p>
      </LegalSection>

      <LegalSection title="5. No guarantee of a job">
        <p className="legal-text">
          Submitting an application does not guarantee an interview, a shortlisting, or a job offer. Every application is reviewed by people, and the final hiring decision is made by the employer, not by 3DEES.
        </p>
        <p className="legal-text">
          Job openings may be changed, paused or closed at any time, including before the closing date shown, for example when all positions are filled.
        </p>
      </LegalSection>

      <LegalSection title="6. We never charge applicants">
        <p className="legal-text">
          3DEES does not charge applicants any fee — not to apply, not for an interview, not for "processing", training or medicals arranged by us, and not to secure a job offer.
        </p>
        <p className="legal-text">
          If anyone asks you for money in the name of 3DEES or any of our clients, do not pay. Report it to us at <CompanyEmail />.
        </p>
      </LegalSection>

      <LegalSection title="7. How we share your application">
        <p className="legal-text">
          If your application passes our review, we send it — including your documents — to the employer for that job so they can make a decision. The employer then tells us whether they accept or decline you. Our Privacy Policy explains this in full.
        </p>
      </LegalSection>

      <LegalSection title="8. Using the website properly">
        <p className="legal-text">You must not:</p>
        <ul className="legal-list">
          <li>give false information or upload forged, altered or someone else's documents</li>
          <li>submit applications using automated tools or scripts</li>
          <li>upload files that contain viruses or harmful code</li>
          <li>try to access parts of the website or our systems that are not meant for the public</li>
          <li>interfere with the website or make it harder for others to use</li>
        </ul>
        <p className="legal-text">
          We may reject an application, remove information, or block access if we reasonably believe these rules have been broken.
        </p>
      </LegalSection>

      <LegalSection title="9. Job information">
        <p className="legal-text">
          Job descriptions are prepared by us using information from our clients. We try to keep them accurate and up to date, but details such as salary, location and start date may change. The terms of any job are set by the employer in their offer and contract, not by this website.
        </p>
      </LegalSection>

      <LegalSection title="10. Our content">
        <p className="legal-text">
          The text, logos and design of this website belong to 3DEES or are used with permission. You may view and print pages for your own personal use, but you may not copy or reuse them for any other purpose without our written permission.
        </p>
      </LegalSection>

      <LegalSection title="11. Our responsibility to you">
        <p className="legal-text">
          We work to keep this website available and secure, but we cannot promise it will always be available or free from errors. We are not responsible for:
        </p>
        <ul className="legal-list">
          <li>decisions made by employers about your application</li>
          <li>losses caused by circumstances outside our reasonable control, such as internet outages</li>
          <li>losses caused by you giving us incorrect information</li>
        </ul>
        <p className="legal-text">
          Nothing in these terms limits any rights you have under Nigerian law that cannot be excluded.
        </p>
      </LegalSection>

      <LegalSection title="12. Changes to these terms">
        <p className="legal-text">
          We may update these terms from time to time. The date at the top of this page shows when they were last changed. The terms that apply to your application are the ones in force when you submitted it.
        </p>
      </LegalSection>

      <LegalSection title="13. Law that applies">
        <p className="legal-text">
          These terms are governed by the laws of the Federal Republic of Nigeria. Any dispute will be handled by the courts of <CompanyValue k="courtLocation" />, Nigeria.
        </p>
      </LegalSection>

      <LegalSection title="14. Contact us">
        <address className="legal-address">
          {COMPANY.legalName}<br />
          <CompanyValue k="registeredAddress" /><br />
          Email: <CompanyEmail />
        </address>
      </LegalSection>
    </LegalLayout>
  );
}
