import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";
import { Button } from "@/components/ui/button";
import TandaForm from "@/components/tanda/TandaForm";
import SelectedSongsList from "@/components/tanda/SelectedSongsList";
import SongSearchSection from "@/components/tanda/SongSearchSection";
import { Loader2 } from "lucide-react";
import { parseId } from "@/utils/idConversion";

const EditTanda = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const user = useAuthRedirect();
  const [title, setTitle] = useState("");
  const [comments, setComments] = useState("");
  const [spotifyLink, setSpotifyLink] = useState("");
  const [selectedSongs, setSelectedSongs] = useState<any[]>([]);
  const [selectedTrackId, setSelectedTrackId] = useState<string | null>(null);
  const [isPublic, setIsPublic] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTanda = async () => {
      if (!id) return;

      try {
        const parsedId = parseId(id);
        const { data: tanda, error } = await supabase
          .from("tanda")
          .select(`
            *,
            tanda_song (
              order_in_tanda,
              song (
                id,
                title,
                type,
                style,
                recording_year,
                spotify_id,
                orchestra (name),
                song_singer (
                  singer (name)
                )
              )
            )
          `)
          .eq("id", parsedId)
          .single();

        if (error) throw error;

        setTitle(tanda.title);
        setComments(tanda.comments || "");
        setSpotifyLink(tanda.spotify_link || "");
        setIsPublic(tanda.visibility === "public");
        setSelectedSongs(tanda.tanda_song.map((ts: any) => ({
          ...ts.song,
          order_in_tanda: ts.order_in_tanda
        })));
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching tanda:", error);
        toast({
          title: "Error",
          description: "Failed to load tanda",
          variant: "destructive",
        });
        navigate("/tandas");
      }
    };

    fetchTanda();
  }, [id, navigate, toast]);

  const handleSongClick = (spotify_id: string | null) => {
    setSelectedTrackId(spotify_id);
  };

  const handleAddSong = (song: any) => {
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
      const { error: tandaError } = await supabase
        .from('tanda')
        .update({
          title,
          comments,
          spotify_link: spotifyLink,
          visibility: isPublic ? 'public' : 'private'
        })
        .eq('id', id);

      if (tandaError) throw tandaError;

      // Delete existing tanda_song entries
      const { error: deleteError } = await supabase
        .from('tanda_song')
        .delete()
        .eq('tanda_id', id);

      if (deleteError) throw deleteError;

      // Insert new tanda_song entries with correct types
      const tandaSongEntries = selectedSongs.map(song => ({
        tanda_id: Number(id), // Convert string id to number
        song_id: Number(song.id), // Ensure song_id is a number
        order_in_tanda: Number(song.order_in_tanda), // Ensure order is a number
        is_active: true // Add the is_active field
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

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-tango-red" />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-tango-red" />
      </div>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-[200px]">
      <div className="flex space-x-6">
        <div className="w-2/5 space-y-6">
          <TandaForm
            title={title}
            comments={comments}
            spotifyLink={spotifyLink}
            isPublic={isPublic}
            onTitleChange={setTitle}
            onCommentsChange={setComments}
            onSpotifyLinkChange={setSpotifyLink}
            onVisibilityChange={setIsPublic}
          />

          <SelectedSongsList
            songs={selectedSongs}
            onSongClick={handleSongClick}
            onRemoveSong={handleRemoveSong}
            onReorder={handleDragEnd}
          />

          <div className="flex justify-end space-x-4">
            <Button
              variant="outline"
              onClick={() => navigate("/tandas")}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdateTanda}
              className="bg-tango-red hover:bg-tango-red/90"
            >
              Update Tanda
            </Button>
          </div>
        </div>

        <div className="w-3/5">
          <SongSearchSection
            selectedTrackId={selectedTrackId}
            onSongClick={handleSongClick}
            onAddSong={handleAddSong}
          />
        </div>
      </div>
    </main>
  );
};

export default EditTanda;
