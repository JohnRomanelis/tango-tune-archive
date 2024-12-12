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
          onChange={(e) => onSpotifyIdChange(e.target.value)}
          className="bg-tango-darkGray text-tango-light"
          placeholder="Spotify track ID"
        />
      </div>
    </div>
  );
};

export default SongAdditionalInfo;