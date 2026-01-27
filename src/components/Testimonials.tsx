import { useState, useEffect } from "react";
import { Quote, Star, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import TestimonialForm from "./TestimonialForm";

interface Testimonial {
  id: string;
  name: string;
  role: string | null;
  content: string;
  rating: number;
  created_at: string;
}

const Testimonials = () => {
  const { user } = useAuth();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);

  const fetchTestimonials = async () => {
    const { data } = await supabase
      .from("testimonials")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(6);

    if (data) {
      setTestimonials(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleLoginRedirect = () => {
    window.location.href = "/auth";
  };

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
            {testimonials.length > 0
              ? "Hear from real hustlers who've found success through Side Quest."
              : "We're just getting started. Be the first to share your experience!"}
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center">
            <div className="animate-pulse text-secondary-foreground/50">Loading testimonials...</div>
          </div>
        ) : testimonials.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mb-12">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="relative bg-secondary/30 backdrop-blur-sm rounded-2xl p-8 border border-secondary-foreground/10"
              >
                <Quote className="absolute top-6 right-6 w-8 h-8 text-primary/20" />
                
                <div className="flex gap-0.5 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-4 h-4 ${
                        star <= testimonial.rating
                          ? "fill-primary text-primary"
                          : "text-muted-foreground"
                      }`}
                    />
                  ))}
                </div>

                <p className="text-secondary-foreground/80 mb-6 leading-relaxed line-clamp-4">
                  "{testimonial.content}"
                </p>

                <div>
                  <p className="font-semibold text-secondary-foreground">{testimonial.name}</p>
                  {testimonial.role && (
                    <p className="text-sm text-secondary-foreground/60">{testimonial.role}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="max-w-2xl mx-auto mb-12">
            <div className="relative bg-secondary/30 backdrop-blur-sm rounded-2xl p-10 border border-secondary-foreground/10 text-center">
              <Quote className="mx-auto mb-6 w-12 h-12 text-primary/30" />

              <h3 className="font-display text-2xl font-semibold text-secondary-foreground mb-3">
                No testimonials yet
              </h3>

              <p className="text-secondary-foreground/70 leading-relaxed mb-6">
                Side Quest is growing. Be the first to share your experience and inspire others to start their hustle journey!
              </p>
            </div>
          </div>
        )}

        {/* CTA Button */}
        <div className="text-center">
          <Button
            size="lg"
            variant="hero"
            onClick={user ? () => setFormOpen(true) : handleLoginRedirect}
            className="gap-2"
          >
            <Plus className="w-5 h-5" />
            {testimonials.length > 0 ? "Add Your Testimonial" : "Be the First to Add a Testimonial"}
          </Button>
        </div>
      </div>

      <TestimonialForm
        open={formOpen}
        onOpenChange={setFormOpen}
        onSuccess={fetchTestimonials}
      />
    </section>
  );
};

export default Testimonials;

