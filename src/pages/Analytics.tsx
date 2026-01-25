import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line
} from "recharts";
import { format, subDays, startOfDay, endOfDay } from "date-fns";

interface VisitData {
  date: string;
  visits: number;
}

interface HustleVisits {
  hustle_name: string;
  visits: number;
}

const Analytics = () => {
  const { profile } = useAuth();
  const [visitsByDay, setVisitsByDay] = useState<VisitData[]>([]);
  const [hustleStats, setHustleStats] = useState<HustleVisits[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalVisits, setTotalVisits] = useState(0);

  useEffect(() => {
    if (profile?.id) {
      fetchAnalytics();
    }
  }, [profile?.id]);

  const fetchAnalytics = async () => {
    if (!profile?.id) return;

    // Get owner's hustles
    const { data: hustles } = await supabase
      .from("hustles")
      .select("id, name")
      .eq("owner_id", profile.id);

    if (!hustles || hustles.length === 0) {
      setLoading(false);
      return;
    }

    const hustleIds = hustles.map(h => h.id);

    // Get all visits for these hustles
    const { data: visits } = await supabase
      .from("hustle_visits")
      .select("hustle_id, visited_at")
      .in("hustle_id", hustleIds)
      .gte("visited_at", subDays(new Date(), 30).toISOString())
      .order("visited_at", { ascending: true });

    if (visits) {
      setTotalVisits(visits.length);

      // Group by day
      const dayMap = new Map<string, number>();
      for (let i = 29; i >= 0; i--) {
        const date = format(subDays(new Date(), i), "MMM dd");
        dayMap.set(date, 0);
      }

      visits.forEach(visit => {
        const date = format(new Date(visit.visited_at), "MMM dd");
        dayMap.set(date, (dayMap.get(date) || 0) + 1);
      });

      setVisitsByDay(
        Array.from(dayMap.entries()).map(([date, visits]) => ({ date, visits }))
      );

      // Group by hustle
      const hustleMap = new Map<string, number>();
      hustles.forEach(h => hustleMap.set(h.id, 0));
      
      visits.forEach(visit => {
        hustleMap.set(visit.hustle_id, (hustleMap.get(visit.hustle_id) || 0) + 1);
      });

      const hustleStatsData = hustles.map(h => ({
        hustle_name: h.name.length > 15 ? h.name.substring(0, 15) + "..." : h.name,
        visits: hustleMap.get(h.id) || 0
      })).sort((a, b) => b.visits - a.visits);

      setHustleStats(hustleStatsData);
    }

    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-display text-2xl font-bold text-foreground">Analytics</h2>
        <p className="text-muted-foreground">Track how your hustles are performing</p>
      </div>

      {/* Summary */}
      <div className="bg-card rounded-xl border border-border p-6">
        <h3 className="font-semibold text-foreground mb-2">Last 30 Days</h3>
        <p className="text-4xl font-bold text-primary">{totalVisits}</p>
        <p className="text-muted-foreground">Total visits</p>
      </div>

      {/* Visits Over Time */}
      <div className="bg-card rounded-xl border border-border p-6">
        <h3 className="font-semibold text-foreground mb-6">Visits Over Time</h3>
        {visitsByDay.length > 0 && totalVisits > 0 ? (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={visitsByDay}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="date" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                  interval="preserveStartEnd"
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                  allowDecimals={false}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px"
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="visits" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <p className="text-muted-foreground text-center py-8">No visit data yet</p>
        )}
      </div>

      {/* Visits by Hustle */}
      <div className="bg-card rounded-xl border border-border p-6">
        <h3 className="font-semibold text-foreground mb-6">Visits by Hustle</h3>
        {hustleStats.length > 0 && totalVisits > 0 ? (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hustleStats} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  type="number"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                  allowDecimals={false}
                />
                <YAxis 
                  type="category"
                  dataKey="hustle_name"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                  width={100}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px"
                  }}
                />
                <Bar 
                  dataKey="visits" 
                  fill="hsl(var(--primary))" 
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <p className="text-muted-foreground text-center py-8">
            {hustleStats.length === 0 ? "Create a hustle to see analytics" : "No visits yet"}
          </p>
        )}
      </div>
    </div>
  );
};

export default Analytics;
