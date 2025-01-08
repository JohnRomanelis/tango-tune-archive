import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";
import EditTandaForm from "@/components/tanda/EditTandaForm";
import SongSearchSection from "@/components/tanda/SongSearchSection";
import { Loader2 } from "lucide-react";
import { useEditTanda } from "@/hooks/useEditTanda";
import { parseId } from "@/utils/idConversion";

const EditTanda = () => {
  const { id } = useParams();
  const user = useAuthRedirect();
  const {
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
  } = useEditTanda(id);

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
        setIsLoading(false);
      }
    };

    fetchTanda();
  }, [id, setTitle, setComments, setSpotifyLink, setIsPublic, setSelectedSongs, setIsLoading]);

  if (!user || isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-tango-red" />
      </div>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-[200px]">
      <div className="flex space-x-6">
        <EditTandaForm
          title={title}
          comments={comments}
          spotifyLink={spotifyLink}
          isPublic={isPublic}
          selectedSongs={selectedSongs}
          selectedTrackId={selectedTrackId}
          onTitleChange={setTitle}
          onCommentsChange={setComments}
          onSpotifyLinkChange={setSpotifyLink}
          onVisibilityChange={setIsPublic}
          onSongClick={handleSongClick}
          onRemoveSong={handleRemoveSong}
          onReorder={handleDragEnd}
          onUpdate={handleUpdateTanda}
        />

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