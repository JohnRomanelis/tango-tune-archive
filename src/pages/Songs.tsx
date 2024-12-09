import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Sidebar from "@/components/Sidebar";
import SongSearch from "@/components/SongSearch";
import { Loader2, Heart } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import SpotifyPlayer from "@/components/SpotifyPlayer";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface SearchParams {
  title?: string;
  orchestra?: string;
  singer?: string;
  yearFrom?: number;
  yearTo?: number;
  isInstrumental?: boolean;
  type?: string;
  style?: string;
  likedOnly?: boolean;
}

const Songs = () => {
  const [searchParams, setSearchParams] = useState<SearchParams | null>(null);
  const [selectedTrackId, setSelectedTrackId] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch user's liked songs
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

  // Fetch songs with filters
  const { data: songs, isLoading } = useQuery({
    queryKey: ["songs", searchParams],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user && searchParams?.likedOnly) return [];

      let query = supabase
        .from("song")
        .select(`
          *,
          orchestra (name),
          song_singer (
            singer (name)
          )
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
          query = query.eq('orchestra.name', searchParams.orchestra);
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
      return data || [];
    },
    enabled: searchParams !== null,
  });

  // Like/Unlike mutation
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

  const handleSearch = (params: SearchParams) => {
    setSearchParams(params);
  };

  const handleSongClick = (spotify_id: string | null) => {
    if (spotify_id) {
      setSelectedTrackId(spotify_id);
    }
  };

  const handleLikeClick = (e: React.MouseEvent, songId: number) => {
    e.stopPropagation();
    const isLiked = likedSongs?.includes(songId) || false;
    toggleLikeMutation.mutate({ songId, isLiked });
  };

  return (
    <div className="flex min-h-screen bg-tango-darkGray">
      <Sidebar />
      <main className="flex-1 p-6 pb-[200px]">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-tango-light mb-6">Songs</h1>
          <SongSearch onSearch={handleSearch} />
        </div>
        
        <ScrollArea className="h-[calc(100vh-300px)]">
          {isLoading ? (
            <div className="flex justify-center p-6">
              <Loader2 className="h-8 w-8 animate-spin text-tango-red" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {songs?.map((song) => (
                <div 
                  key={song.id} 
                  className={`bg-tango-gray rounded-lg p-6 cursor-pointer transition-all hover:bg-tango-gray/80 ${
                    song.spotify_id === selectedTrackId ? 'ring-2 ring-tango-red' : ''
                  }`}
                  onClick={() => handleSongClick(song.spotify_id)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-semibold text-tango-light">{song.title}</h3>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={`${likedSongs?.includes(song.id) ? 'text-tango-red' : 'text-gray-400'} hover:text-tango-red`}
                      onClick={(e) => handleLikeClick(e, song.id)}
                    >
                      <Heart className="h-5 w-5" fill={likedSongs?.includes(song.id) ? "currentColor" : "none"} />
                    </Button>
                  </div>
                  <div className="space-y-2 text-gray-400">
                    <p>Orchestra: {song.orchestra?.name || 'N/A'}</p>
                    <p>Type: {song.type}</p>
                    <p>Style: {song.style}</p>
                    <p>Year: {song.recording_year || 'Unknown'}</p>
                    <p>{song.is_instrumental ? 'Instrumental' : 'Vocal'}</p>
                    {song.song_singer && song.song_singer.length > 0 && (
                      <p>Singers: {song.song_singer.map(s => s.singer?.name || 'Unknown').join(', ')}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </main>
      <SpotifyPlayer trackId={selectedTrackId} />
    </div>
  );
};

export default Songs;