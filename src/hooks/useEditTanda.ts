import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { parseId } from "@/utils/idConversion";

interface Song {
  id: number;
  title: string;
  spotify_id?: string | null;
  orchestra?: { name: string };
  song_singer?: Array<{ singer: { name: string } }>;
  recording_year?: number;
  order_in_tanda?: number;
}

export const useEditTanda = (id: string | undefined) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [comments, setComments] = useState("");
  const [spotifyLink, setSpotifyLink] = useState("");
  const [selectedSongs, setSelectedSongs] = useState<Song[]>([]);
  const [selectedTrackId, setSelectedTrackId] = useState<string | null>(null);
  const [isPublic, setIsPublic] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleSongClick = (spotify_id: string | null) => {
    setSelectedTrackId(spotify_id);
  };

  const handleAddSong = (song: Song) => {
    if (selectedSongs.some(s => s.id === song.id)) {
      toast({
        title: "Song already in tanda",
        description: "This song is already part of the tanda.",
        variant: "destructive",
      });
      return;
    }
    setSelectedSongs(prev => [...prev, { ...song, order_in_tanda: prev.length + 1 }]);
  };

  const handleRemoveSong = (songId: number) => {
    setSelectedSongs(prev => {
      const filtered = prev.filter(song => song.id !== songId);
      return filtered.map((song, index) => ({
        ...song,
        order_in_tanda: index + 1
      }));
    });
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(selectedSongs);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setSelectedSongs(items.map((item, index) => ({
      ...item,
      order_in_tanda: index + 1
    })));
  };

  const handleUpdateTanda = async () => {
    if (!title) {
      toast({
        title: "Title required",
        description: "Please enter a title for the tanda.",
        variant: "destructive",
      });
      return;
    }

    if (selectedSongs.length === 0) {
      toast({
        title: "No songs selected",
        description: "Please add at least one song to the tanda.",
        variant: "destructive",
      });
      return;
    }

    try {
      const parsedTandaId = parseId(id);
      const { error: tandaError } = await supabase
        .from('tanda')
        .update({
          title,
          comments,
          spotify_link: spotifyLink,
          visibility: isPublic ? 'public' : 'private'
        })
        .eq('id', parsedTandaId);

      if (tandaError) throw tandaError;

      const { error: deleteError } = await supabase
        .from('tanda_song')
        .delete()
        .eq('tanda_id', parsedTandaId);

      if (deleteError) throw deleteError;

      const tandaSongEntries = selectedSongs.map(song => ({
        tanda_id: parsedTandaId,
        song_id: song.id,
        order_in_tanda: song.order_in_tanda || 1,
        is_active: true
      }));

      const { error: tandaSongError } = await supabase
        .from('tanda_song')
        .insert(tandaSongEntries);

      if (tandaSongError) throw tandaSongError;

      toast({
        title: "Success",
        description: "Tanda updated successfully!",
      });

      navigate('/tandas');
    } catch (error) {
      console.error('Error updating tanda:', error);
      toast({
        title: "Error",
        description: "Failed to update tanda. Please try again.",
        variant: "destructive",
      });
    }
  };

  return {
    title,
    setTitle,
    comments,
    setComments,
    spotifyLink,
    setSpotifyLink,
    selectedSongs,
    setSelectedSongs,
    selectedTrackId,
    isPublic,
    setIsPublic,
    isLoading,
    setIsLoading,
    handleSongClick,
    handleAddSong,
    handleRemoveSong,
    handleDragEnd,
    handleUpdateTanda
  };
};