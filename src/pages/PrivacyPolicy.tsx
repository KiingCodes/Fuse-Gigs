import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container px-4 max-w-4xl">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-8">
            Privacy Policy
          </h1>

          <div className="prose prose-lg max-w-none text-muted-foreground space-y-6">
            <p className="text-lg">
              <strong>Last updated:</strong> January 2026
            </p>

            <p>
              Fuse Gigs (“we”, “our”, or “us”) is committed to protecting your
              privacy. This Privacy Policy explains how we collect, use, store,
              disclose, and safeguard your information when you use our
              platform, website, and related services (collectively, the
              “Services”).
            </p>

            <p>
              By accessing or using Fuse Gigs, you agree to the practices
              described in this Privacy Policy.
            </p>

            {/* 1 */}
            <section>
              <h2 className="text-2xl font-display font-bold text-foreground mt-8 mb-4">
                1. Information We Collect
              </h2>

              <p>
                We collect information in the following ways:
              </p>

              <ul>
                <li>
                  <strong>Personal Information:</strong> Name, email address,
                  phone number, profile details, business information, and any
                  content you submit when creating an account, listing a hustle,
                  contacting us, or communicating with other users.
                </li>
                <li>
                  <strong>Account & Usage Data:</strong> Login activity,
                  preferences, interactions, page views, and features used.
                </li>
                <li>
                  <strong>Communications:</strong> Messages, support requests,
                  and feedback you send to us.
                </li>
                <li>
                  <strong>Technical Data:</strong> IP address, device type,
                  browser type, operating system, and anonymized analytics data.
                </li>
              </ul>
            </section>

            {/* 2 */}
            <section>
              <h2 className="text-2xl font-display font-bold text-foreground mt-8 mb-4">
                2. How We Use Your Information
              </h2>

              <p>
                We use your information to:
              </p>

              <ul>
                <li>Provide, operate, and maintain the Side Quest platform</li>
                <li>Create and manage user accounts</li>
                <li>Enable hustlers to list and promote their businesses</li>
                <li>Facilitate communication between users</li>
                <li>Respond to inquiries, feedback, and support requests</li>
                <li>Improve performance, features, and user experience</li>
                <li>Send service-related notifications and updates</li>
                <li>Detect, prevent, and address fraud or misuse</li>
                <li>Comply with legal and regulatory obligations</li>
              </ul>
            </section>

            {/* 3 */}
            <section>
              <h2 className="text-2xl font-display font-bold text-foreground mt-8 mb-4">
                3. Legal Basis for Processing
              </h2>

              <p>
                We process personal information based on one or more of the
                following legal grounds:
              </p>

              <ul>
                <li>Your consent</li>
                <li>Performance of a contract</li>
                <li>Compliance with legal obligations</li>
                <li>Legitimate business interests that do not override your rights</li>
              </ul>
            </section>

            {/* 4 */}
            <section>
              <h2 className="text-2xl font-display font-bold text-foreground mt-8 mb-4">
                4. Information Sharing & Disclosure
              </h2>

              <p>
                We do <strong>not</strong> sell your personal information.
              </p>

              <p>
                We may share information only in the following circumstances:
              </p>

              <ul>
                <li>
                  With trusted service providers (e.g. hosting, analytics,
                  email delivery) strictly for operating the platform
                </li>
                <li>
                  When required by law, regulation, or legal process
                </li>
                <li>
                  To protect the rights, safety, and integrity of Side Quest,
                  our users, or the public
                </li>
                <li>
                  With your explicit consent
                </li>
              </ul>
            </section>

            {/* 5 */}
            <section>
              <h2 className="text-2xl font-display font-bold text-foreground mt-8 mb-4">
                5. Data Retention
              </h2>

              <p>
                We retain personal information only for as long as necessary to
                fulfill the purposes outlined in this policy, unless a longer
                retention period is required or permitted by law.
              </p>
            </section>

            {/* 6 */}
            <section>
              <h2 className="text-2xl font-display font-bold text-foreground mt-8 mb-4">
                6. Data Security
              </h2>

              <p>
                We implement appropriate technical and organizational measures
                to protect your personal information against unauthorized
                access, loss, misuse, alteration, or disclosure. However, no
                method of transmission or storage is 100% secure.
              </p>
            </section>

            {/* 7 */}
            <section>
              <h2 className="text-2xl font-display font-bold text-foreground mt-8 mb-4">
                7. Your Rights
              </h2>

              <p>
                Depending on your location, you may have the right to:
              </p>

              <ul>
                <li>Access the personal data we hold about you</li>
                <li>Request correction or deletion of your data</li>
                <li>Object to or restrict certain processing activities</li>
                <li>Withdraw consent at any time</li>
                <li>Request data portability</li>
              </ul>

              <p>
                To exercise these rights, please contact us using the details
                below.
              </p>
            </section>

            {/* 8 */}
            <section>
              <h2 className="text-2xl font-display font-bold text-foreground mt-8 mb-4">
                8. Children’s Privacy
              </h2>

              <p>
                Fuse Gigs is not intended for individuals under the age of 18.
                We do not knowingly collect personal information from children.
              </p>
            </section>

            {/* 9 */}
            <section>
              <h2 className="text-2xl font-display font-bold text-foreground mt-8 mb-4">
                9. Changes to This Policy
              </h2>

              <p>
                We may update this Privacy Policy from time to time. Any changes
                will be posted on this page with an updated revision date.
                Continued use of the platform constitutes acceptance of the
                revised policy.
              </p>
            </section>

            {/* 10 */}
            <section>
              <h2 className="text-2xl font-display font-bold text-foreground mt-8 mb-4">
                10. Contact Us
              </h2>

              <p>
                If you have questions, concerns, or requests regarding this
                Privacy Policy or your personal data, please contact us at:
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

export default PrivacyPolicy;

