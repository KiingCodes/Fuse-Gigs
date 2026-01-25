import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, MapPin, Users } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '-3s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="container relative z-10 px-4 py-20">
        <div className="max-w-4xl mx-auto text-center animate-slide-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Discover Local Heroes</span>
          </div>

          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold leading-tight mb-6">
            Your Next
            <span className="text-gradient block">Side Quest</span>
            Awaits
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            Connect with passionate hustlers and small businesses in your community. 
            Every local shop is an adventure waiting to be discovered.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link to="/explore">
              <Button variant="hero" size="xl">
                Start Exploring
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link to="/auth?signup=true&hustler=true">
              <Button variant="heroOutline" size="xl">
                Join as a Hustler
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 text-3xl md:text-4xl font-display font-bold text-foreground mb-1">
                <MapPin className="w-6 h-6 text-primary" />
                500+
              </div>
              <p className="text-sm text-muted-foreground">Local Businesses</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 text-3xl md:text-4xl font-display font-bold text-foreground mb-1">
                <Users className="w-6 h-6 text-accent" />
                10K+
              </div>
              <p className="text-sm text-muted-foreground">Active Explorers</p>
            </div>
            <div className="text-center col-span-2 md:col-span-1">
              <div className="flex items-center justify-center gap-2 text-3xl md:text-4xl font-display font-bold text-foreground mb-1">
                <Sparkles className="w-6 h-6 text-primary" />
                50+
              </div>
              <p className="text-sm text-muted-foreground">Categories</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
