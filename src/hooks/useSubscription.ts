import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface SubscriptionStatus {
  isPro: boolean;
  planType: "hustler" | "employer" | null;
  subscription: {
    id: string;
    status: string;
    current_period_end: string;
    subscription_plans: {
      name: string;
      slug: string;
      features: string[];
    };
  } | null;
  usage: {
    applications_count: number;
    posts_count: number;
  };
  limits: {
    applications: number;
    posts: number;
  };
  boosts: Array<{
    id: string;
    boost_type: string;
    ends_at: string;
    hustle_id: string | null;
  }>;
  canApply: boolean;
  canPost: boolean;
}

export const useSubscription = () => {
  const { user, session } = useAuth();

  return useQuery({
    queryKey: ["subscription", user?.id],
    queryFn: async (): Promise<SubscriptionStatus> => {
      if (!session?.access_token) {
        return {
          isPro: false,
          planType: null,
          subscription: null,
          usage: { applications_count: 0, posts_count: 0 },
          limits: { applications: 5, posts: 1 },
          boosts: [],
          canApply: true,
          canPost: true,
        };
      }

      const { data, error } = await supabase.functions.invoke("check-subscription", {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) throw error;
      return data;
    },
    enabled: !!user,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });
};

export const useCreateCheckout = () => {
  const { session } = useAuth();

  const createCheckout = async (planSlug: string) => {
    if (!session?.access_token) throw new Error("Not authenticated");

    const { data, error } = await supabase.functions.invoke("create-checkout", {
      body: {
        planSlug,
        successUrl: `${window.location.origin}/dashboard?subscription=success`,
        cancelUrl: `${window.location.origin}/pricing?canceled=true`,
      },
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
    });

    if (error) throw error;
    return data.url;
  };

  return { createCheckout };
};

export const useCreateBoostCheckout = () => {
  const { session } = useAuth();

  const createBoostCheckout = async (boostType: string, hustleId?: string) => {
    if (!session?.access_token) throw new Error("Not authenticated");

    const { data, error } = await supabase.functions.invoke("create-boost-checkout", {
      body: {
        boostType,
        hustleId,
        successUrl: `${window.location.origin}/dashboard?boost=success`,
        cancelUrl: `${window.location.origin}/dashboard?boost=canceled`,
      },
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
    });

    if (error) throw error;
    return data.url;
  };

  return { createBoostCheckout };
};
