import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import SongForm from "@/components/song/SongForm";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

const EditSongSuggestion = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: userRole } = useQuery({
    queryKey: ["user-role"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data } = await supabase
        .from("user_roles")
        .select("roles(name)")
        .eq("user_id", user.id)
        .single();

      return data?.roles?.name || null;
    },
  });

  const { data: suggestion, isLoading } = useQuery({
    queryKey: ["song-suggestion", id],
    queryFn: async () => {
      const { data: suggestionData, error: suggestionError } = await supabase
        .from("suggested_song")
        .select(`
          *,
          suggested_song_singer (
            singer_id
          )
        `)
        .eq("id", id)
        .single();

      if (suggestionError) throw suggestionError;

      return {
        ...suggestionData,
        singers: suggestionData.suggested_song_singer.map(s => s.singer_id),
      };
    },
  });

  if (userRole !== "moderator") {
    navigate("/songs");
    return null;
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-tango-red" />
      </div>
    );
  }

  const handleSubmit = async (formData: any) => {
    try {
      // First, create the new song
      const { data: song, error: songError } = await supabase
        .from("song")
        .insert({
          title: formData.title,
          type: formData.type,
          style: formData.style,
          recording_year: formData.recording_year || null,
          is_instrumental: formData.is_instrumental,
          orchestra_id: formData.orchestra_id || null,
          spotify_id: formData.spotify_id || null,
          duration: formData.duration || null,
        })
        .select()
        .single();

      if (songError) throw songError;

      // Add singers if any
      if (formData.singers.length > 0) {
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
      const { error: updateError } = await supabase
        .from("suggested_song")
        .update({ 
          status: "approved-edited",
          updated_at: new Date().toISOString()
        })
        .eq("id", id);

      if (updateError) throw updateError;

      toast({
        title: "Success",
        description: "Song suggestion edited and approved successfully",
      });

      navigate("/maintenance/song-suggestions");
    } catch (error) {
      console.error("Error updating song suggestion:", error);
      toast({
        title: "Error",
        description: "Failed to update song suggestion",
        variant: "destructive",
      });
    }
  };

  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <h1 className="text-3xl font-bold text-tango-light mb-6">Edit Song Suggestion</h1>
      <div className="bg-tango-gray rounded-lg p-6">
        <SongForm 
          initialData={suggestion} 
          onSubmit={handleSubmit}
          submitButtonText="Save and Approve"
        />
      </div>
    </main>
  );
};

export default EditSongSuggestion;