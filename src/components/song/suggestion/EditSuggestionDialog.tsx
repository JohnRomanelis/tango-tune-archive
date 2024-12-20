import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import SongForm from "@/components/song/SongForm";
import { SongSuggestion } from "@/types/song";

interface EditSuggestionDialogProps {
  suggestion: SongSuggestion | null;
  isOpen: boolean;
  onClose: () => void;
}

const EditSuggestionDialog = ({ suggestion, isOpen, onClose }: EditSuggestionDialogProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const editSuggestionMutation = useMutation({
    mutationFn: async (formData: any) => {
      // First, create the new song
      const { data: song, error: songError } = await supabase
        .from("song")
        .insert([{
          title: formData.title,
          type: formData.type,
          style: formData.style,
          recording_year: formData.recording_year,
          is_instrumental: formData.is_instrumental,
          orchestra_id: formData.orchestra_id,
          spotify_id: formData.spotify_id,
          duration: formData.duration,
        }])
        .select()
        .single();

      if (songError) throw songError;

      // Add singers if any
      if (formData.singers?.length > 0) {
        const songSingerData = formData.singers.map((singerId: number) => ({
          song_id: song.id,
          singer_id: singerId,
        }));

        const { error: singerError } = await supabase
          .from("song_singer")
          .insert(songSingerData);

        if (singerError) throw singerError;
      }

      // Update suggestion status
      if (suggestion?.id) {
        const { error: updateError } = await supabase
          .from("suggested_song")
          .update({ 
            status: "approved-edited",
            updated_at: new Date().toISOString()
          })
          .eq("id", suggestion.id);

        if (updateError) throw updateError;
      }

      return song;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["song-suggestions"] });
      queryClient.invalidateQueries({ queryKey: ["songs"] });
      toast({
        title: "Success",
        description: "Song suggestion edited and approved successfully",
      });
      onClose();
    },
    onError: (error) => {
      console.error("Error editing suggestion:", error);
      toast({
        title: "Error",
        description: "Failed to edit song suggestion",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = async (formData: any) => {
    editSuggestionMutation.mutate(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Edit Song Suggestion</DialogTitle>
        </DialogHeader>
        {suggestion && (
          <SongForm
            initialData={{
              title: suggestion.title,
              type: suggestion.type,
              style: suggestion.style,
              recording_year: suggestion.recording_year,
              is_instrumental: suggestion.is_instrumental,
              orchestra_id: suggestion.orchestra?.id,
              spotify_id: suggestion.spotify_id,
              duration: suggestion.duration,
              singers: suggestion.suggested_song_singer?.map(s => s.singer.id) || [],
            }}
            onSubmit={handleSubmit}
            submitButtonText="Save and Approve"
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EditSuggestionDialog;