import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import PlaylistForm from "@/components/playlist/PlaylistForm";
import SelectedTandasList from "@/components/playlist/SelectedTandasList";
import TandaSearchSection from "@/components/tanda/TandaSearchSection";
import TandaDetailsDialog from "@/components/tanda/TandaDetailsDialog";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { updateTandasVisibility } from "@/utils/playlistUtils";

interface Tanda {
  id: number;
  title: string;
  comments?: string;
  visibility?: "private" | "public" | "shared";
}

const EditPlaylist = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { id } = useParams();
  const user = useAuthRedirect();
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [spotifyLink, setSpotifyLink] = useState("");
  const [selectedTandas, setSelectedTandas] = useState<Tanda[]>([]);
  const [isPublic, setIsPublic] = useState(false);
  const [selectedTandaForDialog, setSelectedTandaForDialog] = useState<any>(null);

  const { data: playlist, isLoading } = useQuery({
    queryKey: ['playlist', id],
    queryFn: async () => {
      if (!id || !user) return null;
      
      const { data, error } = await supabase
        .from('playlist')
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
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching playlist:', error);
        throw error;
      }
      return data;
    },
    enabled: !!id && !!user
  });

  useEffect(() => {
    if (playlist) {
      setTitle(playlist.title);
      setDescription(playlist.description || "");
      setSpotifyLink(playlist.spotify_link || "");
      setIsPublic(playlist.visibility === "public");
      
      const tandas = playlist.playlist_tanda
        ?.sort((a: any, b: any) => a.order_in_playlist - b.order_in_playlist)
        .map((pt: any) => pt.tanda);
      setSelectedTandas(tandas || []);
    }
  }, [playlist]);

  const handleAddTanda = (tanda: Tanda) => {
    if (selectedTandas.some(t => t.id === tanda.id)) {
      toast({
        title: "Tanda already in playlist",
        description: "This tanda is already part of the playlist.",
        variant: "destructive",
      });
      return;
    }
    setSelectedTandas(prev => [...prev, tanda]);
  };

  const handleRemoveTanda = (tandaId: number) => {
    setSelectedTandas(prev => prev.filter(tanda => tanda.id !== tandaId));
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(selectedTandas);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setSelectedTandas(items);
  };

  const handleUpdatePlaylist = async () => {
    if (!title) {
      toast({
        title: "Title required",
        description: "Please enter a title for the playlist.",
        variant: "destructive",
      });
      return;
    }

    if (selectedTandas.length === 0) {
      toast({
        title: "No tandas selected",
        description: "Please add at least one tanda to the playlist.",
        variant: "destructive",
      });
      return;
    }

    try {
      if (!user?.id || !id) throw new Error("User not authenticated or invalid playlist ID");

      const playlistId = parseInt(id, 10);
      if (isNaN(playlistId)) throw new Error("Invalid playlist ID");

      const { error: playlistError } = await supabase
        .from('playlist')
        .update({
          title,
          description,
          spotify_link: spotifyLink,
          visibility: isPublic ? 'public' : 'private'
        })
        .eq('id', playlistId);

      if (playlistError) throw playlistError;

      const { error: deleteError } = await supabase
        .from('playlist_tanda')
        .delete()
        .eq('playlist_id', playlistId);

      if (deleteError) throw deleteError;

      const playlistTandaEntries = selectedTandas.map((tanda, index) => ({
        playlist_id: playlistId,
        tanda_id: tanda.id,
        order_in_playlist: index + 1
      }));

      const { error: playlistTandaError } = await supabase
        .from('playlist_tanda')
        .insert(playlistTandaEntries);

      if (playlistTandaError) throw playlistTandaError;

      if (isPublic) {
        await updateTandasVisibility(playlistId, 'public');
      }

      toast({
        title: "Success",
        description: "Playlist updated successfully!",
      });

      navigate('/playlists');
    } catch (error) {
      console.error('Error updating playlist:', error);
      toast({
        title: "Error",
        description: "Failed to update playlist. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-200px)]">
        <Loader2 className="h-8 w-8 animate-spin text-tango-red" />
      </div>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-[200px]">
      <div className="flex space-x-6">
        <div className="w-2/5 space-y-6">
          <PlaylistForm
            title={title}
            description={description}
            spotifyLink={spotifyLink}
            isPublic={isPublic}
            onTitleChange={setTitle}
            onDescriptionChange={setDescription}
            onSpotifyLinkChange={setSpotifyLink}
            onVisibilityChange={setIsPublic}
          />

          <SelectedTandasList
            tandas={selectedTandas}
            onRemoveTanda={handleRemoveTanda}
            onReorder={handleDragEnd}
          />

          <div className="flex justify-end">
            <Button
              onClick={handleUpdatePlaylist}
              className="bg-tango-red hover:bg-tango-red/90"
            >
              Update Playlist
            </Button>
          </div>
        </div>

        <div className="w-3/5">
          <TandaSearchSection
            onAddTanda={handleAddTanda}
            onTandaClick={setSelectedTandaForDialog}
          />
        </div>
      </div>

      <TandaDetailsDialog
        tanda={selectedTandaForDialog}
        isOpen={!!selectedTandaForDialog}
        onClose={() => setSelectedTandaForDialog(null)}
      />
    </main>
  );
};

export default EditPlaylist;
