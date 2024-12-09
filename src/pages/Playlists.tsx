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
  const navigate = useNavigate();
  const user = useAuthRedirect();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [includeMine, setIncludeMine] = useState(true);
  const [includeShared, setIncludeShared] = useState(false);
  const [includePublic, setIncludePublic] = useState(false);
  const [selectedPlaylist, setSelectedPlaylist] = useState<any>(null);

  const { data: playlists, isLoading } = useQuery({
    queryKey: ["playlists", { includeMine, includeShared, includePublic, userId: user?.id }],
    queryFn: async () => {
      if (!user?.id) return [];

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
              visibility,
              tanda_song (
                order_in_tanda,
                song (
                  id,
                  title,
                  type,
                  recording_year,
                  orchestra (name),
                  song_singer (
                    singer (name)
                  )
                )
              )
            )
          )
        `)
        .or(conditions.join(","));

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
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

      if (selectedPlaylist?.id === playlistId) {
        setSelectedPlaylist(null);
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

          <div className="grid grid-cols-2 gap-4">
            {playlists?.map((playlist) => (
              <div
                key={playlist.id}
                className={`cursor-pointer ${
                  selectedPlaylist?.id === playlist.id
                    ? "ring-2 ring-tango-red"
                    : ""
                }`}
                onClick={() => setSelectedPlaylist(playlist)}
              >
                <div className="bg-tango-gray rounded-lg p-4 relative group hover:bg-tango-gray/90 transition-colors">
                  <h3 className="text-lg font-semibold text-tango-light mb-2">
                    {playlist.title}
                  </h3>
                  {playlist.description && (
                    <p className="text-sm text-tango-light/80 mb-4 line-clamp-2">
                      {playlist.description}
                    </p>
                  )}
                  <p className="text-sm text-tango-light/80">
                    {playlist.playlist_tanda?.length || 0}{" "}
                    {playlist.playlist_tanda?.length === 1 ? "tanda" : "tandas"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="w-1/2">
          <PlaylistDetails playlist={selectedPlaylist} />
        </div>
      </div>
    </main>
  );
};

export default Playlists;