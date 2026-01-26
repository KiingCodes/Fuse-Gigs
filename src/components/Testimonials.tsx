import { Quote } from "lucide-react";

const Testimonials = () => {
  return (
    <section className="py-24 bg-gradient-dark">
      <div className="container px-4">
        {/* Section header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 text-sm font-medium bg-primary/20 text-primary rounded-full mb-4">
            Community Voices
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-secondary-foreground mb-4">
            Testimonials
          </h2>
          <p className="text-lg text-secondary-foreground/70 max-w-2xl mx-auto">
            We’re just getting started. Real stories from our community will appear here soon.
          </p>
        </div>

        {/* Empty state */}
        <div className="max-w-2xl mx-auto">
          <div className="relative bg-secondary/30 backdrop-blur-sm rounded-2xl p-10 border border-secondary-foreground/10 text-center">
            <Quote className="mx-auto mb-6 w-12 h-12 text-primary/30" />

            <h3 className="font-display text-2xl font-semibold text-secondary-foreground mb-3">
              No testimonials yet
            </h3>

            <p className="text-secondary-foreground/70 leading-relaxed">
              Side Quest is growing. As real users discover, build, and hustle
              through the platform, their experiences will be shared here.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;

