import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ToggleLeft, ToggleRight } from "lucide-react";

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
    <div className="bg-tango-gray rounded-lg p-4 mb-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex items-center justify-between sm:justify-start gap-4">
          <div className="flex items-center space-x-2">
            <Switch
              checked={includeMine}
              onCheckedChange={(checked) => onVisibilityChange("mine", checked)}
              className="data-[state=checked]:bg-tango-red"
            />
            <Label className="text-tango-light flex items-center gap-2">
              {includeMine ? <ToggleRight className="h-4 w-4" /> : <ToggleLeft className="h-4 w-4" />}
              My Playlists
            </Label>
          </div>
        </div>

        <div className="flex items-center justify-between sm:justify-start gap-4">
          <div className="flex items-center space-x-2">
            <Switch
              checked={includeShared}
              onCheckedChange={(checked) => onVisibilityChange("shared", checked)}
              className="data-[state=checked]:bg-tango-red"
            />
            <Label className="text-tango-light flex items-center gap-2">
              {includeShared ? <ToggleRight className="h-4 w-4" /> : <ToggleLeft className="h-4 w-4" />}
              Shared with me
            </Label>
          </div>
        </div>

        <div className="flex items-center justify-between sm:justify-start gap-4">
          <div className="flex items-center space-x-2">
            <Switch
              checked={includePublic}
              onCheckedChange={(checked) => onVisibilityChange("public", checked)}
              className="data-[state=checked]:bg-tango-red"
            />
            <Label className="text-tango-light flex items-center gap-2">
              {includePublic ? <ToggleRight className="h-4 w-4" /> : <ToggleLeft className="h-4 w-4" />}
              Public Playlists
            </Label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaylistVisibilityFilters;