import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import PlaylistForm from "@/components/playlist/PlaylistForm";
import SelectedTandasList from "@/components/playlist/SelectedTandasList";
import TandaSearchSection from "@/components/tanda/TandaSearchSection";
import TandaDetailsDialog from "@/components/tanda/TandaDetailsDialog";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";
import { updateTandasVisibility } from "@/utils/playlistUtils";

interface Tanda {
  id: number;
  title: string;
  comments?: string;
  visibility?: "private" | "public" | "shared";
}

const CreatePlaylist = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const user = useAuthRedirect();
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [spotifyLink, setSpotifyLink] = useState("");
  const [selectedTandas, setSelectedTandas] = useState<Tanda[]>([]);
  const [isPublic, setIsPublic] = useState(false);
  const [selectedTandaForDialog, setSelectedTandaForDialog] = useState<any>(null);

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

  const handleSavePlaylist = async () => {
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
      if (!user?.id) throw new Error("User not authenticated");

      const { data: playlist, error: playlistError } = await supabase
        .from('playlist')
        .insert({
          title,
          description,
          spotify_link: spotifyLink,
          user_id: user.id,
          visibility: isPublic ? 'public' : 'private'
        })
        .select()
        .single();

      if (playlistError) throw playlistError;

      const playlistTandaEntries = selectedTandas.map((tanda, index) => ({
        playlist_id: playlist.id,
        tanda_id: tanda.id,
        order_in_playlist: index + 1
      }));

      const { error: playlistTandaError } = await supabase
        .from('playlist_tanda')
        .insert(playlistTandaEntries);

      if (playlistTandaError) throw playlistTandaError;

      if (isPublic) {
        await updateTandasVisibility(playlist.id, 'public');
      }

      toast({
        title: "Success",
        description: "Playlist created successfully!",
      });

      navigate('/playlists');
    } catch (error) {
      console.error('Error creating playlist:', error);
      toast({
        title: "Error",
        description: "Failed to create playlist. Please try again.",
        variant: "destructive",
      });
    }
  };

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
              onClick={handleSavePlaylist}
              className="bg-tango-red hover:bg-tango-red/90"
            >
              Save Playlist
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

export default CreatePlaylist;
