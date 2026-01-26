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
              Last updated: January 2026
            </p>

            <section>
              <h2 className="text-2xl font-display font-bold text-foreground mt-8 mb-4">
                1. Acceptance of Terms
              </h2>
              <p>
                By accessing or using Side Quest, you agree to be bound by these Terms of Service. 
                If you do not agree to these terms, please do not use our services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-display font-bold text-foreground mt-8 mb-4">
                2. Use of Services
              </h2>
              <p>
                You may use our services only in compliance with these Terms and all applicable laws. 
                You are responsible for maintaining the confidentiality of your account credentials.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-display font-bold text-foreground mt-8 mb-4">
                3. User Content
              </h2>
              <p>
                You retain ownership of content you submit to Side Quest. By posting content, you grant 
                us a license to use, display, and distribute that content in connection with our services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-display font-bold text-foreground mt-8 mb-4">
                4. Prohibited Conduct
              </h2>
              <p>
                You agree not to engage in any activity that interferes with our services, impersonates 
                others, or violates any applicable laws or regulations.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-display font-bold text-foreground mt-8 mb-4">
                5. Limitation of Liability
              </h2>
              <p>
                Side Quest is provided "as is" without warranties of any kind. We are not liable for 
                any damages arising from your use of our services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-display font-bold text-foreground mt-8 mb-4">
                6. Contact
              </h2>
              <p>
                For questions about these Terms, contact us at hello@sidequest.app.
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
