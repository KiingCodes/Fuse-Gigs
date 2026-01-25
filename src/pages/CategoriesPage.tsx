import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { 
  UtensilsCrossed, 
  Palette, 
  Wrench, 
  ShoppingBag, 
  Camera, 
  Music, 
  Leaf, 
  Scissors,
  LucideIcon
} from "lucide-react";

interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  color: string;
  hustle_count: number;
}

const iconMap: Record<string, LucideIcon> = {
  UtensilsCrossed,
  Palette,
  Wrench,
  ShoppingBag,
  Camera,
  Music,
  Leaf,
  Scissors
};

const CategoriesPage = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      const { data } = await supabase
        .from("categories")
        .select("*")
        .order("display_order");
      
      if (data) setCategories(data);
      setLoading(false);
    };

    fetchCategories();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container px-4">
          <div className="text-center mb-12">
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
              Browse Categories
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Find exactly what you're looking for. From homemade food to custom crafts.
            </p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {categories.map((category) => {
                const Icon = iconMap[category.icon] || Wrench;
                return (
                  <Link
                    key={category.id}
                    to={`/categories/${category.slug}`}
                    className="group bg-card rounded-2xl p-6 border border-border hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1"
                  >
                    <div 
                      className="w-14 h-14 rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110"
                      style={{ backgroundColor: `${category.color}20` }}
                    >
                      <Icon className="w-7 h-7" style={{ color: category.color }} />
                    </div>
                    <h3 className="font-display text-lg font-bold text-card-foreground mb-1 group-hover:text-primary transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {category.hustle_count} {category.hustle_count === 1 ? 'hustle' : 'hustles'}
                    </p>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CategoriesPage;
