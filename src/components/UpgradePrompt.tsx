import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Crown, Zap, TrendingUp } from "lucide-react";

interface UpgradePromptProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: "applications" | "posts";
  currentCount: number;
  limit: number;
}

const UpgradePrompt = ({ open, onOpenChange, type, currentCount, limit }: UpgradePromptProps) => {
  const navigate = useNavigate();

  const isApplications = type === "applications";
  const title = isApplications
    ? "You've reached your application limit"
    : "You've reached your posting limit";
  const description = isApplications
    ? `You've used ${currentCount} of your ${limit} free monthly applications.`
    : `You've used ${currentCount} of your ${limit} free monthly posts.`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Crown className="w-8 h-8 text-primary" />
          </div>
          <DialogTitle className="text-center">{title}</DialogTitle>
          <DialogDescription className="text-center">
            {description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="bg-muted rounded-xl p-4 space-y-3">
            <div className="flex items-center gap-3">
              <Zap className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium">
                {isApplications ? "Unlimited applications" : "Unlimited gig posts"}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <TrendingUp className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium">Priority ranking in search</span>
            </div>
            <div className="flex items-center gap-3">
              <Crown className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium">Pro badge on your profile</span>
            </div>
          </div>

          <p className="text-center text-sm text-muted-foreground">
            Pro {isApplications ? "Hustlers" : "Employers"} get hired{" "}
            <span className="font-semibold text-foreground">3× faster</span>
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <Button onClick={() => navigate("/pricing")} className="w-full">
            View Pricing
          </Button>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Maybe Later
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UpgradePrompt;
