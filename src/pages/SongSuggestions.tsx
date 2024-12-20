import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2 } from "lucide-react";
import SpotifyPlayer from "@/components/SpotifyPlayer";
import SuggestedSongsTable from "@/components/song/SuggestedSongsTable";
import SuggestionFilters from "@/components/song/SuggestionFilters";
import { SongSuggestion, SuggestionStatus } from "@/types/song";
import { useSongSuggestions } from "@/hooks/useSongSuggestions";

const SongSuggestions = () => {
  const [showPending, setShowPending] = useState(true);
  const [showApproved, setShowApproved] = useState(false);
  const [showRejected, setShowRejected] = useState(false);
  const [selectedTrackId, setSelectedTrackId] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const statuses: SuggestionStatus[] = [
    ...(showPending ? ["pending"] : []),
    ...(showApproved ? ["approved", "approved-edited"] : []),
    ...(showRejected ? ["rejected"] : []),
  ] as SuggestionStatus[];

  const { data: suggestions, isLoading } = useSongSuggestions(statuses);

  const updateSuggestionMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: SuggestionStatus }) => {
      const { error } = await supabase
        .from("suggested_song")
        .update({ 
          status,
          updated_at: new Date().toISOString()
        })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["song-suggestions"] });
      toast({
        title: "Success",
        description: "Suggestion status updated successfully",
      });
    },
  });

  const approveSuggestionMutation = useMutation({
    mutationFn: async (suggestion: SongSuggestion) => {
      const songData = {
        title: suggestion.title,
        type: suggestion.type,
        style: suggestion.style,
        recording_year: suggestion.recording_year,
        is_instrumental: suggestion.is_instrumental,
        orchestra_id: suggestion.orchestra?.id,
        spotify_id: suggestion.spotify_id,
        duration: suggestion.duration,
      };

      const { data: song, error: songError } = await supabase
        .from("song")
        .insert([songData])
        .select()
        .single();

      if (songError) throw songError;

      if (suggestion.suggested_song_singer?.length > 0) {
        const songSingerData = suggestion.suggested_song_singer.map(
          (s) => ({
            song_id: song.id,
            singer_id: s.singer.id,
          })
        );

        const { error: singerError } = await supabase
          .from("song_singer")
          .insert(songSingerData);

        if (singerError) throw singerError;
      }

      const { error: updateError } = await supabase
        .from("suggested_song")
        .update({ 
          status: "approved",
          updated_at: new Date().toISOString()
        })
        .eq("id", suggestion.id);

      if (updateError) throw updateError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["song-suggestions"] });
      queryClient.invalidateQueries({ queryKey: ["songs"] });
      toast({
        title: "Success",
        description: "Song suggestion approved and added to the database",
      });
    },
  });

  const handleSongClick = (spotify_id: string | null) => {
    setSelectedTrackId(spotify_id);
  };

  const handleClosePlayer = () => {
    setSelectedTrackId(null);
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-[200px]">
      <h1 className="text-3xl font-bold text-tango-light mb-6">Song Suggestions</h1>

      <SuggestionFilters
        showPending={showPending}
        showApproved={showApproved}
        showRejected={showRejected}
        setShowPending={setShowPending}
        setShowApproved={setShowApproved}
        setShowRejected={setShowRejected}
      />

      <ScrollArea className="h-[calc(100vh-300px)]">
        {isLoading ? (
          <div className="flex justify-center p-6">
            <Loader2 className="h-8 w-8 animate-spin text-tango-red" />
          </div>
        ) : suggestions && suggestions.length > 0 ? (
          <SuggestedSongsTable
            suggestions={suggestions}
            selectedTrackId={selectedTrackId}
            onSongClick={handleSongClick}
            onApprove={(suggestion) => approveSuggestionMutation.mutate(suggestion)}
            onReject={(id) => updateSuggestionMutation.mutate({ id, status: "rejected" })}
            onEdit={(id) => navigate(`/maintenance/song-suggestions/${id}/edit`)}
          />
        ) : (
          <div className="text-center text-tango-light p-6">
            No suggestions found for the selected filters.
          </div>
        )}
      </ScrollArea>

      {selectedTrackId && (
        <SpotifyPlayer trackId={selectedTrackId} onClose={handleClosePlayer} />
      )}
    </main>
  );
};

export default SongSuggestions;