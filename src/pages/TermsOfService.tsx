import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container px-4 max-w-4xl">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-8">
            Terms of Service
          </h1>

          <div className="prose prose-lg max-w-none text-muted-foreground space-y-6">
            <p className="text-lg">
              <strong>Last updated:</strong> January 2026
            </p>

            <p>
              These Terms of Service (“Terms”) govern your access to and use of
              the Fuse Gigs platform, website, mobile applications, and related
              services (collectively, the “Services”). “Fuse Gigs”, “we”, “us”,
              or “our” refers to the operators of the platform.
            </p>

            <p>
              By accessing or using Fuse Gigs, you agree to be legally bound by
              these Terms. If you do not agree, you must not use the Services.
            </p>

            {/* 1 */}
            <section>
              <h2 className="text-2xl font-display font-bold text-foreground mt-8 mb-4">
                1. Eligibility
              </h2>
              <p>
                You must be at least 18 years old and capable of entering into a
                legally binding agreement to use Fuse Gigs. By using the
                Services, you represent and warrant that you meet these
                requirements.
              </p>
            </section>

            {/* 2 */}
            <section>
              <h2 className="text-2xl font-display font-bold text-foreground mt-8 mb-4">
                2. Account Registration
              </h2>
              <p>
                To access certain features, you may be required to create an
                account. You agree to provide accurate, complete, and current
                information and to keep your account details updated.
              </p>
              <p>
                You are solely responsible for safeguarding your account
                credentials and for all activity that occurs under your
                account.
              </p>
            </section>

            {/* 3 */}
            <section>
              <h2 className="text-2xl font-display font-bold text-foreground mt-8 mb-4">
                3. Platform Role & Disclaimer
              </h2>
              <p>
                Fuse Gigs is a discovery and connection platform. We do not
                provide, control, endorse, or guarantee any hustles, services,
                products, or users listed on the platform.
              </p>
              <p>
                Any agreement, transaction, or interaction between users is
                solely between those users. Fuse Gigs is not a party to such
                transactions and assumes no responsibility or liability.
              </p>
            </section>

            {/* 4 */}
            <section>
              <h2 className="text-2xl font-display font-bold text-foreground mt-8 mb-4">
                4. User Content
              </h2>
              <p>
                You retain ownership of any content you submit, post, or display
                on Fuse Gigs (“User Content”).
              </p>
              <p>
                By submitting User Content, you grant Fuse Gigs a worldwide,
                non-exclusive, royalty-free, sublicensable license to use,
                host, store, reproduce, modify, display, and distribute such
                content for the purpose of operating and promoting the
                Services.
              </p>
              <p>
                You represent that you have all necessary rights to submit the
                content and that it does not infringe any third-party rights.
              </p>
            </section>

            {/* 5 */}
            <section>
              <h2 className="text-2xl font-display font-bold text-foreground mt-8 mb-4">
                5. Prohibited Conduct
              </h2>
              <p>
                You agree not to:
              </p>
              <ul>
                <li>Violate any applicable law or regulation</li>
                <li>Post false, misleading, or fraudulent information</li>
                <li>Impersonate another person or entity</li>
                <li>Harass, abuse, or harm other users</li>
                <li>Upload malicious code or attempt to compromise the platform</li>
                <li>Scrape, reverse engineer, or exploit the Services</li>
                <li>Use the platform for unlawful or unauthorized purposes</li>
              </ul>
            </section>

            {/* 6 */}
            <section>
              <h2 className="text-2xl font-display font-bold text-foreground mt-8 mb-4">
                6. Suspension & Termination
              </h2>
              <p>
                We reserve the right to suspend or terminate your access to the
                Services at any time, with or without notice, if you violate
                these Terms or if we reasonably believe your conduct may harm
                the platform or other users.
              </p>
            </section>

            {/* 7 */}
            <section>
              <h2 className="text-2xl font-display font-bold text-foreground mt-8 mb-4">
                7. Intellectual Property
              </h2>
              <p>
                All platform content, trademarks, logos, designs, and software,
                excluding User Content, are the exclusive property of Side
                Quest or its licensors and are protected by intellectual
                property laws.
              </p>
            </section>

            {/* 8 */}
            <section>
              <h2 className="text-2xl font-display font-bold text-foreground mt-8 mb-4">
                8. Disclaimer of Warranties
              </h2>
              <p>
                The Services are provided on an “as is” and “as available”
                basis. Fuse Gigs disclaims all warranties, express or implied,
                including merchantability, fitness for a particular purpose,
                and non-infringement.
              </p>
            </section>

            {/* 9 */}
            <section>
              <h2 className="text-2xl font-display font-bold text-foreground mt-8 mb-4">
                9. Limitation of Liability
              </h2>
              <p>
                To the maximum extent permitted by law, Fuse Gigs shall not be
                liable for any indirect, incidental, consequential, special,
                or punitive damages arising out of or related to your use of
                the Services.
              </p>
            </section>

            {/* 10 */}
            <section>
              <h2 className="text-2xl font-display font-bold text-foreground mt-8 mb-4">
                10. Indemnification
              </h2>
              <p>
                You agree to indemnify and hold harmless Fuse Gigs from any
                claims, damages, liabilities, and expenses arising from your
                use of the Services or violation of these Terms.
              </p>
            </section>

            {/* 11 */}
            <section>
              <h2 className="text-2xl font-display font-bold text-foreground mt-8 mb-4">
                11. Governing Law
              </h2>
              <p>
                These Terms are governed by the laws of the Republic of South
                Africa, without regard to conflict of law principles.
              </p>
            </section>

            {/* 12 */}
            <section>
              <h2 className="text-2xl font-display font-bold text-foreground mt-8 mb-4">
                12. Changes to These Terms
              </h2>
              <p>
                We may update these Terms from time to time. Continued use of
                the Services after changes take effect constitutes acceptance
                of the revised Terms.
              </p>
            </section>

            {/* 13 */}
            <section>
              <h2 className="text-2xl font-display font-bold text-foreground mt-8 mb-4">
                13. Contact Information
              </h2>
              <p>
                If you have questions regarding these Terms, please contact us
                at:
              </p>
              <p>
                <strong>Email:</strong> kiingcodes@outlook.com
                <br />
                <strong>Location:</strong> South Africa
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TermsOfService;
