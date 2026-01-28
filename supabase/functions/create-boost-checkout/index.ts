import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Boost pricing in ZAR cents
const BOOST_PRICES = {
  gig_24h: { amount: 2900, name: "24-Hour Gig Boost", duration_hours: 24 },
  featured_7d: { amount: 7900, name: "7-Day Featured Placement", duration_hours: 168 },
  profile: { amount: 4900, name: "Profile Boost", duration_hours: 168 },
  urgent: { amount: 1900, name: "Urgent Tag", duration_hours: 72 },
  category_spotlight: { amount: 5900, name: "Category Spotlight", duration_hours: 168 },
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

    const { boostType, hustleId, successUrl, cancelUrl } = await req.json();
    const user = userData.user;

    const boostConfig = BOOST_PRICES[boostType as keyof typeof BOOST_PRICES];
    if (!boostConfig) {
      throw new Error("Invalid boost type");
    }

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    // Check for existing customer
    const customers = await stripe.customers.list({
      email: user.email,
      limit: 1,
    });

    let customerId: string;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
    } else {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: { supabase_user_id: user.id },
      });
      customerId = customer.id;
    }

    // Create checkout session for one-time payment
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: [
        {
          price_data: {
            currency: "zar",
            product_data: {
              name: boostConfig.name,
              description: `Boost your visibility for ${boostConfig.duration_hours} hours`,
            },
            unit_amount: boostConfig.amount,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: successUrl || `${req.headers.get("origin")}/dashboard?boost=success`,
      cancel_url: cancelUrl || `${req.headers.get("origin")}/dashboard?boost=canceled`,
      metadata: {
        supabase_user_id: user.id,
        boost_type: boostType,
        hustle_id: hustleId || "",
        duration_hours: boostConfig.duration_hours.toString(),
        price_zar: (boostConfig.amount / 100).toString(),
      },
    });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error creating boost checkout:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
