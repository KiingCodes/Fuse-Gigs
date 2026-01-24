import QuestCard from "./QuestCard";

const quests = [
  {
    name: "Maria's Kitchen",
    category: "Food & Catering",
    description: "Authentic homemade Mexican cuisine passed down through generations. Tacos, tamales, and more!",
    location: "Downtown",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&auto=format&fit=crop",
    featured: true,
  },
  {
    name: "The Vinyl Den",
    category: "Music & Entertainment",
    description: "Curated collection of rare vinyl records and vintage audio equipment. A music lover's paradise.",
    location: "Arts District",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1483412033650-1015ddeb83d1?w=800&auto=format&fit=crop",
  },
  {
    name: "Green Thumb Gardens",
    category: "Plants & Gardening",
    description: "Urban plant nursery specializing in rare succulents and indoor plants. Expert advice included!",
    location: "Midtown",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&auto=format&fit=crop",
  },
  {
    name: "Stitch & Story",
    category: "Handmade Crafts",
    description: "Custom embroidery and handcrafted textile art. Each piece tells a unique story.",
    location: "Old Town",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&auto=format&fit=crop",
  },
  {
    name: "Fix-It Felix",
    category: "Repair Services",
    description: "Electronic repair specialist. From vintage radios to modern smartphones, nothing is unfixable.",
    location: "Industrial Zone",
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&auto=format&fit=crop",
  },
  {
    name: "The Bake House",
    category: "Bakery & Desserts",
    description: "Artisan sourdough bread and French pastries. Fresh from the oven every morning.",
    location: "Riverside",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&auto=format&fit=crop",
  },
];

const FeaturedQuests = () => {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container px-4">
        {/* Section header */}
        <div className="text-center mb-16 animate-fade-in">
          <span className="inline-block px-4 py-1.5 text-sm font-medium bg-primary/10 text-primary rounded-full mb-4">
            Trending Now
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            Featured Quests
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover the most loved local businesses and hustlers in your area. 
            Each one has been handpicked by our community.
          </p>
        </div>

        {/* Quest grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {quests.map((quest, index) => (
            <div 
              key={quest.name} 
              className="animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <QuestCard {...quest} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedQuests;
