import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import SongSearch from "@/components/SongSearch";
import { Loader2, Plus } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import SpotifyPlayer from "@/components/SpotifyPlayer";
import { useToast } from "@/components/ui/use-toast";
import SongResultsTable from "@/components/SongResultsTable";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface Song {
  id: number;
  title: string;
  type: "tango" | "milonga" | "vals";
  style: "rhythmic" | "melodic" | "dramatic";
  recording_year?: number;
  is_instrumental?: boolean;
  spotify_id?: string | null;
  orchestra?: { name: string } | null;
  song_singer?: Array<{ singer: { name: string } }>;
}

const Songs = () => {
  const [searchParams, setSearchParams] = useState(null);
  const [selectedTrackId, setSelectedTrackId] = useState(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const navigate = useNavigate();

  const { data: userRole } = useQuery({
    queryKey: ["user-role"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data } = await supabase
        .from("user_roles")
        .select("roles(name)")
        .eq("user_id", user.id)
        .single();

      return data?.roles?.name || null;
    },
  });

  const { data: likedSongs } = useQuery({
    queryKey: ["liked-songs"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];
      
      const { data } = await supabase
        .from("user_song_likes")
        .select("song_id")
        .eq("user_id", user.id);
      
      return (data || []).map(like => like.song_id);
    },
  });

  const { data: songs, isLoading } = useQuery({
    queryKey: ["songs", searchParams],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user && searchParams?.likedOnly) return [];

      let query = supabase
        .from("song")
        .select(`
          id,
          title,
          type,
          style,
          recording_year,
          is_instrumental,
          spotify_id,
          orchestra:orchestra_id(name)
        `)
        .select(`
          *,
          orchestra:orchestra_id!inner(name),
          song_singer(singer(name))
        `);

      if (searchParams) {
        if (searchParams.likedOnly) {
          const { data: likedSongIds } = await supabase
            .from("user_song_likes")
            .select("song_id")
            .eq("user_id", user!.id);
          
          if (likedSongIds && likedSongIds.length > 0) {
            query = query.in("id", likedSongIds.map(like => like.song_id));
          } else {
            return [];
          }
        }

        if (searchParams.title) {
          query = query.ilike('title', `%${searchParams.title}%`);
        }
        if (searchParams.orchestra) {
          // First get the orchestra ID
          const { data: orchestraData } = await supabase
            .from('orchestra')
            .select('id')
            .eq('name', searchParams.orchestra)
            .single();
          
          if (orchestraData) {
            query = query.eq('orchestra_id', orchestraData.id);
          } else {
            return [];
          }
        }
        if (searchParams.singer) {
          query = query.eq('song_singer.singer.name', searchParams.singer);
        }
        if (searchParams.yearFrom) {
          query = query.gte('recording_year', searchParams.yearFrom);
        }
        if (searchParams.yearTo) {
          query = query.lte('recording_year', searchParams.yearTo);
        }
        if (searchParams.isInstrumental !== undefined) {
          query = query.eq('is_instrumental', searchParams.isInstrumental);
        }
        if (searchParams.type) {
          query = query.eq('type', searchParams.type);
        }
        if (searchParams.style) {
          query = query.eq('style', searchParams.style);
        }
      }

      const { data, error } = await query;
      if (error) throw error;
      
      // Transform the data to match the Song interface
      const transformedData = (data || []).map(song => ({
        ...song,
        orchestra: song.orchestra ? { name: song.orchestra.name } : null
      }));

      return transformedData as Song[];
    },
    enabled: searchParams !== null,
  });

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
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-[200px]">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-tango-light">Songs</h1>
          {userRole === "moderator" && (
            <Button
              onClick={() => navigate("/songs/add")}
              className="bg-tango-red hover:bg-tango-red/90"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Song
            </Button>
          )}
        </div>
        <SongSearch onSearch={handleSearch} />
      </div>
      
      <ScrollArea className="h-[calc(100vh-300px)]">
        {isLoading ? (
          <div className="flex justify-center p-6">
            <Loader2 className="h-8 w-8 animate-spin text-tango-red" />
          </div>
        ) : (
          <SongResultsTable
            songs={songs || []}
            likedSongs={likedSongs}
            selectedTrackId={selectedTrackId}
            isModerator={userRole === 'moderator'}
            onSongClick={handleSongClick}
            onLikeClick={handleLikeClick}
          />
        )}
      </ScrollArea>
      {selectedTrackId && (
        <SpotifyPlayer trackId={selectedTrackId} onClose={handleClosePlayer} />
      )}
    </main>
  );
};

export default Songs;
