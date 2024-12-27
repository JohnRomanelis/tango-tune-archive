import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface TandaVisibilityFiltersProps {
  includeMine: boolean;
  includeShared: boolean;
  includePublic: boolean;
  onVisibilityChange: (type: 'mine' | 'shared' | 'public', checked: boolean) => void;
}

const TandaVisibilityFilters = ({
  includeMine,
  includeShared,
  includePublic,
  onVisibilityChange,
}: TandaVisibilityFiltersProps) => {
  return (
    <div className="space-y-2">
      <Label>Include:</Label>
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Switch
            checked={includeMine}
            onCheckedChange={(checked) => onVisibilityChange('mine', checked)}
          />
          <label
            htmlFor="mine"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-tango-light"
          >
            My Tandas
          </label>
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            checked={includeShared}
            onCheckedChange={(checked) => onVisibilityChange('shared', checked)}
          />
          <label
            htmlFor="shared"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-tango-light"
          >
            Shared with Me
          </label>
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            checked={includePublic}
            onCheckedChange={(checked) => onVisibilityChange('public', checked)}
          />
          <label
            htmlFor="public"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-tango-light"
          >
            Public Tandas
          </label>
        </div>
      </div>
    </div>
  );
};

export default TandaVisibilityFilters;