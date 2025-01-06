import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface TandaVisibilityFiltersProps {
  includeMine: boolean;
  includeShared: boolean;
  includePublic: boolean;
  includeLiked?: boolean;
  onVisibilityChange: (type: string, checked: boolean) => void;
}

const TandaVisibilityFilters = ({
  includeMine,
  includeShared,
  includePublic,
  includeLiked = false,
  onVisibilityChange,
}: TandaVisibilityFiltersProps) => {
  return (
    <div className="space-y-4">
      <Label>Visibility</Label>
      <div className="grid grid-cols-1 gap-2">
        <div className="flex items-center space-x-2">
          <Switch
            checked={includeMine}
            onCheckedChange={(checked) => onVisibilityChange("mine", checked)}
          />
          <span className="text-sm text-tango-light">Show my tandas</span>
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            checked={includeShared}
            onCheckedChange={(checked) => onVisibilityChange("shared", checked)}
          />
          <span className="text-sm text-tango-light">Show shared with me</span>
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            checked={includePublic}
            onCheckedChange={(checked) => onVisibilityChange("public", checked)}
          />
          <span className="text-sm text-tango-light">Show public tandas</span>
        </div>
      </div>
    </div>
  );
};

export default TandaVisibilityFilters;