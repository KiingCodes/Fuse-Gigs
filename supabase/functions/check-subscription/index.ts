import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    
    if (userError || !userData?.user) {
      throw new Error("Unauthorized");
    }

    const userId = userData.user.id;

    // Get subscription status
    const { data: subscription } = await supabaseClient
      .from("user_subscriptions")
      .select("*, subscription_plans(*)")
      .eq("user_id", userId)
      .maybeSingle();

    // Get current month usage
    const monthYear = new Date().toISOString().slice(0, 7); // YYYY-MM format
    const { data: usage } = await supabaseClient
      .from("usage_tracking")
      .select("*")
      .eq("user_id", userId)
      .eq("month_year", monthYear)
      .maybeSingle();

    // Get active boosts
    const { data: boosts } = await supabaseClient
      .from("boosts")
      .select("*")
      .eq("user_id", userId)
      .eq("is_active", true)
      .gte("ends_at", new Date().toISOString());

    const isPro = subscription?.status === "active";
    const planType = subscription?.subscription_plans?.type || null;

    // Free tier limits
    const limits = {
      applications: isPro && planType === "hustler" ? Infinity : 5,
      posts: isPro && planType === "employer" ? Infinity : 1,
    };

    return new Response(JSON.stringify({
      isPro,
      planType,
      subscription,
      usage: usage || { applications_count: 0, posts_count: 0 },
      limits,
      boosts: boosts || [],
      canApply: !usage || usage.applications_count < limits.applications,
      canPost: !usage || usage.posts_count < limits.posts,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error checking subscription:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
