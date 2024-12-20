import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ToggleLeft, ToggleRight } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState, useEffect } from "react";

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
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredOrchestras, setFilteredOrchestras] = useState(orchestras);

  useEffect(() => {
    const filtered = orchestras.filter((orchestra) =>
      orchestra.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredOrchestras(filtered);
  }, [searchTerm, orchestras]);

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
      <div className="space-y-2">
        <Label htmlFor="orchestra">Orchestra</Label>
        <Input
          type="text"
          placeholder="Search orchestras..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-tango-darkGray text-tango-light mb-2"
        />
        <ScrollArea className="h-48 bg-tango-darkGray rounded-md border border-tango-gray">
          <div className="p-2 space-y-1">
            <div
              className={`p-2 rounded-md cursor-pointer ${
                !orchestraId ? "bg-tango-red/10 border-tango-red" : ""
              }`}
              onClick={() => onOrchestraChange("")}
            >
              No Orchestra
            </div>
            {filteredOrchestras.map((orchestra) => (
              <div
                key={orchestra.id}
                className={`p-2 rounded-md cursor-pointer hover:bg-tango-darkGray/50 ${
                  orchestraId === orchestra.id.toString()
                    ? "bg-tango-red/10 border-tango-red"
                    : ""
                }`}
                onClick={() => onOrchestraChange(orchestra.id.toString())}
              >
                {orchestra.name}
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

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