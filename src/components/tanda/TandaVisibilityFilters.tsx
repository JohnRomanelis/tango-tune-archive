import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ToggleLeft, ToggleRight } from "lucide-react";

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
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-tango-light flex items-center gap-2"
          >
            {includeMine ? (
              <>
                <ToggleRight className="h-4 w-4 text-tango-red" />
                My Tandas
              </>
            ) : (
              <>
                <ToggleLeft className="h-4 w-4" />
                My Tandas
              </>
            )}
          </label>
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            checked={includeShared}
            onCheckedChange={(checked) => onVisibilityChange('shared', checked)}
          />
          <label
            htmlFor="shared"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-tango-light flex items-center gap-2"
          >
            {includeShared ? (
              <>
                <ToggleRight className="h-4 w-4 text-tango-red" />
                Shared with Me
              </>
            ) : (
              <>
                <ToggleLeft className="h-4 w-4" />
                Shared with Me
              </>
            )}
          </label>
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            checked={includePublic}
            onCheckedChange={(checked) => onVisibilityChange('public', checked)}
          />
          <label
            htmlFor="public"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-tango-light flex items-center gap-2"
          >
            {includePublic ? (
              <>
                <ToggleRight className="h-4 w-4 text-tango-red" />
                Public Tandas
              </>
            ) : (
              <>
                <ToggleLeft className="h-4 w-4" />
                Public Tandas
              </>
            )}
          </label>
        </div>
      </div>
    </div>
  );
};

export default TandaVisibilityFilters;