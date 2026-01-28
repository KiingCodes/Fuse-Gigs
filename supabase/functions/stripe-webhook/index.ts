import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, stripe-signature",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
    apiVersion: "2023-10-16",
  });

  const supabaseAdmin = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );

  try {
    const body = await req.text();
    const signature = req.headers.get("stripe-signature");
    
    // In production, verify webhook signature
    // const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
    // const event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    
    const event = JSON.parse(body);
    console.log("Received webhook event:", event.type);

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        const userId = session.metadata.supabase_user_id;

        if (session.mode === "subscription") {
          // Handle subscription
          const planId = session.metadata.plan_id;
          const subscription = await stripe.subscriptions.retrieve(session.subscription);

          await supabaseAdmin.from("user_subscriptions").upsert({
            user_id: userId,
            plan_id: planId,
            stripe_customer_id: session.customer,
            stripe_subscription_id: session.subscription,
            status: "active",
            current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
          }, { onConflict: "user_id" });

          console.log(`Subscription activated for user ${userId}`);
        } else if (session.mode === "payment") {
          // Handle boost purchase
          const boostType = session.metadata.boost_type;
          const hustleId = session.metadata.hustle_id;
          const durationHours = parseInt(session.metadata.duration_hours);
          const priceZar = parseInt(session.metadata.price_zar);

          const endsAt = new Date();
          endsAt.setHours(endsAt.getHours() + durationHours);

          await supabaseAdmin.from("boosts").insert({
            user_id: userId,
            hustle_id: hustleId || null,
            boost_type: boostType,
            stripe_payment_id: session.payment_intent,
            price_zar: priceZar,
            starts_at: new Date().toISOString(),
            ends_at: endsAt.toISOString(),
            is_active: true,
          });

          console.log(`Boost ${boostType} activated for user ${userId}`);
        }
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object;
        const customerId = subscription.customer;

        // Find user by customer ID
        const { data: userSub } = await supabaseAdmin
          .from("user_subscriptions")
          .select("*")
          .eq("stripe_customer_id", customerId)
          .single();

        if (userSub) {
          await supabaseAdmin.from("user_subscriptions").update({
            status: subscription.status === "active" ? "active" : 
                   subscription.status === "past_due" ? "past_due" : "inactive",
            current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
          }).eq("id", userSub.id);
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object;
        const customerId = subscription.customer;

        await supabaseAdmin
          .from("user_subscriptions")
          .update({ status: "cancelled" })
          .eq("stripe_customer_id", customerId);
        break;
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Webhook error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
