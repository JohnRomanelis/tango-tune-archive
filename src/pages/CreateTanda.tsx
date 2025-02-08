import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import TandaForm from "@/components/tanda/TandaForm";
import SelectedSongsList from "@/components/tanda/SelectedSongsList";
import SongSearchSection from "@/components/tanda/SongSearchSection";

interface Song {
  id: number;
  title: string;
  spotify_id?: string | null;
  orchestra?: { name: string };
  song_singer?: Array<{ singer: { name: string } }>;
  recording_year?: number;
}

const CreateTanda = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [comments, setComments] = useState("");
  const [spotifyLink, setSpotifyLink] = useState("");
  const [selectedSongs, setSelectedSongs] = useState<Song[]>([]);
  const [selectedTrackId, setSelectedTrackId] = useState<string | null>(null);
  const [isPublic, setIsPublic] = useState(false);

  const handleSongClick = (spotify_id: string | null) => {
    setSelectedTrackId(spotify_id);
  };

  const handleAddSong = (song: Song) => {
    if (selectedSongs.some((s) => s.id === song.id)) {
      toast({
        title: "Song already in tanda",
        description: "This song is already part of the tanda.",
        variant: "destructive",
      });
      return;
    }
    setSelectedSongs((prev) => [...prev, song]);
  };

  const handleRemoveSong = (songId: number) => {
    setSelectedSongs((prev) => prev.filter((song) => song.id !== songId));
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(selectedSongs);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setSelectedSongs(items);
  };

  const handleSaveTanda = async () => {
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
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { data: tanda, error: tandaError } = await supabase
        .from("tanda")
        .insert({
          title,
          comments,
          spotify_link: spotifyLink,
          user_id: user.id,
          visibility: isPublic ? "public" : "private",
        })
        .select()
        .single();

      if (tandaError) throw tandaError;

      const tandaSongEntries = selectedSongs.map((song, index) => ({
        tanda_id: tanda.id,
        song_id: song.id,
        order_in_tanda: index + 1,
      }));

      const { error: tandaSongError } = await supabase
        .from("tanda_song")
        .insert(tandaSongEntries);

      if (tandaSongError) throw tandaSongError;

      toast({
        title: "Success",
        description: "Tanda created successfully!",
      });

      navigate("/tandas");
    } catch (error) {
      console.error("Error creating tanda:", error);
      toast({
        title: "Error",
        description: "Failed to create tanda. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <main className="h-screen flex flex-col">
      {/* Header Section */}
      <div className="flex justify-between items-center px-4 sm:px-6 lg:px-8 py-4 border-b border-gray-700">
        <h1 className="text-2xl font-bold text-tango-light">Create Tanda</h1>
      </div>

      {/* Split-Screen Content */}
      <div className="flex flex-grow overflow-hidden">
        {/* Left Panel - 40% */}
        <div className="w-2/5 flex flex-col space-y-4 overflow-y-auto px-4 py-4">
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

          <div className="flex justify-end">
            <Button
              onClick={handleSaveTanda}
              className="bg-tango-red hover:bg-tango-red/90"
            >
              Save Tanda
            </Button>
          </div>
        </div>

        {/* Right Panel - 60% */}
        <div className="w-3/5 flex flex-col space-y-4 overflow-y-auto px-4 py-4">
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

export default CreateTanda;
