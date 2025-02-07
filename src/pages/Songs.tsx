import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import SongSearch from "@/components/SongSearch";
import { Loader2, Plus, LightbulbIcon } from "lucide-react";
import SpotifyPlayer from "@/components/SpotifyPlayer";
import { useToast } from "@/components/ui/use-toast";
import SongResultsTable from "@/components/SongResultsTable";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useSongQuery } from "@/hooks/useSongQuery";
import { useLikedSongs } from "@/hooks/useLikedSongs";
import { useUserRole } from "@/hooks/useUserRole";

interface Song {
  id: number;
  title: string;
  type: "tango" | "milonga" | "vals";
  style: "rhythmic" | "melodic" | "dramatic";
  recording_year: number | null;
  is_instrumental: boolean | null;
  spotify_id: string | null;
  orchestra: { name: string } | null;
  song_singer: Array<{ singer: { name: string } }>;
}

const Songs = () => {
  const [searchParams, setSearchParams] = useState(null);
  const [selectedTrackId, setSelectedTrackId] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const navigate = useNavigate();

  const { data: userRole } = useUserRole();
  const { data: likedSongs } = useLikedSongs();
  const { data: songs, isLoading } = useSongQuery(searchParams);

  const toggleLikeMutation = useMutation({
    mutationFn: async ({ songId, isLiked }: { songId: number; isLiked: boolean }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      if (isLiked) {
        const { error } = await supabase
          .from("user_song_likes")
          .delete()
          .eq("user_id", user.id)
          .eq("song_id", songId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("user_song_likes")
          .insert({ user_id: user.id, song_id: songId });
        if (error) throw error;
      }
    },
    onSuccess: (_, { isLiked }) => {
      queryClient.invalidateQueries({ queryKey: ["liked-songs"] });
      toast({
        title: isLiked ? "Song removed from likes" : "Song added to likes",
        duration: 2000,
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update song like status",
        variant: "destructive",
      });
      console.error("Error toggling like:", error);
    },
  });

  const handleSearch = (params: any) => {
    setSearchParams(params);
  };

  const handleSongClick = (spotify_id: string | null) => {
    if (spotify_id) {
      setSelectedTrackId(spotify_id);
    }
  };

  const handleClosePlayer = () => {
    setSelectedTrackId(null);
  };

  const handleLikeClick = (e: React.MouseEvent, songId: number) => {
    e.stopPropagation();
    const isLiked = likedSongs?.includes(songId) || false;
    toggleLikeMutation.mutate({ songId, isLiked });
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-tango-light">Songs</h1>
          <div className="flex gap-4">
            {userRole === "moderator" ? (
              <Button
                onClick={() => navigate("/songs/add")}
                className="bg-tango-red hover:bg-tango-red/90"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Song
              </Button>
            ) : (
              <Button
                onClick={() => navigate("/songs/suggest")}
                className="bg-tango-red hover:bg-tango-red/90"
              >
                <LightbulbIcon className="h-4 w-4 mr-2" />
                Suggest Song
              </Button>
            )}
          </div>
        </div>
        <SongSearch onSearch={handleSearch} />
      </div>
  
      {/* Scrollable Results Area */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex justify-center p-6">
            <Loader2 className="h-8 w-8 animate-spin text-tango-red" />
          </div>
        ) : (
          <SongResultsTable
            songs={songs || []}
            likedSongs={likedSongs}
            selectedTrackId={selectedTrackId}
            isModerator={userRole === "moderator"}
            onSongClick={handleSongClick}
            onLikeClick={handleLikeClick}
          />
        )}
      </div>
      {selectedTrackId && (
        <SpotifyPlayer trackId={selectedTrackId} onClose={handleClosePlayer} />
      )}
    </main>
  );  
};

export default Songs;