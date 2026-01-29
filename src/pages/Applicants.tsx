import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/hooks/useSubscription";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { Search, Mail, MessageSquare, Filter, Users, Crown } from "lucide-react";
import { Link } from "react-router-dom";
import ProBadge from "@/components/ProBadge";

interface Applicant {
  id: string;
  username: string | null;
  avatar_url: string | null;
  bio: string | null;
  created_at: string;
  user_id: string;
}

const Applicants = () => {
  const { profile } = useAuth();
  const { data: subscription } = useSubscription();
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const isEmployerPro = subscription?.isPro && subscription?.planType === "employer";

  // Fetch all users who have messaged about hustles (simulated as applicants)
  const { data: applicants, isLoading } = useQuery({
    queryKey: ["applicants", profile?.id],
    queryFn: async () => {
      if (!profile?.id) return [];

      // Get all conversations related to this user's hustles
      const { data: hustles } = await supabase
        .from("hustles")
        .select("id")
        .eq("owner_id", profile.id);

      if (!hustles?.length) return [];

      const hustleIds = hustles.map(h => h.id);

      // Get conversations for these hustles
      const { data: conversations } = await supabase
        .from("conversations")
        .select("participant_one, participant_two, hustle_id")
        .in("hustle_id", hustleIds);

      if (!conversations?.length) return [];

      // Get unique applicant profile IDs (not the owner)
      const applicantUserIds = new Set<string>();
      conversations.forEach(conv => {
        if (conv.participant_one !== profile.user_id) {
          applicantUserIds.add(conv.participant_one);
        }
        if (conv.participant_two !== profile.user_id) {
          applicantUserIds.add(conv.participant_two);
        }
      });

      if (applicantUserIds.size === 0) return [];

      // Get profile details
      const { data: profiles } = await supabase
        .from("profiles")
        .select("*")
        .in("user_id", Array.from(applicantUserIds));

      return profiles || [];
    },
    enabled: !!profile?.id && isEmployerPro,
  });

  const filteredApplicants = applicants?.filter(app => 
    !searchQuery || 
    app.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.bio?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  if (!subscription?.isPro || subscription?.planType !== "employer") {
    return (
      <div className="space-y-6">
        <div className="text-center py-20 bg-card rounded-xl border border-border">
          <Crown className="w-16 h-16 text-primary mx-auto mb-4 opacity-50" />
          <h3 className="text-xl font-semibold text-foreground mb-2">Employer Pro Feature</h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            View and manage all applicants who have shown interest in your hustles.
            This feature is available for Employer Pro subscribers.
          </p>
          <Link to="/pricing">
            <Button>
              <Crown className="w-4 h-4 mr-2" />
              Upgrade to Employer Pro
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="font-display text-2xl font-bold text-foreground">Applicants</h2>
            <ProBadge type="employer" size="sm" />
          </div>
          <p className="text-muted-foreground">
            People who have shown interest in your hustles
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search applicants..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-48">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="services">Services</SelectItem>
            <SelectItem value="food">Food & Dining</SelectItem>
            <SelectItem value="beauty">Beauty</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-card rounded-xl p-6 border border-border">
          <Users className="w-5 h-5 text-primary mb-2" />
          <p className="text-2xl font-bold text-foreground">{applicants?.length || 0}</p>
          <p className="text-sm text-muted-foreground">Total Applicants</p>
        </div>
        <div className="bg-card rounded-xl p-6 border border-border">
          <MessageSquare className="w-5 h-5 text-secondary mb-2" />
          <p className="text-2xl font-bold text-foreground">{applicants?.length || 0}</p>
          <p className="text-sm text-muted-foreground">Conversations</p>
        </div>
        <div className="bg-card rounded-xl p-6 border border-border">
          <Mail className="w-5 h-5 text-accent mb-2" />
          <p className="text-2xl font-bold text-foreground">0</p>
          <p className="text-sm text-muted-foreground">Pending Messages</p>
        </div>
      </div>

      {/* Applicants Table */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : filteredApplicants.length === 0 ? (
        <div className="text-center py-20 bg-card rounded-xl border border-border">
          <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
          <h3 className="text-xl font-semibold text-foreground mb-2">No applicants yet</h3>
          <p className="text-muted-foreground">
            When people message you about your hustles, they'll appear here.
          </p>
        </div>
      ) : (
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Applicant</TableHead>
                <TableHead>Bio</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredApplicants.map((applicant) => (
                <TableRow key={applicant.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                        {applicant.avatar_url ? (
                          <img
                            src={applicant.avatar_url}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-lg font-medium text-primary">
                            {applicant.username?.[0]?.toUpperCase() || "?"}
                          </span>
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">
                          {applicant.username || "Anonymous"}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {applicant.bio || "No bio"}
                    </p>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {new Date(applicant.created_at).toLocaleDateString()}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <MessageSquare className="w-4 h-4 mr-1" />
                        Message
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default Applicants;
