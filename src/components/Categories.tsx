import { 
  UtensilsCrossed, 
  Palette, 
  Wrench, 
  ShoppingBag, 
  Camera, 
  Music, 
  Leaf, 
  Scissors,
  Plane,        // Travel & Leisure
  Cpu,             // Technology & Innovation
  Users,           // Freelance / Gigs
  Heart,           // Community & Social
  Truck,           // Transportation & Mobility
  Dumbbell,        // Fitness & Wellness
  BookOpen,        // Education & Tutoring
  TreeDeciduous          // Parks & Nature
} from "lucide-react";
import CategoryCard from "./CategoryCard";

const categories = [
  { name: "Food & Dining", icon: UtensilsCrossed, count: 156, color: "#f59e0b" },
  { name: "Arts & Crafts", icon: Palette, count: 89, color: "#ec4899" },
  { name: "Services", icon: Wrench, count: 124, color: "#3b82f6" },
  { name: "Fashion", icon: ShoppingBag, count: 67, color: "#8b5cf6" },
  { name: "Photography", icon: Camera, count: 45, color: "#06b6d4" },
  { name: "Music", icon: Music, count: 38, color: "#ef4444" },
  { name: "Plants & Garden", icon: Leaf, count: 52, color: "#22c55e" },
  { name: "Beauty", icon: Scissors, count: 73, color: "#f472b6" },

  // New Categories
  { name: "Travel & Leisure", icon: Plane, count: 41, color: "#0ea5e9" },
  { name: "Technology & Innovation", icon: Cpu, count: 29, color: "#6366f1" },
  { name: "Freelance / Gigs", icon: Users, count: 56, color: "#f59e0b" },
  { name: "Community & Social", icon: Heart, count: 64, color: "#ef4444" },
  { name: "Transportation & Mobility", icon: Truck, count: 33, color: "#3b82f6" },
  { name: "Fitness & Wellness", icon: Dumbbell, count: 48, color: "#22c55e" },
  { name: "Education & Tutoring", icon: BookOpen, count: 37, color: "#8b5cf6" },
  { name: "Parks & Nature", icon: TreeDeciduous, count: 22, color: "#16a34a" },
];

const Categories = () => {
  return (
    <section className="py-24">
      <div className="container px-4">
        {/* Section header */}
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
            Find exactly what you're looking for. From homemade food to custom crafts, 
            we've got every hustle covered.
          </p>
        </div>

        {/* Category grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
          {categories.map((category, index) => (
            <div 
              key={category.name}
              className="animate-slide-up"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <CategoryCard {...category} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
