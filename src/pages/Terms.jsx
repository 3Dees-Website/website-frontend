import { LegalLayout, LegalSection, CompanyValue, CompanyEmail } from '../components/LegalLayout';
import { COMPANY } from '../constants/company';

// Wording from docs/legal-pages-content.md (Page 1) — do not edit here
// without updating that source; a lawyer reviews it before launch.
// Section 5 (id="declarations") holds the declarations and consents that used
// to sit on the separate /declaration page; /declaration now redirects here.
export function Terms() {
  return (
    <LegalLayout title="Terms & Conditions">
      <div className="legal-card">
        <p className="legal-text">
          These terms explain the rules for using the 3DEES recruitment website and applying for jobs through it. Please read them before you submit an application. By ticking the box to agree to these Terms & Conditions and submitting an application, you accept these terms, including the declarations and consents in section 5.
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
          <li>You confirm that every answer you give and every document you upload is accurate and genuine. Section 5 sets out the declarations and consents you give.</li>
          <li>You confirm that any documents you upload belong to you and that you have the right to share them.</li>
          <li>If you give details of referees, you confirm that they have agreed to be contacted about you.</li>
          <li>You understand that we may check the information you give us, including by contacting referees, schools, past employers or the issuers of your certificates.</li>
        </ul>
        <p className="legal-text">
          Once an application has been submitted, you cannot edit it yourself. If something needs correcting, contact us at <CompanyEmail /> and quote your application reference number.
        </p>
      </LegalSection>

      <LegalSection id="declarations" title="5. Your declarations and consents">
        {/* [[LAWYER: background-check and reference-check consent is bundled into this general agreement, with no separate tick-box. Confirm this is valid, specific and informed consent under the NDPA 2023 and the GAID; if not, these two need their own tick-boxes again.]] */}
        <p className="legal-text">
          By ticking the box to agree to these Terms & Conditions, you also make the declarations and give the consents in this section. You can withdraw a consent at any time by emailing <CompanyEmail /> with your application reference number. If you do, we may not be able to continue with your application.
        </p>

        <p className="legal-text"><strong>5.1 Accuracy of information</strong></p>
        <p className="legal-text">By submitting my application, I declare that:</p>
        <ol className="legal-olist">
          <li>All the information I have given in this application is true, complete and accurate to the best of my knowledge.</li>
          <li>I have not left out any information that could reasonably affect the decision on my application.</li>
          <li>Every document I have uploaded is genuine, belongs to me, and has not been altered in any way.</li>
          <li>I am applying for myself, not on behalf of anyone else.</li>
          <li>Any referees I have named have agreed to be contacted about me.</li>
        </ol>
        <p className="legal-text">
          I understand that if any information I have given is found to be false, misleading or incomplete — at any time, including after I have been hired:
        </p>
        <ul className="legal-list">
          <li>my application may be rejected</li>
          <li>any job offer may be withdrawn</li>
          <li>if I have already been employed, my employment may be ended</li>
          <li>where the matter involves forged or fraudulent documents, it may be reported to the relevant authorities</li>
        </ul>
        <p className="legal-text">
          If any of my details change, or I find a mistake in my application after submitting it, I will tell 3DEES as soon as possible at <CompanyEmail />, quoting my application reference number.
        </p>

        <p className="legal-text"><strong>5.2 Background check</strong></p>
        <p className="legal-text">
          I consent to {COMPANY.legalName}, and the employer I am applying to, checking the information in my application. This may include confirming my identity, qualifications, professional licences and employment history with the schools, institutions, licensing bodies and former employers concerned.
        </p>
        <p className="legal-text">
          Where the role requires it, this may also include a police check, a medical examination or a drug test. I will be told before any of these is carried out.
        </p>

        <p className="legal-text"><strong>5.3 Reference check</strong></p>
        <p className="legal-text">
          I consent to {COMPANY.legalName}, and the employer I am applying to, contacting the referees I have named, to ask about my work, conduct and suitability for the role.
        </p>
        <p className="legal-text">
          I confirm that my referees know I have named them and have agreed to be contacted.
        </p>

        <p className="legal-text"><strong>5.4 Medical fitness</strong></p>
        <p className="legal-text legal-note">This declaration applies only to jobs that need it.</p>
        <p className="legal-text">
          Where the role requires it, I declare that, to the best of my knowledge, I am physically and mentally fit to carry out the duties of the role I am applying for.
        </p>
        <p className="legal-text">I understand that:</p>
        <ul className="legal-list">
          <li>this declaration on its own does not ask for medical records or details of any health condition. Some jobs also ask for a medical certificate; if so, the application form will show it</li>
          <li>the employer may ask for a medical examination before confirming an offer, and will tell me if so</li>
          <li>a false declaration may lead to my application being rejected or an offer being withdrawn</li>
        </ul>
        <p className="legal-text">
          This declaration is not a question about disability. If you need any reasonable adjustment to apply or to do the job, please tell us at <CompanyEmail /> — it will not count against your application.
        </p>

        <p className="legal-text"><strong>5.5 Right to work and criminal record</strong></p>
        <p className="legal-text">
          I declare that I have the right to work in Nigeria, and that I have told 3DEES about any criminal record I have where the job asks for it. <mark className="legal-placeholder">[[LAWYER: confirm wording; this replaces the former separate right-to-work and criminal-record tick-boxes]]</mark>
        </p>
      </LegalSection>

      <LegalSection title="6. No guarantee of a job">
        <p className="legal-text">
          Submitting an application does not guarantee an interview, a shortlisting, or a job offer. Every application is reviewed by people, and the final hiring decision is made by the employer, not by 3DEES.
        </p>
        <p className="legal-text">
          Job openings may be changed, paused or closed at any time, including before the closing date shown, for example when all positions are filled.
        </p>
      </LegalSection>

      <LegalSection title="7. We never charge applicants">
        <p className="legal-text">
          3DEES does not charge applicants any fee — not to apply, not for an interview, not for "processing", training or medicals arranged by us, and not to secure a job offer.
        </p>
        <p className="legal-text">
          If anyone asks you for money in the name of 3DEES or any of our clients, do not pay. Report it to us at <CompanyEmail />.
        </p>
      </LegalSection>

      <LegalSection title="8. How we share your application">
        <p className="legal-text">
          If your application passes our review, we send it — including your documents — to the employer for that job so they can make a decision. The employer then tells us whether they accept or decline you. Our Privacy Policy explains this in full.
        </p>
      </LegalSection>

      <LegalSection title="9. Using the website properly">
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

      <LegalSection title="10. Job information">
        <p className="legal-text">
          Job descriptions are prepared by us using information from our clients. We try to keep them accurate and up to date, but details such as salary, location and start date may change. The terms of any job are set by the employer in their offer and contract, not by this website.
        </p>
      </LegalSection>

      <LegalSection title="11. Our content">
        <p className="legal-text">
          The text, logos and design of this website belong to 3DEES or are used with permission. You may view and print pages for your own personal use, but you may not copy or reuse them for any other purpose without our written permission.
        </p>
      </LegalSection>

      <LegalSection title="12. Our responsibility to you">
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

      <LegalSection title="13. Changes to these terms">
        <p className="legal-text">
          We may update these terms from time to time. The date at the top of this page shows when they were last changed. The terms that apply to your application are the ones in force when you submitted it.
        </p>
      </LegalSection>

      <LegalSection title="14. Law that applies">
        <p className="legal-text">
          These terms are governed by the laws of the Federal Republic of Nigeria. Any dispute will be handled by the courts of <CompanyValue k="courtLocation" />, Nigeria.
        </p>
      </LegalSection>

      <LegalSection title="15. Contact us">
        <address className="legal-address">
          {COMPANY.legalName}<br />
          <CompanyValue k="registeredAddress" /><br />
          Email: <CompanyEmail />
        </address>
      </LegalSection>
    </LegalLayout>
  );
}
