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
  const [searchTrigger, setSearchTrigger] = useState(0);
  const user = useAuthRedirect();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: playlists, isLoading } = useQuery({
    queryKey: ["playlists", { includeMine, includeShared, includePublic, userId: user?.id, searchTrigger }],
    queryFn: async () => {
      console.log("Query params:", { includeMine, includeShared, includePublic, userId: user?.id });
      
      if (!user?.id) return [];

      // Build visibility conditions
      const visibilityConditions = [];
      
      if (includeMine) {
        visibilityConditions.push(`user_id.eq.${user.id}`);
      }
      
      if (includeShared) {
        const { data: sharedPlaylists, error: sharedError } = await supabase
          .from('playlist_shared')
          .select('playlist_id')
          .eq('user_id', user.id);
        
        console.log("Shared playlists query result:", { sharedPlaylists, sharedError });
        
        if (sharedPlaylists?.length) {
          const sharedIds = sharedPlaylists.map(sp => sp.playlist_id);
          visibilityConditions.push(`id.in.(${sharedIds.join(',')})`);
        }
      }
      
      if (includePublic) {
        visibilityConditions.push('visibility.eq.public');
      }

      console.log("Visibility conditions:", visibilityConditions);

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

      // Only add OR conditions if there are any conditions to check
      if (visibilityConditions.length > 0) {
        query = query.or(visibilityConditions.join(','));
      } else {
        console.log("No filters active, returning empty array");
        return [];
      }

      const { data, error } = await query;

      return (data || []).map(playlist => ({
        ...playlist,
        total_duration: playlist.playlist_tanda?.reduce((total: number, pt: any) => {
          const tandaDuration = pt.tanda?.tanda_song?.reduce((tandaTotal: number, ts: any) => {
            return tandaTotal + (ts.song?.duration || 0);
          }, 0) || 0;
          return total + tandaDuration;
        }, 0) || 0
      }));
    },
    enabled: !!user?.id && searchTrigger > 0,
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

  const handleSearch = () => {
    setSearchTrigger(prev => prev + 1);
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
          <div className="space-y-4">
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
            <Button 
              onClick={() => setSearchTrigger(prev => prev + 1)}
              className="w-full bg-tango-red hover:bg-tango-red/90"
            >
              Search Playlists
            </Button>
          </div>

          {searchTrigger > 0 && (
            <PlaylistsGrid
              playlists={playlists || []}
              onDeletePlaylist={handleDeletePlaylist}
              onSelectPlaylist={setSelectedPlaylistId}
              currentUserId={user?.id}
            />
          )}
        </div>

        <div className="w-1/2">
          <PlaylistDetails playlistId={selectedPlaylistId} />
        </div>
      </div>
    </main>
  );
};

export default Playlists;
