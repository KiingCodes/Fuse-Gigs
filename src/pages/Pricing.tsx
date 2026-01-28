import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Loader2, Zap, Crown, Building2, Rocket } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription, useCreateCheckout, useCreateBoostCheckout } from "@/hooks/useSubscription";
import { useToast } from "@/hooks/use-toast";

const HUSTLER_FEATURES = [
  "Unlimited gig applications",
  "Priority ranking in search",
  "Pro Hustler badge",
  "See who viewed profile",
  "Direct message employers first",
  "Application status insights",
  "24h early access to gigs",
  "Advanced filters",
  "Instant gig alerts",
  "Downloadable CV link",
];

const EMPLOYER_FEATURES = [
  "Unlimited gig posts",
  "Pinned gigs at top",
  "Boosted visibility",
  "Verified Business badge",
  "View full applicant list",
  "Advanced talent filters",
  "Gig performance analytics",
  "Bulk messaging",
  "Priority support",
  "AI recommended hustlers",
];

const BOOST_OPTIONS = [
  { id: "gig_24h", name: "24-Hour Gig Boost", price: 29, icon: Rocket, description: "Appears at top of category for 24 hours" },
  { id: "featured_7d", name: "7-Day Featured", price: 79, icon: Crown, description: "Highlighted + homepage slot for a week" },
  { id: "profile", name: "Profile Boost", price: 49, icon: Zap, description: "Shown in 'Recommended Hustlers'" },
  { id: "urgent", name: "Urgent Tag", price: 19, icon: Zap, description: "Red 'Urgent' label for 72 hours" },
  { id: "category_spotlight", name: "Category Spotlight", price: 59, icon: Crown, description: "Featured inside a specific category" },
];

const Pricing = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: subscription, isLoading } = useSubscription();
  const { createCheckout } = useCreateCheckout();
  const { createBoostCheckout } = useCreateBoostCheckout();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [loadingBoost, setLoadingBoost] = useState<string | null>(null);

  const handleSubscribe = async (planSlug: string) => {
    if (!user) {
      navigate("/auth?signup=true");
      return;
    }

    setLoadingPlan(planSlug);
    try {
      const url = await createCheckout(planSlug);
      window.location.href = url;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to start checkout. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoadingPlan(null);
    }
  };

  const handleBoost = async (boostType: string) => {
    if (!user) {
      navigate("/auth?signup=true");
      return;
    }

    setLoadingBoost(boostType);
    try {
      const url = await createBoostCheckout(boostType);
      window.location.href = url;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to start checkout. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoadingBoost(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-16">
        <div className="container px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4">Pricing</Badge>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
              Simple, Fair Pricing
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Start free, upgrade when you're ready. All prices in South African Rand.
            </p>
          </div>

          {/* Subscription Plans */}
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-16">
            {/* Hustler Pro */}
            <div className="bg-card rounded-2xl border border-border p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
              <div className="relative">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Zap className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-bold text-foreground">Hustler Pro</h3>
                    <p className="text-sm text-muted-foreground">For Freelancers & Job Seekers</p>
                  </div>
                </div>

                <div className="mb-6">
                  <span className="text-4xl font-bold text-foreground">R49</span>
                  <span className="text-muted-foreground">/month</span>
                </div>

                <div className="mb-6 p-4 bg-muted rounded-xl">
                  <p className="text-sm font-medium text-foreground mb-2">Free tier includes:</p>
                  <p className="text-sm text-muted-foreground">• 5 gig applications per month</p>
                  <p className="text-sm text-muted-foreground">• Basic profile</p>
                </div>

                <ul className="space-y-3 mb-8">
                  {HUSTLER_FEATURES.map((feature) => (
                    <li key={feature} className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-primary shrink-0" />
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  className="w-full"
                  size="lg"
                  onClick={() => handleSubscribe("hustler-pro")}
                  disabled={loadingPlan === "hustler-pro" || subscription?.planType === "hustler"}
                >
                  {loadingPlan === "hustler-pro" ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : subscription?.planType === "hustler" ? (
                    "Current Plan"
                  ) : (
                    "Upgrade to Pro"
                  )}
                </Button>
              </div>
            </div>

            {/* Employer Pro */}
            <div className="bg-card rounded-2xl border-2 border-primary p-8 relative overflow-hidden">
              <Badge className="absolute top-4 right-4">Most Popular</Badge>
              <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 rounded-full blur-3xl" />
              <div className="relative">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-secondary" />
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-bold text-foreground">Employer Pro</h3>
                    <p className="text-sm text-muted-foreground">For Businesses & Gig Posters</p>
                  </div>
                </div>

                <div className="mb-6">
                  <span className="text-4xl font-bold text-foreground">R99</span>
                  <span className="text-muted-foreground">/month</span>
                </div>

                <div className="mb-6 p-4 bg-muted rounded-xl">
                  <p className="text-sm font-medium text-foreground mb-2">Free tier includes:</p>
                  <p className="text-sm text-muted-foreground">• 1 gig post per month</p>
                  <p className="text-sm text-muted-foreground">• Standard visibility</p>
                </div>

                <ul className="space-y-3 mb-8">
                  {EMPLOYER_FEATURES.map((feature) => (
                    <li key={feature} className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-secondary shrink-0" />
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  className="w-full"
                  size="lg"
                  variant="accent"
                  onClick={() => handleSubscribe("employer-pro")}
                  disabled={loadingPlan === "employer-pro" || subscription?.planType === "employer"}
                >
                  {loadingPlan === "employer-pro" ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : subscription?.planType === "employer" ? (
                    "Current Plan"
                  ) : (
                    "Upgrade to Pro"
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Boost Options */}
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="font-display text-2xl font-bold text-foreground mb-2">
                One-Time Boosts
              </h2>
              <p className="text-muted-foreground">
                Instantly increase your visibility with pay-per-use boosts
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {BOOST_OPTIONS.map((boost) => (
                <div key={boost.id} className="bg-card rounded-xl border border-border p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                      <boost.icon className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground">{boost.name}</h3>
                      <p className="text-lg font-bold text-primary">R{boost.price}</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">{boost.description}</p>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => handleBoost(boost.id)}
                    disabled={loadingBoost === boost.id}
                  >
                    {loadingBoost === boost.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      "Buy Now"
                    )}
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Pricing;
