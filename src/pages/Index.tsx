import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FeaturedQuests from "@/components/FeaturedQuests";
import Categories from "@/components/Categories";
import Testimonials from "@/components/Testimonials";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-16">
        <HeroSection />
        <FeaturedQuests />
        <Categories />
        <Testimonials />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
