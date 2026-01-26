import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StartChatButton from "@/components/StartChatButton";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  MapPin, 
  Mail, 
  Phone, 
  Globe, 
  Star, 
  ArrowLeft,
  Calendar,
  User
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Hustle {
  id: string;
  name: string;
  description: string | null;
  location: string | null;
  image_url: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  website_url: string | null;
  is_featured: boolean;
  created_at: string;
  owner_id: string;
  categories: {
    name: string;
    slug: string;
  } | null;
  profiles: {
    username: string | null;
    avatar_url: string | null;
  } | null;
}

interface Review {
  id: string;
  rating: number;
  content: string | null;
  created_at: string;
  profiles: {
    username: string | null;
    avatar_url: string | null;
  } | null;
}

const HustleDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user, profile } = useAuth();
  const { toast } = useToast();
  
  const [hustle, setHustle] = useState<Hustle | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [newReview, setNewReview] = useState({ rating: 5, content: "" });
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    if (id) {
      fetchHustle();
      fetchReviews();
      trackVisit();
    }
  }, [id]);

  const trackVisit = async () => {
    if (!id) return;
    
    await supabase.from("hustle_visits").insert({
      hustle_id: id,
      visitor_id: profile?.id || null,
      referrer: document.referrer || null
    });
  };

  const fetchHustle = async () => {
    if (!id) return;
    
    const { data, error } = await supabase
      .from("hustles")
      .select(`
        *,
        categories (name, slug),
        profiles (username, avatar_url)
      `)
      .eq("id", id)
      .maybeSingle();

    if (data) setHustle(data);
    setLoading(false);
  };

  const fetchReviews = async () => {
    if (!id) return;

    const { data } = await supabase
      .from("reviews")
      .select(`
        *,
        profiles (username, avatar_url)
      `)
      .eq("hustle_id", id)
      .order("created_at", { ascending: false });

    if (data) setReviews(data);
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !profile || !id) {
      toast({
        title: "Sign in required",
        description: "Please sign in to leave a review",
        variant: "destructive"
      });
      return;
    }

    setSubmittingReview(true);
    const { error } = await supabase.from("reviews").insert({
      hustle_id: id,
      reviewer_id: profile.id,
      rating: newReview.rating,
      content: newReview.content || null
    });

    if (error) {
      if (error.code === "23505") {
        toast({
          title: "Already reviewed",
          description: "You have already reviewed this hustle",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to submit review",
          variant: "destructive"
        });
      }
    } else {
      toast({
        title: "Review submitted",
        description: "Thanks for your feedback!"
      });
      setNewReview({ rating: 5, content: "" });
      fetchReviews();
    }
    setSubmittingReview(false);
  };

  const averageRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center py-40">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!hustle) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex flex-col items-center justify-center py-40">
          <h2 className="text-2xl font-bold text-foreground mb-4">Hustle not found</h2>
          <Link to="/explore">
            <Button>Back to Explore</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container px-4">
          <Link 
            to="/explore" 
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Explore
          </Link>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Hero Image */}
              <div className="relative rounded-2xl overflow-hidden aspect-video">
                <img
                  src={hustle.image_url || "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&auto=format&fit=crop"}
                  alt={hustle.name}
                  className="w-full h-full object-cover"
                />
                {hustle.is_featured && (
                  <div className="absolute top-4 left-4 px-3 py-1 bg-gradient-hero rounded-full">
                    <span className="text-sm font-semibold text-primary-foreground">Featured</span>
                  </div>
                )}
              </div>

              {/* Info */}
              <div>
                {hustle.categories && (
                  <Link 
                    to={`/categories/${hustle.categories.slug}`}
                    className="inline-block px-3 py-1 text-sm font-medium bg-accent/10 text-accent rounded-full mb-4 hover:bg-accent/20 transition-colors"
                  >
                    {hustle.categories.name}
                  </Link>
                )}
                <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                  {hustle.name}
                </h1>
                
                <div className="flex flex-wrap items-center gap-4 text-muted-foreground mb-6">
                  {hustle.location && (
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4" />
                      <span>{hustle.location}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    <span>Joined {new Date(hustle.created_at).toLocaleDateString()}</span>
                  </div>
                  {reviews.length > 0 && (
                    <div className="flex items-center gap-1.5">
                      <Star className="w-4 h-4 text-primary fill-primary" />
                      <span>{averageRating.toFixed(1)} ({reviews.length} reviews)</span>
                    </div>
                  )}
                </div>

                <p className="text-muted-foreground leading-relaxed">
                  {hustle.description || "No description available."}
                </p>
              </div>

              {/* Reviews */}
              <div className="space-y-6">
                <h2 className="font-display text-2xl font-bold text-foreground">Reviews</h2>
                
                {user && (
                  <form onSubmit={handleSubmitReview} className="bg-card rounded-xl p-6 border border-border">
                    <h3 className="font-semibold text-foreground mb-4">Leave a Review</h3>
                    <div className="flex gap-2 mb-4">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setNewReview({ ...newReview, rating: star })}
                          className="focus:outline-none"
                        >
                          <Star
                            className={`w-6 h-6 transition-colors ${
                              star <= newReview.rating
                                ? "text-primary fill-primary"
                                : "text-muted-foreground"
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                    <Textarea
                      placeholder="Share your experience..."
                      value={newReview.content}
                      onChange={(e) => setNewReview({ ...newReview, content: e.target.value })}
                      className="mb-4"
                    />
                    <Button type="submit" disabled={submittingReview}>
                      {submittingReview ? "Submitting..." : "Submit Review"}
                    </Button>
                  </form>
                )}

                {reviews.length === 0 ? (
                  <p className="text-muted-foreground">No reviews yet. Be the first to leave one!</p>
                ) : (
                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <div key={review.id} className="bg-card rounded-xl p-6 border border-border">
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            {review.profiles?.avatar_url ? (
                              <img
                                src={review.profiles.avatar_url}
                                alt=""
                                className="w-full h-full rounded-full object-cover"
                              />
                            ) : (
                              <User className="w-5 h-5 text-primary" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium text-foreground">
                                {review.profiles?.username || "Anonymous"}
                              </span>
                              <div className="flex gap-0.5">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star
                                    key={star}
                                    className={`w-4 h-4 ${
                                      star <= review.rating
                                        ? "text-primary fill-primary"
                                        : "text-muted-foreground"
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                            {review.content && (
                              <p className="text-muted-foreground">{review.content}</p>
                            )}
                            <span className="text-xs text-muted-foreground mt-2 block">
                              {new Date(review.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Owner Card */}
              <div className="bg-card rounded-xl p-6 border border-border">
                <h3 className="font-semibold text-foreground mb-4">About the Hustler</h3>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    {hustle.profiles?.avatar_url ? (
                      <img
                        src={hustle.profiles.avatar_url}
                        alt=""
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <User className="w-6 h-6 text-primary" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">
                      {hustle.profiles?.username || "Anonymous"}
                    </p>
                    <p className="text-sm text-muted-foreground">Hustler</p>
                  </div>
                </div>
                <StartChatButton 
                  hustleId={hustle.id}
                  hustleOwnerId={hustle.owner_id}
                  hustleOwnerName={hustle.profiles?.username || "Hustler"}
                />
              </div>

              {/* Contact Card */}
              <div className="bg-card rounded-xl p-6 border border-border">
                <h3 className="font-semibold text-foreground mb-4">Get in Touch</h3>
                <div className="space-y-3">
                  {hustle.contact_email && (
                    <a
                      href={`mailto:${hustle.contact_email}`}
                      className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Mail className="w-5 h-5" />
                      <span className="text-sm">{hustle.contact_email}</span>
                    </a>
                  )}
                  {hustle.contact_phone && (
                    <a
                      href={`tel:${hustle.contact_phone}`}
                      className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Phone className="w-5 h-5" />
                      <span className="text-sm">{hustle.contact_phone}</span>
                    </a>
                  )}
                  {hustle.website_url && (
                    <a
                      href={hustle.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Globe className="w-5 h-5" />
                      <span className="text-sm">Visit Website</span>
                    </a>
                  )}
                  {!hustle.contact_email && !hustle.contact_phone && !hustle.website_url && (
                    <p className="text-sm text-muted-foreground">No contact information available</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default HustleDetail;
