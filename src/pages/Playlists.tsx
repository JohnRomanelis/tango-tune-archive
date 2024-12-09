import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import PlaylistsGrid from "@/components/playlist/PlaylistsGrid";
import PlaylistVisibilityFilters from "@/components/playlist/PlaylistVisibilityFilters";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";
import { useToast } from "@/components/ui/use-toast";

const Playlists = () => {
  const navigate = useNavigate();
  const { user } = useAuthRedirect();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [includeMine, setIncludeMine] = useState(true);
  const [includeShared, setIncludeShared] = useState(false);
  const [includePublic, setIncludePublic] = useState(false);

  const { data: playlists, isLoading } = useQuery({
    queryKey: ["playlists", { includeMine, includeShared, includePublic, userId: user?.id }],
    queryFn: async () => {
      if (!user) return [];

      const conditions = [];
      if (includeMine) conditions.push(`user_id.eq.${user.id}`);
      if (includeShared) conditions.push(`id.in.(select playlist_id from playlist_shared where user_id.eq.${user.id})`);
      if (includePublic) conditions.push("visibility.eq.public");

      const query = supabase
        .from("playlist")
        .select(`
          *,
          playlist_tanda (
            order_in_playlist,
            tanda (
              id,
              title,
              comments,
              visibility
            )
          )
        `)
        .or(conditions.join(","));

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });

  const handleDeletePlaylist = async (playlistId: number) => {
    try {
      const { error } = await supabase
        .from("playlist")
        .delete()
        .eq("id", playlistId);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ["playlists"] });
      toast({
        title: "Success",
        description: "Playlist deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting playlist:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete playlist",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-tango-light">Playlists</h1>
        <Button
          onClick={() => navigate("/playlists/create")}
          className="bg-tango-red hover:bg-tango-red/90"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Playlist
        </Button>
      </div>

      <PlaylistVisibilityFilters
        includeMine={includeMine}
        includeShared={includeShared}
        includePublic={includePublic}
        onVisibilityChange={(type, checked) => {
          switch (type) {
            case "mine":
              setIncludeMine(checked);
              break;
            case "shared":
              setIncludeShared(checked);
              break;
            case "public":
              setIncludePublic(checked);
              break;
          }
        }}
      />

      <PlaylistsGrid
        playlists={playlists || []}
        onDeletePlaylist={handleDeletePlaylist}
      />
    </main>
  );
};

export default Playlists;