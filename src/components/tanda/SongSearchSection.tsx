import { ScrollArea } from "@/components/ui/scroll-area";
import SongSearch from "@/components/SongSearch";
import SongResultsTable from "@/components/SongResultsTable";
import SpotifyPlayer from "@/components/SpotifyPlayer";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";

interface Song {
  id: number;
  title: string;
  spotify_id?: string | null;
  orchestra?: { name: string };
  song_singer?: Array<{ singer: { name: string } }>;
}

interface SongSearchSectionProps {
  selectedTrackId: string | null;
  onSongClick: (spotify_id: string | null) => void;
  onAddSong: (song: Song) => void;
}

const SongSearchSection = ({
  selectedTrackId,
  onSongClick,
  onAddSong,
}: SongSearchSectionProps) => {
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const { data: likedSongs = [] } = useQuery({
    queryKey: ["likedSongs"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data } = await supabase
        .from("user_song_likes")
        .select("song_id")
        .eq("user_id", user.id);

      return data?.map(like => like.song_id) || [];
    },
  });

  const handleSearch = async (params: any) => {
    let query = supabase
      .from('song')
      .select(`
        *,
        orchestra:orchestra_id (name),
        song_singer (
          singer (name)
        )
      `);

    if (params.title) {
      query = query.ilike('title', `%${params.title}%`);
    }
    if (params.orchestra) {
      query = query.eq('orchestra.name', params.orchestra);
    }
    if (params.singer) {
      query = query.contains('song_singer.singer.name', [params.singer]);
    }
    if (params.type) {
      query = query.eq('type', params.type);
    }
    if (params.style) {
      query = query.eq('style', params.style);
    }
    if (params.yearFrom) {
      query = query.gte('recording_year', params.yearFrom);
    }
    if (params.yearTo) {
      query = query.lte('recording_year', params.yearTo);
    }
    if (params.isInstrumental !== undefined) {
      query = query.eq('is_instrumental', params.isInstrumental);
    }
    if (params.likedOnly) {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: likedSongIds } = await supabase
          .from('user_song_likes')
          .select('song_id')
          .eq('user_id', user.id);
        
        if (likedSongIds && likedSongIds.length > 0) {
          query = query.in('id', likedSongIds.map(like => like.song_id));
        } else {
          setSearchResults([]);
          return;
        }
      }
    }

    const { data, error } = await query;
    if (error) {
      console.error('Error searching songs:', error);
      return;
    }
    setSearchResults(data || []);
  };

  const handleLikeClick = async (e: React.MouseEvent, songId: number) => {
    e.stopPropagation();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const isLiked = likedSongs.includes(songId);

    if (isLiked) {
      await supabase
        .from('user_song_likes')
        .delete()
        .eq('user_id', user.id)
        .eq('song_id', songId);
    } else {
      await supabase
        .from('user_song_likes')
        .insert([
          { user_id: user.id, song_id: songId }
        ]);
    }
  };

  return (
    <div className="space-y-6 h-full">
      <SongSearch onSearch={handleSearch} />
      <ScrollArea className="h-[calc(100vh-400px)]">
        <SongResultsTable
          songs={searchResults}
          likedSongs={likedSongs}
          selectedTrackId={selectedTrackId}
          onSongClick={onSongClick}
          onLikeClick={handleLikeClick}
          onAddClick={onAddSong}
        />
      </ScrollArea>
      <div className="fixed bottom-0 right-0 w-3/5 pr-4 sm:pr-6 lg:pr-8">
        <SpotifyPlayer trackId={selectedTrackId} />
      </div>
    </div>
  );
};

export default SongSearchSection;