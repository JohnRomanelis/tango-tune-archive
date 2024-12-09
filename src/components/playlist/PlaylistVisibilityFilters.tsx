import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface PlaylistVisibilityFiltersProps {
  includeMine: boolean;
  includeShared: boolean;
  includePublic: boolean;
  onVisibilityChange: (type: "mine" | "shared" | "public", checked: boolean) => void;
}

const PlaylistVisibilityFilters = ({
  includeMine,
  includeShared,
  includePublic,
  onVisibilityChange,
}: PlaylistVisibilityFiltersProps) => {
  return (
    <div className="bg-tango-gray rounded-lg p-4 mb-6 flex gap-6">
      <div className="flex items-center space-x-2">
        <Switch
          checked={includeMine}
          onCheckedChange={(checked) => onVisibilityChange("mine", checked)}
        />
        <Label>My Playlists</Label>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          checked={includeShared}
          onCheckedChange={(checked) => onVisibilityChange("shared", checked)}
        />
        <Label>Shared with me</Label>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          checked={includePublic}
          onCheckedChange={(checked) => onVisibilityChange("public", checked)}
        />
        <Label>Public Playlists</Label>
      </div>
    </div>
  );
};

export default PlaylistVisibilityFilters;