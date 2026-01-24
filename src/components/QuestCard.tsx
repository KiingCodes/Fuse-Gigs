import { MapPin, Star, ArrowUpRight } from "lucide-react";

interface QuestCardProps {
  name: string;
  category: string;
  description: string;
  location: string;
  rating: number;
  image: string;
  featured?: boolean;
}

const QuestCard = ({ name, category, description, location, rating, image, featured }: QuestCardProps) => {
  return (
    <div 
      className={`group relative bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-500 hover:-translate-y-2 ${
        featured ? 'ring-2 ring-primary' : ''
      }`}
    >
      {/* Featured badge */}
      {featured && (
        <div className="absolute top-4 left-4 z-20 px-3 py-1 bg-gradient-hero rounded-full">
          <span className="text-xs font-semibold text-primary-foreground">Featured Quest</span>
        </div>
      )}

      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img 
          src={image} 
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent" />
        
        {/* Arrow indicator */}
        <div className="absolute top-4 right-4 w-10 h-10 bg-background/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
          <ArrowUpRight className="w-5 h-5 text-foreground" />
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Category */}
        <span className="inline-block px-3 py-1 text-xs font-medium bg-accent/10 text-accent rounded-full mb-3">
          {category}
        </span>

        {/* Name */}
        <h3 className="font-display text-xl font-bold text-card-foreground mb-2 group-hover:text-primary transition-colors">
          {name}
        </h3>

        {/* Description */}
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {description}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span className="text-sm">{location}</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-primary fill-primary" />
            <span className="text-sm font-semibold text-card-foreground">{rating.toFixed(1)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestCard;
