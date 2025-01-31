import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import SongForm from "@/components/song/SongForm";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { parseId } from "@/utils/idConversion";

const EditSong = () => {
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

  const { data: song, isLoading } = useQuery({
    queryKey: ["song", id],
    queryFn: async () => {
      if (!id) throw new Error("Song ID is required");
      const songId = parseId(id);
      
      const { data: songData, error: songError } = await supabase
        .from("song")
        .select("*")
        .eq("id", songId)
        .single();

      if (songError) throw songError;

      const { data: singerData, error: singerError } = await supabase
        .from("song_singer")
        .select("singer_id")
        .eq("song_id", songId);

      if (singerError) throw singerError;

      return {
        ...songData,
        singers: singerData.map(s => s.singer_id),
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
      if (!id) throw new Error("Song ID is required");
      const songId = parseId(id);

      const { error: songError } = await supabase
        .from("song")
        .update({
          title: formData.title,
          type: formData.type,
          style: formData.style,
          recording_year: formData.recording_year || null,
          is_instrumental: formData.is_instrumental,
          orchestra_id: formData.orchestra_id || null,
          spotify_id: formData.spotify_id || null,
          duration: formData.duration,
        })
        .eq("id", songId);

      if (songError) throw songError;

      const { error: deleteError } = await supabase
        .from("song_singer")
        .delete()
        .eq("song_id", songId);

      if (deleteError) throw deleteError;

      if (formData.singers.length > 0) {
        const songSingerData = formData.singers.map((singerId: number) => ({
          song_id: songId,
          singer_id: singerId,
        }));

        const { error: singerError } = await supabase
          .from("song_singer")
          .insert(songSingerData);

        if (singerError) throw singerError;
      }

      toast({
        title: "Success",
        description: "Song updated successfully",
      });

      navigate("/songs");
    } catch (error) {
      console.error("Error updating song:", error);
      toast({
        title: "Error",
        description: "Failed to update song",
        variant: "destructive",
      });
    }
  };

  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <h1 className="text-3xl font-bold text-tango-light mb-6">Edit Song</h1>
      <div className="bg-tango-gray rounded-lg p-6">
        <SongForm initialData={song} onSubmit={handleSubmit} />
      </div>
    </main>
  );
};

export default EditSong;