import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Local Explorer",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop",
    content: "Side Quest helped me discover amazing local businesses I never knew existed. The homemade pasta from a neighbor is now my family's favorite!",
    rating: 5,
  },
  {
    name: "Marcus Johnson",
    role: "Hustler - Woodworking",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop",
    content: "As a small woodworking business, getting visibility was tough. Side Quest connected me with 50+ customers in my first month!",
    rating: 5,
  },
  {
    name: "Elena Rodriguez",
    role: "Community Leader",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&auto=format&fit=crop",
    content: "This app is exactly what our community needed. It's bringing neighbors together and supporting local entrepreneurs.",
    rating: 5,
  },
];

const Testimonials = () => {
  return (
    <section className="py-24 bg-gradient-dark">
      <div className="container px-4">
        {/* Section header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 text-sm font-medium bg-primary/20 text-primary rounded-full mb-4">
            Community Love
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-secondary-foreground mb-4">
            What Adventurers Say
          </h2>
          <p className="text-lg text-secondary-foreground/70 max-w-2xl mx-auto">
            Real stories from real people who found their perfect side quest.
          </p>
        </div>

        {/* Testimonials grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={testimonial.name}
              className="relative bg-secondary/30 backdrop-blur-sm rounded-2xl p-8 border border-secondary-foreground/10 animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Quote icon */}
              <Quote className="absolute top-6 right-6 w-10 h-10 text-primary/30" />
              
              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-primary fill-primary" />
                ))}
              </div>

              {/* Content */}
              <p className="text-secondary-foreground/90 mb-6 leading-relaxed">
                "{testimonial.content}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-4">
                <img 
                  src={testimonial.image} 
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-primary/30"
                />
                <div>
                  <h4 className="font-display font-semibold text-secondary-foreground">
                    {testimonial.name}
                  </h4>
                  <p className="text-sm text-secondary-foreground/60">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
