import { Badge } from "@/components/ui/badge";
import { Crown, Shield, BadgeCheck, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProBadgeProps {
  type: "hustler" | "employer" | "business" | "verified";
  size?: "sm" | "default" | "lg";
  showLabel?: boolean;
  className?: string;
}

const ProBadge = ({ type, size = "default", showLabel = true, className }: ProBadgeProps) => {
  const configs = {
    hustler: {
      icon: Zap,
      label: "Pro Hustler",
      bgColor: "bg-gradient-to-r from-primary to-primary/80",
    },
    employer: {
      icon: BadgeCheck,
      label: "Verified Employer",
      bgColor: "bg-gradient-to-r from-secondary to-secondary/80",
    },
    business: {
      icon: Shield,
      label: "Verified Business",
      bgColor: "bg-gradient-to-r from-secondary to-secondary/80",
    },
    verified: {
      icon: Crown,
      label: "Premium",
      bgColor: "bg-gradient-to-r from-accent to-accent/80",
    },
  };

  const sizeClasses = {
    sm: "text-xs px-2 py-0.5",
    default: "text-sm px-2.5 py-1",
    lg: "text-sm px-3 py-1.5",
  };

  const iconSizes = {
    sm: "w-3 h-3",
    default: "w-4 h-4",
    lg: "w-5 h-5",
  };

  const config = configs[type];
  const Icon = config.icon;

  return (
    <Badge
      variant="secondary"
      className={cn(
        config.bgColor,
        "text-white border-0",
        sizeClasses[size],
        className
      )}
    >
      <Icon className={cn(iconSizes[size], showLabel && "mr-1")} />
      {showLabel && config.label}
    </Badge>
  );
};

export default ProBadge;
