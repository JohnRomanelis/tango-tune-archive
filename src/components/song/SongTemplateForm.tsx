import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import DurationInput from "./DurationInput";
import { SongTemplate } from "@/types/song";

interface SongTemplateFormProps {
  template: SongTemplate;
  onChange: (id: string, field: keyof SongTemplate, value: any) => void;
}

const SongTemplateForm = ({ template, onChange }: SongTemplateFormProps) => {
  const handleSpotifyIdChange = (value: string) => {
    try {
      if (value.includes('spotify.com/track/')) {
        const match = value.match(/track\/([^?]+)/);
        if (match && match[1]) {
          onChange(template.id, 'spotify_id', match[1]);
          return;
        }
      }
      onChange(template.id, 'spotify_id', value);
    } catch (error) {
      onChange(template.id, 'spotify_id', value);
    }
  };

  return (
    <div className="p-4 bg-tango-darkGray rounded-lg space-y-4">
      <h3 className="text-lg font-semibold text-tango-light">
        Song {parseInt(template.id)}
      </h3>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor={`title-${template.id}`}>Title</Label>
          <Input
            id={`title-${template.id}`}
            value={template.title}
            onChange={(e) => onChange(template.id, 'title', e.target.value)}
            className="bg-tango-gray text-tango-light"
          />
        </div>

        <div>
          <Label htmlFor={`year-${template.id}`}>Recording Year</Label>
          <Input
            id={`year-${template.id}`}
            type="number"
            value={template.recording_year}
            onChange={(e) => onChange(template.id, 'recording_year', e.target.value)}
            className="bg-tango-gray text-tango-light"
          />
        </div>

        <DurationInput
          durationInSeconds={template.duration}
          onChange={(duration) => onChange(template.id, 'duration', duration)}
        />

        <div>
          <Label htmlFor={`spotify-${template.id}`}>Spotify ID</Label>
          <Input
            id={`spotify-${template.id}`}
            value={template.spotify_id}
            onChange={(e) => handleSpotifyIdChange(e.target.value)}
            className="bg-tango-gray text-tango-light"
            placeholder="Spotify track ID or URL"
          />
        </div>
      </div>
    </div>
  );
};

export default SongTemplateForm;