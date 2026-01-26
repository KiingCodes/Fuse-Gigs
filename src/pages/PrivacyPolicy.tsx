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
              Last updated: January 2026
            </p>

            <section>
              <h2 className="text-2xl font-display font-bold text-foreground mt-8 mb-4">
                1. Information We Collect
              </h2>
              <p>
                We collect information you provide directly to us, such as when you create an account, 
                list a hustle, leave a review, or contact us for support. This may include your name, 
                email address, phone number, and any other information you choose to provide.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-display font-bold text-foreground mt-8 mb-4">
                2. How We Use Your Information
              </h2>
              <p>
                We use the information we collect to provide, maintain, and improve our services, 
                process transactions, send notifications, and communicate with you about products, 
                services, and events.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-display font-bold text-foreground mt-8 mb-4">
                3. Information Sharing
              </h2>
              <p>
                We do not sell your personal information. We may share your information with service 
                providers who assist us in operating our platform, when required by law, or with your consent.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-display font-bold text-foreground mt-8 mb-4">
                4. Data Security
              </h2>
              <p>
                We take reasonable measures to help protect your personal information from loss, theft, 
                misuse, unauthorized access, disclosure, alteration, and destruction.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-display font-bold text-foreground mt-8 mb-4">
                5. Contact Us
              </h2>
              <p>
                If you have any questions about this Privacy Policy, please contact us at hello@sidequest.app.
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
