import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import QuestCard from "./QuestCard";

interface Hustle {
  id: string;
  name: string;
  description: string | null;
  location: string | null;
  image_url: string | null;
  is_featured: boolean | null;
  category: {
    name: string;
  } | null;
}

const FeaturedQuests = () => {
  const [hustles, setHustles] = useState<Hustle[]>([]);

  useEffect(() => {
    const fetchFeaturedHustles = async () => {
      const { data } = await supabase
        .from("hustles")
        .select(`
          id,
          name,
          description,
          location,
          image_url,
          is_featured,
          category:categories(name)
        `)
        .eq("is_active", true)
        .order("created_at", { ascending: false })
        .limit(6);
      
      if (data) {
        setHustles(data as Hustle[]);
      }
    };

    fetchFeaturedHustles();
  }, []);

  // Fallback data when no hustles exist
  const fallbackQuests = [
    {
      id: "1",
      name: "Maria's Kitchen",
      category: { name: "Food & Catering" },
      description: "Authentic homemade Mexican cuisine passed down through generations. Tacos, tamales, and more!",
      location: "Downtown",
      image_url: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&auto=format&fit=crop",
      is_featured: true,
    },
    {
      id: "2",
      name: "The Vinyl Den",
      category: { name: "Music & Entertainment" },
      description: "Curated collection of rare vinyl records and vintage audio equipment. A music lover's paradise.",
      location: "Arts District",
      image_url: "https://images.unsplash.com/photo-1483412033650-1015ddeb83d1?w=800&auto=format&fit=crop",
      is_featured: false,
    },
    {
      id: "3",
      name: "Green Thumb Gardens",
      category: { name: "Plants & Gardening" },
      description: "Urban plant nursery specializing in rare succulents and indoor plants. Expert advice included!",
      location: "Midtown",
      image_url: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&auto=format&fit=crop",
      is_featured: false,
    },
    {
      id: "4",
      name: "Stitch & Story",
      category: { name: "Handmade Crafts" },
      description: "Custom embroidery and handcrafted textile art. Each piece tells a unique story.",
      location: "Old Town",
      image_url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&auto=format&fit=crop",
      is_featured: false,
    },
    {
      id: "5",
      name: "Fix-It Felix",
      category: { name: "Repair Services" },
      description: "Electronic repair specialist. From vintage radios to modern smartphones, nothing is unfixable.",
      location: "Industrial Zone",
      image_url: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&auto=format&fit=crop",
      is_featured: false,
    },
    {
      id: "6",
      name: "The Bake House",
      category: { name: "Bakery & Desserts" },
      description: "Artisan sourdough bread and French pastries. Fresh from the oven every morning.",
      location: "Riverside",
      image_url: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&auto=format&fit=crop",
      is_featured: false,
    },
  ];

  const displayHustles = hustles.length > 0 ? hustles : fallbackQuests;

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
          {displayHustles.map((hustle, index) => (
            <Link 
              key={hustle.id} 
              to={hustles.length > 0 ? `/hustle/${hustle.id}` : "#"}
              className="animate-slide-up block"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <QuestCard 
                name={hustle.name}
                category={hustle.category?.name || "Uncategorized"}
                description={hustle.description || ""}
                location={hustle.location || ""}
                rating={4.8}
                image={hustle.image_url || "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&auto=format&fit=crop"}
                featured={hustle.is_featured || false}
              />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedQuests;