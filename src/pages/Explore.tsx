import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, MapPin, Star, ArrowUpRight, Filter } from "lucide-react";

interface Hustle {
  id: string;
  name: string;
  description: string | null;
  location: string | null;
  image_url: string | null;
  is_featured: boolean;
  category_id: string | null;
  categories: {
    name: string;
    slug: string;
  } | null;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

const Explore = () => {
  const [hustles, setHustles] = useState<Hustle[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
    fetchHustles();
  }, []);

  const fetchCategories = async () => {
    const { data } = await supabase
      .from("categories")
      .select("id, name, slug")
      .order("display_order");
    if (data) setCategories(data);
  };

  const fetchHustles = async () => {
    setLoading(true);
    let query = supabase
      .from("hustles")
      .select(`
        id,
        name,
        description,
        location,
        image_url,
        is_featured,
        category_id,
        categories (
          name,
          slug
        )
      `)
      .eq("is_active", true)
      .order("is_featured", { ascending: false })
      .order("created_at", { ascending: false });

    if (selectedCategory) {
      query = query.eq("category_id", selectedCategory);
    }

    const { data } = await query;
    if (data) setHustles(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchHustles();
  }, [selectedCategory]);

  const filteredHustles = hustles.filter(
    (hustle) =>
      hustle.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hustle.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hustle.location?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
              Explore Local Hustles
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover amazing local businesses and entrepreneurs in your community
            </p>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search hustles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2">
              <Button
                variant={selectedCategory === null ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(null)}
              >
                All
              </Button>
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className="whitespace-nowrap"
                >
                  {category.name}
                </Button>
              ))}
            </div>
          </div>

          {/* Results */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : filteredHustles.length === 0 ? (
            <div className="text-center py-20">
              <h3 className="text-xl font-semibold text-foreground mb-2">No hustles found</h3>
              <p className="text-muted-foreground mb-6">
                {searchQuery || selectedCategory
                  ? "Try adjusting your search or filters"
                  : "Be the first to create a hustle!"}
              </p>
              <Link to="/auth?signup=true&hustler=true">
                <Button>Become a Hustler</Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredHustles.map((hustle) => (
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
                    {hustle.categories && (
                      <span className="inline-block px-3 py-1 text-xs font-medium bg-accent/10 text-accent rounded-full mb-3">
                        {hustle.categories.name}
                      </span>
                    )}

                    <h3 className="font-display text-xl font-bold text-card-foreground mb-2 group-hover:text-primary transition-colors">
                      {hustle.name}
                    </h3>

                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {hustle.description || "No description available"}
                    </p>

                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      {hustle.location && (
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <MapPin className="w-4 h-4" />
                          <span className="text-sm">{hustle.location}</span>
                        </div>
                      )}
                    </div>
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

export default Explore;
