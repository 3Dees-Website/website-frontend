import { LegalLayout, LegalSection, CompanyEmail } from '../components/LegalLayout';
import { COMPANY } from '../constants/company';

// Wording from docs/legal-pages-content.md (Page 3) — do not edit here
// without updating that source; a lawyer reviews it before launch.
// Section ids are the targets of the Declarations panel's "Read more" links
// (src/constants/declarationPanel.js).
export function Declaration() {
  return (
    <LegalLayout title="Applicant Declarations">
      <div className="legal-card">
        <p className="legal-text">
          When you apply for a job through 3DEES, you make the declarations and give the consents set out below. Each one has its own tick-box on the application form. Please read them carefully.
        </p>
        <p className="legal-text">
          You can withdraw a consent at any time by emailing <CompanyEmail /> with your application reference number. If you do, we may not be able to continue with your application.
        </p>
      </div>

      <LegalSection id="accuracy" title="Accuracy of information">
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
      </LegalSection>

      <LegalSection id="background-check" title="Background check">
        <p className="legal-text">
          I consent to {COMPANY.legalName}, and the employer I am applying to, checking the information in my application. This may include confirming my identity, qualifications, professional licences and employment history with the schools, institutions, licensing bodies and former employers concerned.
        </p>
        <p className="legal-text">
          Where the role requires it, this may also include a police check, a medical examination or a drug test. I will be told before any of these is carried out.
        </p>
      </LegalSection>

      <LegalSection id="reference-check" title="Reference check">
        <p className="legal-text">
          I consent to {COMPANY.legalName}, and the employer I am applying to, contacting the referees I have named, to ask about my work, conduct and suitability for the role.
        </p>
        <p className="legal-text">
          I confirm that my referees know I have named them and have agreed to be contacted.
        </p>
      </LegalSection>

      <LegalSection id="medical-fitness" title="Medical fitness">
        <p className="legal-text legal-note">This declaration only appears on jobs that need it.</p>
        <p className="legal-text">
          I declare that, to the best of my knowledge, I am physically and mentally fit to carry out the duties of the role I am applying for.
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
      </LegalSection>
    </LegalLayout>
  );
}
