import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ToggleLeft, ToggleRight } from "lucide-react";
import AutocompleteInput from "@/components/AutocompleteInput";

interface Orchestra {
  id: number;
  name: string;
}

interface SongAdditionalInfoProps {
  orchestras: Orchestra[];
  orchestraId: string;
  isInstrumental: boolean;
  spotifyId: string;
  onOrchestraChange: (value: string) => void;
  onInstrumentalChange: (value: boolean) => void;
  onSpotifyIdChange: (value: string) => void;
}

const SongAdditionalInfo = ({
  orchestras = [],
  orchestraId = "",
  isInstrumental,
  spotifyId,
  onOrchestraChange,
  onInstrumentalChange,
  onSpotifyIdChange,
}: SongAdditionalInfoProps) => {
  const selectedOrchestra = orchestras.find(
    (o) => o.id?.toString() === orchestraId
  );

  const handleOrchestraSelect = (orchestraName: string) => {
    const orchestra = orchestras.find((o) => o.name === orchestraName);
    onOrchestraChange(orchestra?.id?.toString() || "");
  };

  const handleSpotifyIdChange = (value: string) => {
    try {
      if (value.includes('spotify.com/track/')) {
        const match = value.match(/track\/([^?]+)/);
        if (match && match[1]) {
          onSpotifyIdChange(match[1]);
          return;
        }
      }
      onSpotifyIdChange(value);
    } catch (error) {
      onSpotifyIdChange(value);
    }
  };

  return (
    <div className="space-y-4">
      <AutocompleteInput
        label="Orchestra"
        value={selectedOrchestra?.name || ""}
        onChange={handleOrchestraSelect}
        options={orchestras}
        placeholder="Search orchestras..."
      />

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Switch
            id="is_instrumental"
            checked={isInstrumental}
            onCheckedChange={onInstrumentalChange}
            className="data-[state=checked]:bg-tango-red"
          />
          <Label htmlFor="is_instrumental" className="flex items-center gap-2">
            {isInstrumental ? (
              <ToggleRight className="h-4 w-4" />
            ) : (
              <ToggleLeft className="h-4 w-4" />
            )}
            Instrumental
          </Label>
        </div>
      </div>

      <div>
        <Label htmlFor="spotify_id">Spotify ID</Label>
        <Input
          id="spotify_id"
          value={spotifyId}
          onChange={(e) => handleSpotifyIdChange(e.target.value)}
          className="bg-tango-darkGray text-tango-light"
          placeholder="Spotify track ID or URL"
        />
        <span className="text-xs text-tango-light mt-1 block">
          You can paste either a Spotify track ID or full URL
        </span>
      </div>
    </div>
  );
};

export default SongAdditionalInfo;