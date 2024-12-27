import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Plus, Loader2, Columns } from "lucide-react";
import PlaylistsGrid from "@/components/playlist/PlaylistsGrid";
import PlaylistVisibilityFilters from "@/components/playlist/PlaylistVisibilityFilters";
import PlaylistDetails from "@/components/playlist/PlaylistDetails";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";
import { useToast } from "@/components/ui/use-toast";

const Playlists = () => {
  const [includeMine, setIncludeMine] = useState(true);
  const [includeShared, setIncludeShared] = useState(false);
  const [includePublic, setIncludePublic] = useState(false);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<number | null>(null);
  const user = useAuthRedirect();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: playlists, isLoading } = useQuery({
    queryKey: ["playlists", { includeMine, includeShared, includePublic, userId: user?.id }],
    queryFn: async () => {
      if (!user?.id) return [];

      let query = supabase
        .from("playlist")
        .select(`
          *,
          playlist_tanda (
            order_in_playlist,
            tanda (
              id,
              title,
              tanda_song (
                song (
                  duration
                )
              )
            )
          )
        `);

      // Build filter conditions array
      const conditions = [];

      if (includeMine) {
        conditions.push(`user_id.eq.${user.id}`);
      }

      if (includeShared) {
        conditions.push(`id.in.(select playlist_id from playlist_shared where user_id.eq.${user.id})`);
      }

      if (includePublic) {
        conditions.push(`visibility.eq.public`);
        if (includeMine) {
          // If we're also showing user's playlists, no need to exclude them
        } else {
          // If we're only showing public playlists, exclude user's own
          query = query.neq('user_id', user.id);
        }
      }

      // Apply filters if any conditions exist
      if (conditions.length > 0) {
        query = query.or(conditions.join(','));
      } else {
        // If no filters are active, return empty array
        return [];
      }

      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching playlists:', error);
        throw error;
      }

      // Calculate total duration for each playlist
      return (data || []).map(playlist => ({
        ...playlist,
        total_duration: playlist.playlist_tanda?.reduce((total: number, pt: any) => {
          const tandaDuration = pt.tanda.tanda_song?.reduce((tandaTotal: number, ts: any) => {
            return tandaTotal + (ts.song.duration || 0);
          }, 0) || 0;
          return total + tandaDuration;
        }, 0) || 0
      }));
    },
    enabled: !!user?.id,
  });

  const handleDeletePlaylist = async (playlistId: number) => {
    try {
      const { error } = await supabase
        .from("playlist")
        .delete()
        .eq("id", playlistId);

      if (error) throw error;

      if (selectedPlaylistId === playlistId) {
        setSelectedPlaylistId(null);
      }

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
        <div className="flex items-center gap-2">
          <Columns className="h-6 w-6 text-tango-light" />
          <h1 className="text-2xl font-bold text-tango-light">Playlists</h1>
        </div>
        <Button
          onClick={() => navigate("/playlists/create")}
          className="bg-tango-red hover:bg-tango-red/90"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Playlist
        </Button>
      </div>

      <div className="flex gap-6">
        <div className="w-1/2 space-y-6">
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
        </div>

        <div className="w-1/2">
          <PlaylistDetails playlistId={selectedPlaylistId} />
        </div>
      </div>
    </main>
  );
};

export default Playlists;