import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

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
  orchestras,
  orchestraId,
  isInstrumental,
  spotifyId,
  onOrchestraChange,
  onInstrumentalChange,
  onSpotifyIdChange,
}: SongAdditionalInfoProps) => {
  const handleSpotifyIdChange = (value: string) => {
    try {
      // Check if the input is a Spotify URL
      if (value.includes('spotify.com/track/')) {
        // Extract the ID from the URL
        const match = value.match(/track\/([^?]+)/);
        if (match && match[1]) {
          onSpotifyIdChange(match[1]);
          return;
        }
      }
      // If not a URL or couldn't extract ID, pass the value as is
      onSpotifyIdChange(value);
    } catch (error) {
      // If any error occurs, just pass the original value
      onSpotifyIdChange(value);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="orchestra">Orchestra</Label>
        <select
          id="orchestra"
          value={orchestraId}
          onChange={(e) => onOrchestraChange(e.target.value)}
          className="w-full bg-tango-darkGray text-tango-light rounded-md border border-input px-3 py-2"
        >
          <option value="">Select Orchestra</option>
          {orchestras?.map((orchestra) => (
            <option key={orchestra.id} value={orchestra.id}>
              {orchestra.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="is_instrumental"
          checked={isInstrumental}
          onCheckedChange={onInstrumentalChange}
        />
        <Label htmlFor="is_instrumental">Instrumental</Label>
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