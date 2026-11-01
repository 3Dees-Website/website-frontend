import { LegalLayout, LegalSection, CompanyValue, CompanyEmail } from '../components/LegalLayout';
import { COMPANY } from '../constants/company';

// Wording from docs/legal-pages-content.md (Page 2) — do not edit here
// without updating that source; a lawyer reviews it before launch.

const LAWFUL_BASES = [
  ['Review your application and decide whether to put you forward for the job', 'Your consent, and steps you have asked us to take before a possible employment contract'],
  ['Send your application to the employer for that job', 'Your consent'],
  ['Check that your information and documents are genuine', 'Your consent, and our legitimate interest in preventing fraud'],
  ['Carry out background and reference checks', 'Your consent, given on the application form'],
  ['Assess health and criminal record information, where a job requires it', 'Your explicit consent, given on the application form'],
  ['Email you about your application', 'Our legitimate interest in keeping you informed'],
  ['Reply to contact form enquiries', 'Our legitimate interest in responding to you'],
  ['Keep the website secure and prevent misuse', 'Our legitimate interest in protecting our systems and users'],
  ['Keep records we are required to keep, or respond to lawful requests from authorities', 'Legal obligation'],
];

export function Privacy() {
  return (
    <LegalLayout title="Privacy Policy">
      <div className="legal-card">
        <p className="legal-text">
          This policy explains what personal information we collect when you use this website or apply for a job, why we collect it, who we share it with, and the rights you have over it. It is written to meet the requirements of the <strong>Nigeria Data Protection Act 2023 (NDPA)</strong> and the <strong>NDPA General Application and Implementation Directive 2025 (GAID)</strong> issued by the Nigeria Data Protection Commission.
        </p>
      </div>

      <LegalSection title="1. Who is responsible for your information">
        <p className="legal-text">
          <strong>{COMPANY.legalName}</strong> ("3DEES", "we", "us") is the data controller for the information you give us on this website.
        </p>
        <p className="legal-text">
          Address: <CompanyValue k="registeredAddress" /><br />
          Email for privacy questions and requests: <CompanyEmail />
        </p>
      </LegalSection>

      <LegalSection title="2. Information we collect">
        <p className="legal-text">
          <strong>When you apply for a job</strong>, we collect the information the application form asks for. The exact questions depend on the job, but may include:
        </p>
        <ul className="legal-list">
          <li><strong>Identity and contact details</strong> — your name, email address, phone number, date of birth, gender, nationality, state of origin, local government area, and residential address</li>
          <li><strong>Education</strong> — schools attended, qualifications, grades and years of graduation</li>
          <li><strong>Work history</strong> — past employers, job titles, dates and responsibilities</li>
          <li><strong>Professional details</strong> — certifications, licences, memberships and skills</li>
          <li><strong>Referees</strong> — names and contact details of people who can vouch for you</li>
          <li><strong>Job-specific answers</strong> — any extra questions particular to the role</li>
          <li><strong>Health information, where a job requires it</strong> — whether you are physically fit for the role, your medical fitness declaration, and a medical certificate. During verification, medical and drug test results may also be added to your application</li>
          <li><strong>Criminal record information, where a job requires it</strong> — your answer to whether you have a criminal record. During verification, a police check report may also be added to your application</li>
          <li><strong>Documents</strong> — files you upload, such as your CV, certificates, identification documents and photographs</li>
          <li><strong>Your declarations and consents</strong> — a record that you agreed to these terms (including the declarations in section 5) and this policy, your consent to background and reference checks, and, where a job asks for it, your declaration that you are medically fit for the role</li>
        </ul>
        <p className="legal-text">
          <strong>When you contact us</strong> through the contact form, we collect your name, email address, phone number, organisation name (if given) and your message.
        </p>
        <p className="legal-text">
          <strong>When you visit the website</strong>, our servers and security providers automatically record technical information such as your IP address and the time of your visit. We use this to keep the site secure and to stop abuse, for example by limiting how many applications can be sent from one connection. The website also loads its fonts from Google Fonts, so Google receives your IP address when a page loads.
        </p>
        <p className="legal-text">
          We do not use advertising or analytics tracking on this website. Our hosting and security providers may use small, strictly necessary files (cookies) to protect the site from attacks.
        </p>
        <p className="legal-text">
          Health and criminal record information are especially sensitive. We only collect them for jobs where the employer needs them to decide whether you can safely and lawfully do the role, and the application form shows which ones a job asks for. We collect them with your explicit consent, limit who can see them, and share them only with the employer for that job.
        </p>
        <p className="legal-text">
          We ask for your state of origin and local government area because employers commonly require them.
          {/* [[LAWYER: confirm this explanation is adequate]] */}
        </p>
        <p className="legal-text">
          We do not ask about your religion or political opinions.
        </p>
      </LegalSection>

      <LegalSection title="3. Why we use your information">
        {/* Explicit roles keep table semantics when rows are restyled as
            stacked blocks on small screens (Safari drops them otherwise). */}
        <table className="legal-table" role="table">
          <thead role="rowgroup">
            <tr role="row">
              <th role="columnheader" scope="col">What we do</th>
              <th role="columnheader" scope="col">Why we're allowed to</th>
            </tr>
          </thead>
          <tbody role="rowgroup">
            {LAWFUL_BASES.map(([what, why]) => (
              <tr key={what} role="row">
                <td role="cell" data-label="What we do">{what}</td>
                <td role="cell" data-label="Why we're allowed to">{why}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="legal-text">
          All decisions about your application are made by people. We do not use automated systems to accept or reject applicants.
        </p>
      </LegalSection>

      <LegalSection title="4. Who we share your information with">
        <p className="legal-text">
          <strong>Our staff.</strong> Only 3DEES staff who are authorised to handle recruitment can see your application.
        </p>
        <p className="legal-text">
          <strong>The employer.</strong> If your application passes our review, we send it — including your documents — to the employer for that job. At present our employer client is <strong>ECO Green Investments Limited</strong>. The employer uses your information to decide whether to accept you, and if they accept you, they keep their own copy of your application and documents. From that point, the employer is also responsible for how they handle that copy, under their own privacy policy.
        </p>
        <p className="legal-text">
          <strong>Service providers.</strong> We use trusted companies to run this website on our behalf — for hosting, database storage, secure file storage and sending email. They may only use your information to provide their service to us, and must keep it secure.
        </p>
        <p className="legal-text">
          <strong>Authorities.</strong> We will share information with government or law enforcement bodies only where the law requires us to.
        </p>
        <p className="legal-text">
          <strong>We never sell your personal information</strong>, and we do not share it for marketing.
        </p>
      </LegalSection>

      <LegalSection title="5. Information stored outside Nigeria">
        <p className="legal-text">
          Some of our service providers store or process information on servers outside Nigeria <CompanyValue k="hostingRegions" />. When this happens, we rely on the safeguards allowed under Part VIII of the NDPA, such as contractual commitments from the provider to protect your information to a standard at least equal to Nigerian law.
        </p>
      </LegalSection>

      <LegalSection title="6. How we protect your information">
        <ul className="legal-list">
          <li>Information sent between your device and our website is encrypted.</li>
          <li>Uploaded documents are kept in private storage. They are never publicly available, and staff open them using links that expire after a short time.</li>
          <li>Staff sign in with a password and a one-time code sent to their email.</li>
          <li>Important actions on applications — such as approving or rejecting — are recorded with the name of the staff member who took them.</li>
        </ul>
        <p className="legal-text">
          No system is perfectly secure. If a data breach occurs that is likely to put your rights at risk, we will notify the Nigeria Data Protection Commission and, where required, notify you.
        </p>
      </LegalSection>

      <LegalSection title="7. How long we keep your information">
        <p className="legal-text">
          The NDPA requires that personal information is kept no longer than is needed for the purpose it was collected for. On that basis:
        </p>
        <ul className="legal-list">
          <li><strong>Applications</strong> are kept while the recruitment process for that job is running, and for up to <strong>12 months</strong> after it ends, so that we can answer questions or handle disputes about the process. After that, we delete your application and documents.</li>
          <li><strong>Contact form messages</strong> are kept for up to <strong>12 months</strong> after we have dealt with your enquiry.</li>
          <li>We may keep a short record that an application was made and what decision was taken, for as long as we need it to deal with a legal claim. This record does not include your documents or the answers on your form.</li>
        </ul>
        <p className="legal-text">
          If you are hired, the employer keeps the information it needs under its own policies.
        </p>
        <p className="legal-text">
          You can ask us to delete your information sooner — see section 8.
        </p>
      </LegalSection>

      <LegalSection title="8. Your rights">
        <p className="legal-text">Under the NDPA you have the right to:</p>
        <ul className="legal-list">
          <li><strong>Be informed</strong> about how your information is used — this policy does that</li>
          <li><strong>Access</strong> the information we hold about you and receive a copy</li>
          <li><strong>Correct</strong> information that is wrong or incomplete</li>
          <li><strong>Delete</strong> your information where we no longer have a lawful reason to keep it</li>
          <li><strong>Restrict</strong> how we use your information in certain cases</li>
          <li><strong>Object</strong> to us using your information on the basis of our legitimate interests</li>
          <li><strong>Data portability</strong> — receive your information in a commonly used format, or have it sent to another organisation</li>
          <li><strong>Withdraw your consent</strong> at any time</li>
        </ul>
        <p className="legal-text">
          To use any of these rights, email <CompanyEmail /> with your full name and application reference number. We may ask you to confirm your identity first. We will respond within <CompanyValue k="dataRequestDays" />.
        </p>
        <p className="legal-text">
          Please note: withdrawing your consent does not affect anything we did before you withdrew it. If your application has already been sent to an employer, we will tell them about your request, but you may also need to contact them directly about their copy.
        </p>
      </LegalSection>

      <LegalSection title="9. Making a complaint">
        <p className="legal-text">
          If you are unhappy with how we have handled your information, please contact us first at <CompanyEmail /> so we can try to put it right.
        </p>
        <p className="legal-text">
          You also have the right to complain to the <strong>Nigeria Data Protection Commission (NDPC)</strong> —{' '}
          <a href="https://ndpc.gov.ng" target="_blank" rel="noopener noreferrer" className="legal-link">www.ndpc.gov.ng</a>.
        </p>
      </LegalSection>

      <LegalSection title="10. Age">
        <p className="legal-text">
          This website is for people aged 18 and over. We do not knowingly accept applications from anyone younger. If we find that we have, we will delete the information.
        </p>
      </LegalSection>

      <LegalSection title="11. Changes to this policy">
        <p className="legal-text">
          We may update this policy from time to time. The date at the top shows when it last changed. If we make a significant change, we will make it clear on this page.
        </p>
      </LegalSection>

      <LegalSection title="12. Contact us">
        <address className="legal-address">
          {COMPANY.legalName}<br />
          <CompanyValue k="registeredAddress" /><br />
          Email: <CompanyEmail />
        </address>
      </LegalSection>
    </LegalLayout>
  );
}
