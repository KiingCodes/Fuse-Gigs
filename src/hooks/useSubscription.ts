import { useQuery, useQueryClient } from "@tanstack/react-query";
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

// Hook to track usage when creating hustles or applying
export const useTrackUsage = () => {
  const { session, user } = useAuth();
  const queryClient = useQueryClient();

  const trackPost = async () => {
    if (!session?.access_token || !user) throw new Error("Not authenticated");

    const monthYear = new Date().toISOString().slice(0, 7);
    
    // Check if usage record exists
    const { data: existingUsage } = await supabase
      .from("usage_tracking")
      .select("*")
      .eq("user_id", user.id)
      .eq("month_year", monthYear)
      .maybeSingle();

    if (existingUsage) {
      // Update existing record
      await supabase
        .from("usage_tracking")
        .update({ 
          posts_count: existingUsage.posts_count + 1,
          updated_at: new Date().toISOString()
        })
        .eq("id", existingUsage.id);
    } else {
      // Create new record
      await supabase
        .from("usage_tracking")
        .insert({
          user_id: user.id,
          month_year: monthYear,
          posts_count: 1,
          applications_count: 0,
        });
    }

    // Invalidate subscription cache to refresh limits
    queryClient.invalidateQueries({ queryKey: ["subscription", user.id] });
  };

  const trackApplication = async () => {
    if (!session?.access_token || !user) throw new Error("Not authenticated");

    const monthYear = new Date().toISOString().slice(0, 7);
    
    const { data: existingUsage } = await supabase
      .from("usage_tracking")
      .select("*")
      .eq("user_id", user.id)
      .eq("month_year", monthYear)
      .maybeSingle();

    if (existingUsage) {
      await supabase
        .from("usage_tracking")
        .update({ 
          applications_count: existingUsage.applications_count + 1,
          updated_at: new Date().toISOString()
        })
        .eq("id", existingUsage.id);
    } else {
      await supabase
        .from("usage_tracking")
        .insert({
          user_id: user.id,
          month_year: monthYear,
          posts_count: 0,
          applications_count: 1,
        });
    }

    queryClient.invalidateQueries({ queryKey: ["subscription", user.id] });
  };

  return { trackPost, trackApplication };
};

// Hook to check if a specific hustle owner is Pro
export const useHustleOwnerStatus = (ownerId: string | undefined) => {
  return useQuery({
    queryKey: ["hustle-owner-status", ownerId],
    queryFn: async () => {
      if (!ownerId) return { isPro: false, planType: null };

      // Get the user_id from the profile
      const { data: profile } = await supabase
        .from("profiles")
        .select("user_id")
        .eq("id", ownerId)
        .maybeSingle();

      if (!profile?.user_id) return { isPro: false, planType: null };

      // Check their subscription
      const { data: subscription } = await supabase
        .from("user_subscriptions")
        .select("status, subscription_plans(type)")
        .eq("user_id", profile.user_id)
        .eq("status", "active")
        .maybeSingle();

      if (!subscription) return { isPro: false, planType: null };

      return {
        isPro: subscription.status === "active",
        planType: (subscription.subscription_plans as any)?.type || null,
      };
    },
    enabled: !!ownerId,
    staleTime: 1000 * 60 * 10, // Cache for 10 minutes
  });
};
