import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import ChatWindow from "./ChatWindow";
import { useToast } from "@/hooks/use-toast";

interface StartChatButtonProps {
  hustleId: string;
  hustleOwnerId: string;
  hustleOwnerName: string;
}

const StartChatButton = ({ hustleId, hustleOwnerId, hustleOwnerName }: StartChatButtonProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    if (!user || user.id === hustleOwnerId) return;

    const findExistingConversation = async () => {
      const { data } = await supabase
        .from("conversations")
        .select("id")
        .eq("hustle_id", hustleId)
        .or(`participant_one.eq.${user.id},participant_two.eq.${user.id}`)
        .maybeSingle();
      
      if (data) {
        setConversationId(data.id);
      }
    };

    findExistingConversation();
  }, [user, hustleId, hustleOwnerId]);

  const startConversation = async () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to send messages.",
        variant: "destructive"
      });
      return;
    }

    if (user.id === hustleOwnerId) {
      toast({
        title: "Cannot message yourself",
        description: "This is your own hustle.",
        variant: "destructive"
      });
      return;
    }

    if (conversationId) {
      setShowChat(true);
      return;
    }

    // Create new conversation
    const { data, error } = await supabase
      .from("conversations")
      .insert({
        hustle_id: hustleId,
        participant_one: user.id,
        participant_two: hustleOwnerId
      })
      .select("id")
      .single();

    if (error) {
      toast({
        title: "Error",
        description: "Could not start conversation. Please try again.",
        variant: "destructive"
      });
      return;
    }

    setConversationId(data.id);
    setShowChat(true);
  };

  // Don't show button if user owns this hustle
  if (user?.id === hustleOwnerId) return null;

  return (
    <div className="relative">
      <Button onClick={startConversation} className="gap-2">
        <MessageCircle className="w-4 h-4" />
        Send Message
      </Button>
      
      {showChat && conversationId && (
        <div className="fixed bottom-4 right-4 w-[350px] z-50">
          <ChatWindow
            conversationId={conversationId}
            otherUserName={hustleOwnerName}
            onClose={() => setShowChat(false)}
          />
        </div>
      )}
    </div>
  );
};

export default StartChatButton;