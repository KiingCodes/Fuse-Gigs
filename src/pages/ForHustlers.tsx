import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { 
  Rocket, 
  Users, 
  BarChart3, 
  Shield, 
  Star, 
  ArrowRight,
  Check
} from "lucide-react";

const benefits = [
  {
    icon: Users,
    title: "Reach More Customers",
    description: "Connect with thousands of local explorers actively looking for unique businesses like yours."
  },
  {
    icon: BarChart3,
    title: "Track Your Growth",
    description: "Monitor visits, reviews, and engagement with our built-in analytics dashboard."
  },
  {
    icon: Shield,
    title: "Build Trust",
    description: "Showcase reviews and ratings from real customers to build credibility."
  },
  {
    icon: Star,
    title: "Get Featured",
    description: "Stand out with featured listings and special promotions."
  }
];

const steps = [
  {
    number: "01",
    title: "Create Your Account",
    description: "Sign up for free and set up your hustler profile in minutes."
  },
  {
    number: "02",
    title: "Add Your Hustle",
    description: "Upload photos, write your story, and add contact details."
  },
  {
    number: "03",
    title: "Start Getting Discovered",
    description: "Your hustle goes live and explorers can find you immediately."
  }
];

const ForHustlers = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-16">
        {/* Hero */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl" />
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />
          </div>
          
          <div className="container px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8">
                <Rocket className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">Join 500+ Local Hustlers</span>
              </div>
              
              <h1 className="font-display text-5xl md:text-6xl font-bold text-foreground mb-6">
                Turn Your Passion Into
                <span className="text-gradient block">a Thriving Business</span>
              </h1>
              
              <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
                Side Quest connects passionate entrepreneurs with local customers. 
                List your business for free and start growing your community today.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/auth?signup=true&hustler=true">
                  <Button variant="hero" size="xl">
                    Become a Hustler
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
                <Link to="/explore">
                  <Button variant="outline" size="xl">
                    Explore Hustles
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-24 bg-muted/30">
          <div className="container px-4">
            <div className="text-center mb-16">
              <h2 className="font-display text-4xl font-bold text-foreground mb-4">
                Why Hustlers Love Us
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Everything you need to grow your local business, all in one place.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {benefits.map((benefit) => (
                <div 
                  key={benefit.title}
                  className="bg-card rounded-2xl p-6 border border-border hover:shadow-card-hover transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <benefit.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-display text-xl font-bold text-card-foreground mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {benefit.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it Works */}
        <section className="py-24">
          <div className="container px-4">
            <div className="text-center mb-16">
              <h2 className="font-display text-4xl font-bold text-foreground mb-4">
                Get Started in 3 Easy Steps
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Listing your hustle takes less than 5 minutes.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {steps.map((step, index) => (
                <div key={step.number} className="relative">
                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-border -translate-x-1/2" />
                  )}
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-full bg-gradient-hero flex items-center justify-center mx-auto mb-4">
                      <span className="font-display text-xl font-bold text-primary-foreground">
                        {step.number}
                      </span>
                    </div>
                    <h3 className="font-display text-xl font-bold text-foreground mb-2">
                      {step.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section className="py-24 bg-muted/30">
          <div className="container px-4">
            <div className="max-w-lg mx-auto text-center">
              <h2 className="font-display text-4xl font-bold text-foreground mb-4">
                Free to Start
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                No hidden fees. No subscriptions. Just grow your business.
              </p>
              
              <div className="bg-card rounded-2xl p-8 border-2 border-primary">
                <div className="mb-6">
                  <span className="font-display text-5xl font-bold text-foreground">$0</span>
                  <span className="text-muted-foreground">/forever</span>
                </div>
                
                <ul className="space-y-3 mb-8 text-left">
                  {[
                    "Unlimited hustle listings",
                    "Analytics dashboard",
                    "Customer reviews",
                    "Direct messaging",
                    "Featured listing opportunities"
                  ].map((feature) => (
                    <li key={feature} className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-primary" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Link to="/auth?signup=true&hustler=true">
                  <Button className="w-full" size="lg">
                    Get Started Free
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24">
          <div className="container px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="font-display text-4xl font-bold text-foreground mb-6">
                Ready to Share Your Hustle?
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Join hundreds of local entrepreneurs and start connecting with customers today.
              </p>
              <Link to="/auth?signup=true&hustler=true">
                <Button variant="hero" size="xl">
                  Become a Hustler
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ForHustlers;
