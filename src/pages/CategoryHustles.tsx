import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { MapPin, ArrowUpRight, ArrowLeft } from "lucide-react";

interface Hustle {
  id: string;
  name: string;
  description: string | null;
  location: string | null;
  image_url: string | null;
  is_featured: boolean;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

const CategoryHustles = () => {
  const { slug } = useParams<{ slug: string }>();
  const [hustles, setHustles] = useState<Hustle[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!slug) return;

      // Fetch category
      const { data: categoryData } = await supabase
        .from("categories")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();

      if (categoryData) {
        setCategory(categoryData);

        // Fetch hustles in this category
        const { data: hustlesData } = await supabase
          .from("hustles")
          .select("id, name, description, location, image_url, is_featured")
          .eq("category_id", categoryData.id)
          .eq("is_active", true)
          .order("is_featured", { ascending: false })
          .order("created_at", { ascending: false });

        if (hustlesData) setHustles(hustlesData);
      }

      setLoading(false);
    };

    fetchData();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center py-40">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex flex-col items-center justify-center py-40">
          <h2 className="text-2xl font-bold text-foreground mb-4">Category not found</h2>
          <Link to="/categories">
            <Button>View All Categories</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container px-4">
          <Link 
            to="/categories" 
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            All Categories
          </Link>

          <div className="mb-12">
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
              {category.name}
            </h1>
            <p className="text-lg text-muted-foreground">
              Discover {hustles.length} {hustles.length === 1 ? 'hustle' : 'hustles'} in this category
            </p>
          </div>

          {hustles.length === 0 ? (
            <div className="text-center py-20">
              <h3 className="text-xl font-semibold text-foreground mb-2">No hustles yet</h3>
              <p className="text-muted-foreground mb-6">
                Be the first to add a hustle in this category!
              </p>
              <Link to="/auth?signup=true&hustler=true">
                <Button>Become a Hustler</Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {hustles.map((hustle) => (
                <Link
                  key={hustle.id}
                  to={`/hustle/${hustle.id}`}
                  className="group relative bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-500 hover:-translate-y-2"
                >
                  {hustle.is_featured && (
                    <div className="absolute top-4 left-4 z-20 px-3 py-1 bg-gradient-hero rounded-full">
                      <span className="text-xs font-semibold text-primary-foreground">Featured</span>
                    </div>
                  )}

                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={hustle.image_url || "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&auto=format&fit=crop"}
                      alt={hustle.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent" />
                    
                    <div className="absolute top-4 right-4 w-10 h-10 bg-background/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                      <ArrowUpRight className="w-5 h-5 text-foreground" />
                    </div>
                  </div>

                  <div className="p-5">
                    <h3 className="font-display text-xl font-bold text-card-foreground mb-2 group-hover:text-primary transition-colors">
                      {hustle.name}
                    </h3>

                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {hustle.description || "No description available"}
                    </p>

                    {hustle.location && (
                      <div className="flex items-center gap-1.5 text-muted-foreground pt-4 border-t border-border">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm">{hustle.location}</span>
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CategoryHustles;
