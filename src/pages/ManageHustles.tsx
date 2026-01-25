import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  MoreVertical,
  MapPin
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

interface Hustle {
  id: string;
  name: string;
  description: string | null;
  location: string | null;
  image_url: string | null;
  is_active: boolean;
  is_featured: boolean;
  created_at: string;
  categories: {
    name: string;
  } | null;
}

const ManageHustles = () => {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [hustles, setHustles] = useState<Hustle[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    if (profile?.id) {
      fetchHustles();
    }
  }, [profile?.id]);

  const fetchHustles = async () => {
    if (!profile?.id) return;

    const { data } = await supabase
      .from("hustles")
      .select(`
        id,
        name,
        description,
        location,
        image_url,
        is_active,
        is_featured,
        created_at,
        categories (name)
      `)
      .eq("owner_id", profile.id)
      .order("created_at", { ascending: false });

    if (data) setHustles(data);
    setLoading(false);
  };

  const toggleActive = async (id: string, currentValue: boolean) => {
    const { error } = await supabase
      .from("hustles")
      .update({ is_active: !currentValue })
      .eq("id", id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive"
      });
    } else {
      setHustles(hustles.map(h => 
        h.id === id ? { ...h, is_active: !currentValue } : h
      ));
      toast({
        title: "Updated",
        description: `Hustle is now ${!currentValue ? "active" : "inactive"}`
      });
    }
  };

  const deleteHustle = async () => {
    if (!deleteId) return;

    const { error } = await supabase
      .from("hustles")
      .delete()
      .eq("id", deleteId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete hustle",
        variant: "destructive"
      });
    } else {
      setHustles(hustles.filter(h => h.id !== deleteId));
      toast({
        title: "Deleted",
        description: "Hustle has been removed"
      });
    }
    setDeleteId(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground">My Hustles</h2>
          <p className="text-muted-foreground">Manage your business listings</p>
        </div>
        <Link to="/dashboard/hustles/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Hustle
          </Button>
        </Link>
      </div>

      {hustles.length === 0 ? (
        <div className="text-center py-20 bg-card rounded-xl border border-border">
          <h3 className="text-xl font-semibold text-foreground mb-2">No hustles yet</h3>
          <p className="text-muted-foreground mb-6">
            Create your first hustle to start getting discovered.
          </p>
          <Link to="/dashboard/hustles/new">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Hustle
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {hustles.map((hustle) => (
            <div 
              key={hustle.id}
              className="bg-card rounded-xl border border-border p-4 flex items-center gap-4"
            >
              <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                <img
                  src={hustle.image_url || "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=200&auto=format&fit=crop"}
                  alt={hustle.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-foreground truncate">{hustle.name}</h3>
                  {hustle.is_featured && (
                    <span className="px-2 py-0.5 text-xs font-medium bg-primary/10 text-primary rounded-full">
                      Featured
                    </span>
                  )}
                </div>
                {hustle.categories && (
                  <p className="text-sm text-muted-foreground mb-1">{hustle.categories.name}</p>
                )}
                {hustle.location && (
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="w-3 h-3" />
                    {hustle.location}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    {hustle.is_active ? "Active" : "Inactive"}
                  </span>
                  <Switch
                    checked={hustle.is_active}
                    onCheckedChange={() => toggleActive(hustle.id, hustle.is_active)}
                  />
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link to={`/hustle/${hustle.id}`} className="flex items-center gap-2">
                        <Eye className="w-4 h-4" />
                        View
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to={`/dashboard/hustles/${hustle.id}/edit`} className="flex items-center gap-2">
                        <Edit className="w-4 h-4" />
                        Edit
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => setDeleteId(hustle.id)}
                      className="text-destructive flex items-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </div>
      )}

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Hustle</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this hustle? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={deleteHustle} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ManageHustles;
