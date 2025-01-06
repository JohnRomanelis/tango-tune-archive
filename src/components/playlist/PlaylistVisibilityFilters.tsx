import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface PlaylistVisibilityFiltersProps {
  includeMine: boolean;
  includeShared: boolean;
  includePublic: boolean;
  likedOnly: boolean;
  onVisibilityChange: (type: "mine" | "shared" | "public" | "liked", checked: boolean) => void;
}

const PlaylistVisibilityFilters = ({
  includeMine,
  includeShared,
  includePublic,
  likedOnly,
  onVisibilityChange,
}: PlaylistVisibilityFiltersProps) => {
  return (
    <div className="bg-tango-gray rounded-lg p-4 mb-6">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex items-center justify-between sm:justify-start gap-4">
            <div className="flex items-center space-x-2">
              <Switch
                checked={includeMine}
                onCheckedChange={(checked) => onVisibilityChange("mine", checked)}
              />
              <Label className="text-tango-light">
                My Playlists
              </Label>
            </div>
          </div>

          <div className="flex items-center justify-between sm:justify-start gap-4">
            <div className="flex items-center space-x-2">
              <Switch
                checked={includeShared}
                onCheckedChange={(checked) => onVisibilityChange("shared", checked)}
              />
              <Label className="text-tango-light">
                Shared with me
              </Label>
            </div>
          </div>

          <div className="flex items-center justify-between sm:justify-start gap-4">
            <div className="flex items-center space-x-2">
              <Switch
                checked={includePublic}
                onCheckedChange={(checked) => onVisibilityChange("public", checked)}
              />
              <Label className="text-tango-light">
                Public Playlists
              </Label>
            </div>
          </div>
        </div>

        <div className="border-t border-tango-border pt-4">
          <div className="flex items-center space-x-2">
            <Switch
              checked={likedOnly}
              onCheckedChange={(checked) => onVisibilityChange("liked", checked)}
            />
            <Label className="text-tango-light">
              Liked Playlists Only
            </Label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaylistVisibilityFilters;