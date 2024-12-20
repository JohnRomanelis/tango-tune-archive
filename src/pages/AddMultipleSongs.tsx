import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import AutocompleteInput from "@/components/AutocompleteInput";
import SingerSelect from "@/components/song/SingerSelect";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import SongTemplateForm from "@/components/song/SongTemplateForm";
import { SongTemplate } from "@/types/song";
import { TablesInsert } from "@/integrations/supabase/types";

const AddMultipleSongs = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Shared fields
  const [orchestraId, setOrchestraId] = useState("");
  const [selectedSingers, setSelectedSingers] = useState<number[]>([]);
  const [isInstrumental, setIsInstrumental] = useState(false);
  const [type, setType] = useState<"tango" | "milonga" | "vals">("tango");
  const [style, setStyle] = useState<"rhythmic" | "melodic" | "dramatic">("rhythmic");

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

      // Insert singer associations
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

  const selectedOrchestra = orchestras?.find(
    o => o.id?.toString() === orchestraId
  );

  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <h1 className="text-3xl font-bold text-tango-light mb-6">Add Multiple Songs</h1>
      
      <div className="bg-tango-gray rounded-lg p-6 space-y-6">
        {/* Shared Fields */}
        <div className="space-y-4">
          <AutocompleteInput
            label="Orchestra"
            value={selectedOrchestra?.name || ""}
            onChange={handleOrchestraSelect}
            options={orchestras || []}
            placeholder="Search orchestras..."
          />

          {singers && (
            <SingerSelect
              singers={singers}
              selectedSingers={selectedSingers}
              onSingerToggle={(singerId) => {
                setSelectedSingers(prev =>
                  prev.includes(singerId)
                    ? prev.filter(id => id !== singerId)
                    : [...prev, singerId]
                );
              }}
            />
          )}

          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <Label htmlFor="type">Type</Label>
              <select
                id="type"
                value={type}
                onChange={(e) => setType(e.target.value as typeof type)}
                className="w-full bg-tango-darkGray text-tango-light rounded-md border border-input px-3 py-2"
              >
                <option value="tango">Tango</option>
                <option value="milonga">Milonga</option>
                <option value="vals">Vals</option>
              </select>
            </div>

            <div className="flex-1">
              <Label htmlFor="style">Style</Label>
              <select
                id="style"
                value={style}
                onChange={(e) => setStyle(e.target.value as typeof style)}
                className="w-full bg-tango-darkGray text-tango-light rounded-md border border-input px-3 py-2"
              >
                <option value="rhythmic">Rhythmic</option>
                <option value="melodic">Melodic</option>
                <option value="dramatic">Dramatic</option>
              </select>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="is_instrumental"
              checked={isInstrumental}
              onCheckedChange={setIsInstrumental}
              className="data-[state=checked]:bg-tango-red"
            />
            <Label htmlFor="is_instrumental">Instrumental</Label>
          </div>
        </div>

        <div className="border-t border-tango-darkGray my-6"></div>

        {/* Song Templates */}
        <div className="space-y-6">
          {songTemplates.map((template) => (
            <SongTemplateForm
              key={template.id}
              template={template}
              onChange={handleSongTemplateChange}
            />
          ))}
        </div>

        {/* Add Template Button */}
        <Button
          type="button"
          variant="outline"
          onClick={addSongTemplate}
          className="w-full gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Another Song
        </Button>

        {/* Submit Button */}
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