import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import SongBasicInfo from "./SongBasicInfo";
import SongAdditionalInfo from "./SongAdditionalInfo";
import SingerSelect from "./SingerSelect";
import DurationInput from "./DurationInput";

interface SongFormProps {
  initialData?: {
    id?: number;
    title: string;
    type: string;
    style: string;
    recording_year?: number;
    is_instrumental: boolean;
    orchestra_id?: number;
    spotify_id?: string;
    singers?: number[];
    duration?: number;
  };
  onSubmit: (data: any) => Promise<void>;
  submitButtonText?: string;
}

const SongForm = ({ initialData, onSubmit, submitButtonText = "Add Song" }: SongFormProps) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    type: "tango",
    style: "rhythmic",
    recording_year: "",
    is_instrumental: false,
    orchestra_id: "",
    spotify_id: "",
    singers: [] as number[],
    duration: 0,
    ...initialData,
  });

  const { data: orchestras } = useQuery({
    queryKey: ["orchestras"],
    queryFn: async () => {
      const { data } = await supabase
        .from("orchestra")
        .select("*")
        .order("name");
      return data;
    },
  });

  const { data: singers } = useQuery({
    queryKey: ["singers"],
    queryFn: async () => {
      const { data } = await supabase
        .from("singer")
        .select("*")
        .order("name");
      return data;
    },
  });

  const handleSingerToggle = (singerId: number) => {
    setFormData(prev => ({
      ...prev,
      singers: prev.singers.includes(singerId)
        ? prev.singers.filter(id => id !== singerId)
        : [...prev.singers, singerId],
    }));
  };

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      onSubmit(formData);
    }} className="space-y-6">
      <SongBasicInfo
        title={formData.title}
        type={formData.type}
        style={formData.style}
        recordingYear={formData.recording_year.toString()}
        onTitleChange={(value) => setFormData(prev => ({ ...prev, title: value }))}
        onTypeChange={(value) => setFormData(prev => ({ ...prev, type: value }))}
        onStyleChange={(value) => setFormData(prev => ({ ...prev, style: value }))}
        onRecordingYearChange={(value) => setFormData(prev => ({ ...prev, recording_year: value ? parseInt(value) : undefined }))}
      />

      <DurationInput
        durationInSeconds={formData.duration}
        onChange={(duration) => setFormData(prev => ({ ...prev, duration }))}
      />

      <SongAdditionalInfo
        orchestras={orchestras || []}
        orchestraId={formData.orchestra_id?.toString() || ""}
        isInstrumental={formData.is_instrumental}
        spotifyId={formData.spotify_id || ""}
        onOrchestraChange={(value) => setFormData(prev => ({ ...prev, orchestra_id: value ? parseInt(value) : undefined }))}
        onInstrumentalChange={(value) => setFormData(prev => ({ ...prev, is_instrumental: value }))}
        onSpotifyIdChange={(value) => setFormData(prev => ({ ...prev, spotify_id: value }))}
      />

      {singers && (
        <SingerSelect
          singers={singers}
          selectedSingers={formData.singers}
          onSingerToggle={handleSingerToggle}
        />
      )}

      <div className="flex justify-end space-x-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate("/songs")}
        >
          Cancel
        </Button>
        <Button type="submit" className="bg-tango-red hover:bg-tango-red/90">
          {initialData ? "Update Song" : submitButtonText}
        </Button>
      </div>
    </form>
  );
};

export default SongForm;