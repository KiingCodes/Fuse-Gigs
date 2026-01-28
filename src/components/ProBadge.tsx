import { Badge } from "@/components/ui/badge";
import { Crown, Shield } from "lucide-react";

interface ProBadgeProps {
  type: "hustler" | "employer";
  size?: "sm" | "default";
}

const ProBadge = ({ type, size = "default" }: ProBadgeProps) => {
  const isHustler = type === "hustler";
  
  return (
    <Badge
      variant="secondary"
      className={`${
        isHustler
          ? "bg-gradient-to-r from-primary to-primary/80"
          : "bg-gradient-to-r from-secondary to-secondary/80"
      } text-white border-0 ${size === "sm" ? "text-xs px-2 py-0.5" : ""}`}
    >
      {isHustler ? (
        <Crown className={`${size === "sm" ? "w-3 h-3" : "w-4 h-4"} mr-1`} />
      ) : (
        <Shield className={`${size === "sm" ? "w-3 h-3" : "w-4 h-4"} mr-1`} />
      )}
      {isHustler ? "Pro Hustler" : "Verified Business"}
    </Badge>
  );
};

export default ProBadge;
