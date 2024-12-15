import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import SongForm from "@/components/song/SongForm";
import { useQuery } from "@tanstack/react-query";

const AddSong = () => {
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

  if (userRole !== "moderator") {
    navigate("/songs");
    return null;
  }

  const handleSubmit = async (formData: any) => {
    try {
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

      toast({
        title: "Success",
        description: "Song added successfully",
      });

      // Redirect to songs page after successful creation
      navigate("/songs");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add song",
        variant: "destructive",
      });
    }
  };

  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <h1 className="text-3xl font-bold text-tango-light mb-6">Add New Song</h1>
      <div className="bg-tango-gray rounded-lg p-6">
        <SongForm onSubmit={handleSubmit} />
      </div>
    </main>
  );
};

export default AddSong;