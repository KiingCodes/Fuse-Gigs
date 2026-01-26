import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import {
  UtensilsCrossed,
  Palette,
  Wrench,
  ShoppingBag,
  Camera,
  Music,
  Leaf,
  Scissors,
  Plane,
  Cpu,
  Users,
  Heart,
  Truck,
  Dumbbell,
  BookOpen,
  TreeDeciduous,
  LucideIcon,
} from "lucide-react";
import CategoryCard from "./CategoryCard";

/* -----------------------------
   Types
------------------------------ */
interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  color: string;
  hustle_count: number | null;
}

/* -----------------------------
   Icon Mapping (SAFE & TYPED)
------------------------------ */
const iconMap: Record<string, LucideIcon> = {
  UtensilsCrossed,
  Palette,
  Wrench,
  ShoppingBag,
  Camera,
  Music,
  Leaf,
  Scissors,
  Plane,
  Cpu,
  Users,
  Heart,
  Truck,
  Dumbbell,
  BookOpen,
  TreeDeciduous,
};

/* -----------------------------
   Component
------------------------------ */
const Categories = () => {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("display_order");

      if (!error && data) {
        setCategories(data);
      }
    };

    fetchCategories();
  }, []);

  return (
    <section className="py-24">
      <div className="container px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
          <div>
            <span className="inline-block px-4 py-1.5 text-sm font-medium bg-accent/10 text-accent rounded-full mb-4">
              Explore
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground">
              Browse by Category
            </h2>
          </div>
          <p className="text-muted-foreground max-w-md mt-4 md:mt-0">
            Find exactly what you're looking for. From homemade food to custom
            crafts, we’ve got every hustle covered.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
          {categories.map((category, index) => {
            const Icon = iconMap[category.icon] ?? Wrench;

            return (
              <Link
                key={category.id}
                to={`/categories/${category.slug}`}
                className="animate-slide-up"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <CategoryCard
                  name={category.name}
                  icon={Icon}
                  count={category.hustle_count ?? 0}
                  color={category.color}
                />
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Categories;
