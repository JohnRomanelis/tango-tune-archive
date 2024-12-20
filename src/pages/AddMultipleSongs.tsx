import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { SongTemplate, SongType, SongStyle } from "@/types/song";
import { TablesInsert } from "@/integrations/supabase/types";
import SharedSongFields from "@/components/song/SharedSongFields";
import SongTemplateForm from "@/components/song/SongTemplateForm";

const AddMultipleSongs = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Shared fields
  const [orchestraId, setOrchestraId] = useState("");
  const [selectedSingers, setSelectedSingers] = useState<number[]>([]);
  const [isInstrumental, setIsInstrumental] = useState(false);
  const [type, setType] = useState<SongType>("tango");
  const [style, setStyle] = useState<SongStyle>("rhythmic");

  // Individual song templates
  const [songTemplates, setSongTemplates] = useState<SongTemplate[]>([
    { id: "1", title: "", recording_year: "", spotify_id: "", duration: 0 },
  ]);

  const { data: orchestras } = useQuery({
    queryKey: ["orchestras"],
    queryFn: async () => {
      const { data } = await supabase
        .from("orchestra")
        .select("*")
        .order("name");
      return data || [];
    },
  });

  const { data: singers } = useQuery({
    queryKey: ["singers"],
    queryFn: async () => {
      const { data } = await supabase
        .from("singer")
        .select("*")
        .order("name");
      return data || [];
    },
  });

  const handleOrchestraSelect = (orchestraName: string) => {
    const orchestra = orchestras?.find((o) => o.name === orchestraName);
    setOrchestraId(orchestra?.id?.toString() || "");
  };

  const handleSongTemplateChange = (id: string, field: keyof SongTemplate, value: any) => {
    setSongTemplates(prev =>
      prev.map(template =>
        template.id === id ? { ...template, [field]: value } : template
      )
    );
  };

  const addSongTemplate = () => {
    setSongTemplates(prev => [
      ...prev,
      {
        id: (prev.length + 1).toString(),
        title: "",
        recording_year: "",
        spotify_id: "",
        duration: 0,
      },
    ]);
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);

      const songsToInsert: TablesInsert<"song">[] = songTemplates.map(template => ({
        title: template.title,
        type,
        style,
        recording_year: template.recording_year ? parseInt(template.recording_year) : null,
        is_instrumental: isInstrumental,
        orchestra_id: orchestraId ? parseInt(orchestraId) : null,
        spotify_id: template.spotify_id || null,
        duration: template.duration || null,
      }));

      const { data: songs, error: songError } = await supabase
        .from("song")
        .insert(songsToInsert)
        .select();

      if (songError) throw songError;

      if (selectedSingers.length > 0 && songs) {
        const songSingerData = songs.flatMap(song => 
          selectedSingers.map(singerId => ({
            song_id: song.id,
            singer_id: singerId,
          }))
        );

        const { error: singerError } = await supabase
          .from("song_singer")
          .insert(songSingerData);

        if (singerError) throw singerError;
      }

      toast({
        title: "Success",
        description: `${songTemplates.length} songs added successfully`,
      });

      navigate("/songs");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add songs",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <h1 className="text-3xl font-bold text-tango-light mb-6">Add Multiple Songs</h1>
      
      <div className="bg-tango-gray rounded-lg p-6 space-y-6">
        <SharedSongFields
          orchestraId={orchestraId}
          selectedSingers={selectedSingers}
          isInstrumental={isInstrumental}
          type={type}
          style={style}
          orchestras={orchestras || []}
          singers={singers || []}
          onOrchestraSelect={handleOrchestraSelect}
          onSingersChange={setSelectedSingers}
          onInstrumentalChange={setIsInstrumental}
          onTypeChange={setType}
          onStyleChange={setStyle}
        />

        <div className="border-t border-tango-darkGray my-6"></div>

        <div className="space-y-6">
          {songTemplates.map((template) => (
            <SongTemplateForm
              key={template.id}
              template={template}
              onChange={handleSongTemplateChange}
            />
          ))}
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={addSongTemplate}
          className="w-full gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Another Song
        </Button>

        <div className="flex justify-end space-x-4">
          <Button
            variant="outline"
            onClick={() => navigate("/songs")}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-tango-red hover:bg-tango-red/90"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adding Songs...
              </>
            ) : (
              'Add Songs'
            )}
          </Button>
        </div>
      </div>
    </main>
  );
};

export default AddMultipleSongs;